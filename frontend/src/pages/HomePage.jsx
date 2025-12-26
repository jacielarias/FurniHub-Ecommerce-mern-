import { useEffect, useState } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";


const categories = [
	{ href: "/chairs", name: "Chairs", imageUrl: "/chair.png" },
	{ href: "/sofa", name: "Sofa", imageUrl: "/furni_03.png" },
	{ href: "/sideboards", name: "Sideboards", imageUrl: "/furni_01.png" },
];

const slider = [
	{ name: "Chair", imageUrl: "/chair.png" },
	{ name: "Table", imageUrl: "/furni_01.png" },
	{ name: "Bed", imageUrl: "/furni_02.png" },
]

const HomePage = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const selectedImageSlide = slider[currentIndex].imageUrl;

	const { fetchFeaturedProducts, products = [], loading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	useEffect(() => {
		const timer = setTimeout(() => setCurrentIndex((prevIndex) => prevIndex === slider.length - 1 ? 0 : prevIndex + 1 ), 4000);
		return () => clearTimeout(timer);
	}, [selectedImageSlide]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className="w-full h-[100vh] flex justify-around items-center px-20 gap-20 bg-gray-100 relative">
					<img
						src="/pendant-lights.png"
						alt="pendant lights"
						className="absolute top-0 left-80 h-80 w-auto z-0 pointer-events-none"
					/>

				<div className="text-[#444] w-1/2 z-20 mt-20">
					<h1 className="text-6xl font-bold mb-10">New Furniture <span className="text-emerald-400">2026</span></h1>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique ducimus dignissimos, repellat accusamus sed omnis!</p>
					<button className="border-[#444] border px-14 py-2 mt-8 hover:bg-emerald-400 hover:border-emerald-400 hover:text-white cursor-pointer">
						Shop Now
					</button>
				</div>

				<div className="w-1/2 relative flex justify-center items-center">

				<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-gray-200 z-10"></span>

				<img
					key={selectedImageSlide}
					src={selectedImageSlide}
					alt=""
					className="w-[90%] h-auto transition-all ease-in-out transform hover:scale-105 z-20 duration-500"
				/>

				<div className="absolute -bottom-16 flex gap-3 z-20">
					{slider.map((cat, index) => (
					<button
						key={cat.name}
						onClick={() => setCurrentIndex(index)}
						className={`p-1 transition-all duration-300 ${
						currentIndex === index
							? "ring-2 ring-emerald-400 scale-110"
							: "opacity-60 hover:opacity-100"
						}`}
					>
						<img
							src={cat.imageUrl}
							alt={cat.name}
							className="w-16 aspect-square object-cover bg-gray-300"
						/>
					</button>
					))}
				</div>
				</div>
			</div>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-36'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!loading && products?.length > 0 && (
					<FeaturedProducts featuredProducts={products} />
				)}
			</div>
		</div>
	);
};
export default HomePage;
