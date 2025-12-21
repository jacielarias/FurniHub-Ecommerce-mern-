import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className='border-b border-gray-300 p-4 md:p-6 text-[#444] cursor-pointer'>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				<div className='shrink-0 md:order-1'>
					<img className='h-20 md:h-32 rounded object-cover' src={item.image} />
				</div>
				<label className='sr-only'>Choose quantity:</label>

				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					<div className='flex items-center gap-2 '>
						<button
							className='inline-flex h-7 w-7 shrink-0 items-center justify-center focus:outline-none focus:ring-2
							  focus:ring-emerald-500 cursor-pointer'
							onClick={() => updateQuantity(item._id, item.quantity - 1)}
						>
							<Minus className='' />
						</button>
						<p className="px-4 py-2  border border-[#777]">{item.quantity}</p>
						<button
							className='inline-flex h-7 w-7 shrink-0 items-center justify-center focus:outline-none 
						focus:ring-2 focus:ring-emerald-500 cursor-pointer'
							onClick={() => updateQuantity(item._id, item.quantity + 1)}
						>
							<Plus className='' />
						</button>
					</div>

					<div className='text-end md:order-4 md:w-32'>
						<p className='text-2xl font-bold text-emerald-400'>${item.price}</p>
					</div>
				</div>

				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					<p className='text-lg font-medium hover:text-emerald-400 hover:underline'>
						{item.name}
					</p>
					<p className='text-sm text-gray-400'>{item.description}</p>

					<div className='flex items-center gap-4'>
						<button
							className='inline-flex items-center text-sm font-medium
							 hover:text-red-300 hover:underline h-5 w-5 cursor-pointer'
							onClick={() => removeFromCart(item._id)}
						>
							<Trash />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CartItem;
