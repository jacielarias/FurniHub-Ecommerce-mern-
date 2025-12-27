import { motion } from "framer-motion";
import { Trash, Star, Pencil, Upload, Loader, PlusCircle, X } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const categories = ["chairs", "sofa", "shoes", "glasses", "jackets", "suits", "bags"];

const ProductsList = () => {
	const [openModal, setIsOpenModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});
	
	const { deleteProduct, toggleFeaturedProduct, products, editProduct, loading } = useProductStore();

	const handleOpenModal = (product) => {
		setSelectedProduct(product);
		setIsOpenModal(true);
	};

	const handleCloseModal = () => {
		setIsOpenModal(false);
		setSelectedProduct(null);
		setNewProduct({
			name: "",
			description: "",
			price: "",
			category: "",
			image: "",
		});
	};

	useEffect(() => {
		if (openModal) {
			// Bloquea el scroll del body
			document.body.style.overflow = "hidden";
		} else {
			// Restaura el scroll
			document.body.style.overflow = "";
		}

		// Limpieza por si el componente se desmonta
		return () => {
			document.body.style.overflow = "";
		};
	}, [openModal]);

	useEffect(() => {
		if (selectedProduct) {
			setNewProduct({
				name: selectedProduct.name,
				description: selectedProduct.description,
				price: selectedProduct.price,
				category: selectedProduct.category,
				image: selectedProduct.image,
			});
		}
	}, [selectedProduct]);
	
	const handleUpdateProduct = async (e) => {
		e.preventDefault();

		if (!selectedProduct) return;

		const updatedProduct = { ...newProduct };

		if (updatedProduct.image === selectedProduct.image) {
			delete updatedProduct.image;
		}

		await editProduct(selectedProduct._id, updatedProduct);

		setIsOpenModal(false);
		setSelectedProduct(null);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			setNewProduct((prev) => ({
				...prev,
				image: reader.result, // base64
			}));
		};

		reader.readAsDataURL(file);
	};

	return (
		<motion.div
			className='bg-white shadow-xl max-w-5xl mx-auto text-[#444]'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className="overflow-x-auto">
			<table className=' min-w-full '>
				<thead className='bg-gray-100 border-b'>
					<tr>
						<th
							scope='col'
							className='px-6 py-5 text-left text-xs font-medium uppercase tracking-wider'
						>
							Product
						</th>
						<th
							scope='col'
							className='px-6 py-5 text-left text-xs font-medium uppercase tracking-wider'
						>
							Price
						</th>
						<th
							scope='col'
							className='px-6 py-5 text-left text-xs font-medium uppercase tracking-wider'
						>
							Category
						</th>

						<th
							scope='col'
							className='px-6 py-5 text-left text-xs font-medium uppercase tracking-wider'
						>
							Featured
						</th>
						<th
							scope='col'
							className='px-6 py-5 text-left text-xs font-medium uppercase tracking-wider'
						>
							Actions
						</th>
					</tr>
				</thead>

				<tbody className='bg-white divide-y divide-gray-300'>
					{products?.map((product) => (
						<tr key={product._id} className='hover:bg-gray-100 cursor-pointer'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img
											className='h-10 w-10 rounded-full object-cover'
											src={product.image}
											alt={product.name}
										/>
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium'>{product.name}</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm'>${Number(product.price || 0).toFixed(2)}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm'>{product.category}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									className={`p-1 rounded-full cursor-pointer ${
										product.isFeatured ? "bg-yellow-400 text-white" : "bg-none"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className='h-5 w-5' />
								</button>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button 
									onClick={() => handleOpenModal(product)} 
									className="text-[#666] hover:text-green-400 cursor-pointer shadow-lg border border-[#e3e3e3] p-3 rounded-full hover:shadow-none mr-2"
								>
									<Pencil className='h-5 w-5' />
								</button>
								<button
									onClick={() => deleteProduct(product._id)}
									className='text-[#666] hover:text-red-600 cursor-pointer shadow-lg border border-[#e3e3e3] p-3 rounded-full hover:shadow-none'
								>
									<Trash className='h-5 w-5' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			</div>
			{ openModal && createPortal(
				
				<div className={`w-full h-lvh bg-[rgba(0,0,0,0.4)] backdrop-blur-md fixed inset-0 z-[9999] flex justify-center items-center`}>
					<div>
					
					<form className='space-y-4 relative bg-white text-[#666] shadow-lg p-8 h-[95vh] w-full lg:w-[450px] max-w-xl mx-auto overflow-auto' onSubmit={handleUpdateProduct}>
					<h2 className='text-2xl font-semibold mb-6 text-emerald-500'>Edit Product</h2>
					<button className="bg-red-500 hover:bg-red-600 cursor-pointer text-white w-[50px] h-[50px] py-4 lg:hidden flex justify-center items-center absolute top-0 right-0" onClick={handleCloseModal}>
						<X />
					</button>
					<div>
						<label htmlFor='name' className='block text-sm font-medium text-gray-400'>
							Product Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={newProduct.name}
							onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
							className='mt-1 block w-full bg-gray-100 py-4 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
							required
						/>
					</div>

					<div>
						<label htmlFor='description' className='block text-sm font-medium text-gray-400'>
							Description
						</label>
						<textarea
							id='description'
							name='description'
							value={newProduct.description}
							onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
							rows='3'
							className='mt-1 block w-full bg-gray-100 py-4 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
							required
						/>
					</div>

					<div>
						<label htmlFor='price' className='block text-sm font-medium text-gray-400'>
							Price
						</label>
						<input
							type='number'
							id='price'
							name='price'
							value={newProduct.price}
							onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
							step='0.01'
							className='mt-1 block w-full bg-gray-100 py-4 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
							required
						/>
					</div>

					<div>
						<label htmlFor='category' className='block text-sm font-medium text-gray-400'>
							Category
						</label>
						<select
							id='category'
							name='category'
							value={newProduct.category}
							onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
							className='mt-1 block w-full bg-gray-100 py-4 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
							required
						>
							<option value=''>Select a category</option>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>

					<div className='mt-1 flex items-center'>
						<input
							type='file'
							id='image'
							className='sr-only'
							accept='image/*'
							onChange={handleImageChange}
						/>
						<label
							htmlFor='image'
							className='cursor-pointer bg-gray-700 py-4 px-3 border border-gray-600 text-sm leading-4 font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
						>
							<Upload className='h-5 w-5 inline-block mr-2' />
							Upload Image
						</label>
						{newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
					</div>

					<button
						type='submit'
						className='w-full flex justify-center py-4 px-4 border border-transparent 
						shadow-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer'
						disabled={loading} 
					>
						{loading ? (
							<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<PlusCircle className='mr-2 h-5 w-5' />
									Update Product
								</>
							)}
					</button>
					</form>
					</div>
				</div>,
				document.body
			)}

		</motion.div>
	);
};
export default ProductsList;
