import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js"
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({
				error: "Invalid or empty products array",
			});
		}
		
		const MIN_AMOUNT = 20000;
		let subtotalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100);
			subtotalAmount += amount * product.quantity;

			return {
				price_data: {
				currency: "usd",
				product_data: {
					name: product.name,
					images: [product.image],
				},
				unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let totalAmount = subtotalAmount;
		let coupon = null;
		let isCouponValid = false;

		if (couponCode) {
			coupon = await Coupon.findOne({
				code: couponCode,
				userId: req.user._id,
				isActive: true,
			});
			
			isCouponValid = !!coupon && subtotalAmount >= MIN_AMOUNT;

			if (isCouponValid) {
				totalAmount -= Math.round(
					(totalAmount * coupon.discountPercentage) / 100
				);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: isCouponValid ? [{
					coupon: await createStripeCoupon(
						coupon.discountPercentage
					),
				}]
			: [],
			metadata: {
				userId: req.user._id.toString(),
        		couponCode: isCouponValid ? coupon.code : "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		const newOrder = new Order({
			user: session.metadata.userId,
			products: products.map((product) => ({
				product: product._id,
				quantity: product.quantity,
				price: product.price,
			})),
			status: "pending",
			paymentStatus: "pending",
			totalAmount: session.amount_total / 100,
			stripeSessionId: session.id,
		});

		await newOrder.save();

		if (subtotalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({
			url: session.url,
			id: session.id,
			totalAmount: totalAmount / 100,
			newOrder: newOrder
		});
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({
			message: "Error processing checkout",
			error: error.message,
		});
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;

		const session = await stripe.checkout.sessions.retrieve(sessionId);
		const order = await Order.findOne({
			stripeSessionId: session.id,
		});

		if (session.payment_status === "paid") {
			order.status = "paid";
			order.paymentStatus = "paid"

			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{ isActive: false }
				);
			}

			await order.save();

			await User.updateOne(
				{ _id: session.metadata.userId },
				{ $set: { cartItems: [] } }
			);

			res.status(200).json({
				success: true,
				message:
					"Payment successful, order updated, and coupon deactivated if used.",
				orderId: order._id,
			});
		}else {
			res.status(400).json({
				success: false,
				message: "Payment not completed yet.",
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({
			message: "Error processing successful checkout",
			error: error.message,
		});
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}