import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore.js";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios.js";
import { useEffect } from "react";

const OrderSummary = () => {
	const { total, subtotal, coupon, cart, getMyCoupon, isCouponActive } = useCartStore();

const savings = isCouponActive ? subtotal - total : 0;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	useEffect(() => {
		getMyCoupon();
	}, []);

	const handlePayment = async () => {
		try {
			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
			});

			window.location.href = res.data.url;
		} catch (error) {
			console.error("Checkout error:", error);
	}
	};

	return (
		<motion.div
			className='space-y-6 border-l border-gray-300 p-4 sm:p-6 text-[#666]'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-2xl font-semibold'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-[#666]'>Original price</dt>
						<dd className='text-xl font-medium'>${formattedSubtotal}</dd>
					</dl>

					{isCouponActive && savings > 0 && (
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal'>Savings</dt>
						<dd className='text-base font-medium text-emerald-400'>
						-${savings.toFixed(2)}
						</dd>
					</dl>
					)}

					{isCouponActive && coupon && (
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal'>
						Coupon ({coupon.code})
						</dt>
						<dd className='text-base font-medium text-emerald-400'>
						-{coupon.discountPercentage}%
						</dd>
					</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='flex w-full items-center justify-center shadow-xl bg-emerald-600 px-5 py-4 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 mt-10'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2 mt-8'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};
export default OrderSummary;
