import { BarChart, PlusCircle, ShoppingBasket, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import UsersList from "../components/UsersList";
import { useProductStore } from "../stores/useProductStore";
import { useAdminStore } from "../stores/useAdminStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "users", label: "Users", icon: Users },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();
	const { fetchAllUsers } = useAdminStore();

	useEffect(() => {
		fetchAllProducts();
		fetchAllUsers();
	}, [fetchAllProducts, fetchAllUsers]);

	return (
		<div className='min-h-screen relative overflow-hidden text-[#444] bg-gray-100'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold  mt-36 mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				<div className='flex justify-center mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-4 mx-2 transition-colors duration-200 hover:bg-emerald-600 hover:text-white cursor-pointer ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: ""
							}`}
						>
							<tab.icon className='mr-2 h-5 w-5' />
							{tab.label}
						</button>
					))}
				</div>
				{activeTab === "create" && <CreateProductForm />}
				{activeTab === "products" && <ProductsList />}
				{activeTab === "users" && <UsersList />}
				{activeTab === "analytics" && <AnalyticsTab />}
			</div>
		</div>
	);
};
export default AdminPage;
