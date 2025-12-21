import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
	return (
		<div className="w-full group">
			<Link to={"/category" + category.href}>
				<div className="w-full cursor-pointer">

					{/* Imagen con fondo gris */}
					<div className="h-full bg-gray-100 overflow-hidden">
						<img
							src={category.imageUrl}
							alt={category.name}
							className="w-full h-full object-cover p-10 transition-transform duration-500 ease-out group-hover:scale-110"
							loading="lazy"
						/>
					</div>

					{/* Texto FUERA de la imagen */}
					<div className="p-4 h-80">
						<h3 className="text-[#444] text-2xl font-bold mb-1">
							{category.name}
						</h3>
						<p className="text-gray-500 text-sm">
							Explore {category.name}
						</p>
					</div>

				</div>
			</Link>
		</div>
	);
};

export default CategoryItem;
