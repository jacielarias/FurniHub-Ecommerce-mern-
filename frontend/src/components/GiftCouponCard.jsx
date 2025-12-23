import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, subtotal, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) {
			setUserInputCode(coupon.code)
		}else{
			setUserInputCode("")
		}
	}, [coupon, isCouponApplied, subtotal, removeCoupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");
	};

	return (
		<motion.div
			className='space-y-6 border-l border-gray-300 p-4 sm:p-6 text-[#666]'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='space-y-7'>
				<div>
					<label htmlFor='voucher' className='mb-4 block text-sm font-medium'>
						Do you have a voucher or <span className="font-bold text-emerald-400">gift card</span>?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full border outline-none p-4 text-sm text-emerald-400 font-bold placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500'
						placeholder='Enter code here'
						value={userInputCode}
						onChange={(e) => setUserInputCode(e.target.value)}
						required
					/>
				</div>

				<motion.button
					type='button'
					className='flex w-full items-center justify-center shadow-xl bg-emerald-600 px-5 py-4 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleApplyCoupon}
				>
					Apply Code
				</motion.button>
			</div>
			{coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Applied Coupon</h3>

					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>

					<motion.button
						type='button'
						className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleRemoveCoupon}
					>
						Remove Coupon
					</motion.button>
				</div>
			)}

			{coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium'>Your Available Coupon:</h3>
					<p className='mt-2 text-sm text-emerald-500 font-extrabold decoration-1 underline'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>
				</div>
			)}
		</motion.div>
	);
};
export default GiftCouponCard;
