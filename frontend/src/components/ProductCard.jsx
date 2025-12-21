import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			addToCart(product);
		}
	};

	return (
		<div className='flex w-full max-w-[320px] relative flex-col overflow-hidden text-[#444] cursor-pointer'>
			<div className='relative p-2 flex items-center justify-center h-60 overflow-hidden bg-gray-100 '>
				<img className='object-cover w-auto h-full' src={product.image} alt='product image' />
			</div>

			<div className='mt-2 px-5 pb-5 relative h-36'>
				<h5 className='text-base font-light tracking-tight mt-4 absolute top-4 pr-6'>
					{product.name}</h5>
					<div className='mt-2 mb-5 flex items-center justify-between absolute bottom-0'>
						<p>
							<span className='text-3xl font-bold text-emerald-400'>${product.price}</span>
						</p>
					</div>
			</div>
			<button
				className='flex items-center justify-center shadow-xl bg-emerald-600 p-4 text-center text-sm font-medium rounded-full 
				text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 cursor-pointer absolute bottom-[32%] right-5'
				onClick={handleAddToCart}
			>
				<ShoppingCart size={22} />
			</button>
		</div>
	);
};
export default ProductCard;
