import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons/");

			if (response.data) {
				set({
					coupon: response.data,
					isCouponApplied: true,
				});
				get().calculateTotals();
			}
		} catch {
			set({ coupon: null, isCouponApplied: false });
		}
	},
	applyCoupon: async (code) => {
		try {
			const { subtotal } = get();

			const response = await axios.post("/coupons/validate", {
				code,
				totalAmount: subtotal,
			});

			set({
				coupon: response.data,
				isCouponApplied: true,
			});

			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Invalid coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},
	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });

			const message =
				error.response?.data?.message ||
				error.message ||
				"An error occurred while fetching cart";

			toast.error(message);
		}
	},
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	addToCart: async (product) => {
		try {
			await axios.post("/cart", { productId: product._id });
			toast.success("Product added to cart");

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals();
	},
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},
	calculateTotals: () => {
	const { cart, coupon } = get();

		const subtotal = cart.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		);

		let total = subtotal;
		let isCouponActive = false;

		if (coupon && subtotal >= 200) {
			total -= subtotal * (coupon.discountPercentage / 100);
			isCouponActive = true;
		}

		set({
			subtotal,
			total,
			isCouponActive,
		});
	},

}));
