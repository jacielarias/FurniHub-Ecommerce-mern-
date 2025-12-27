import { ShoppingCart, User, LogOut, Lock, Search, Equal, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState, useEffect } from "react";
const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [ isSticky, setIsSticky ] = useState(false);

	

	useEffect(() => {
		const handleScroll = () => {
			if(window.scrollY > 96){
				setIsSticky(true);
			}else{
				setIsSticky(false);
			}
		}

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll)
	})

	const { user, logout } = useUserStore();
	const isAdminOrManager = user?.role === "admin" || user?.role === "manager";
	const { cart } = useCartStore();

	return (
		<header className={`fixed top-0 left-0 w-full h-24 bg-opacity-90 z-30 transition-all duration-300 border-b flex items-center ${isSticky 
        ? "bg-[rgba(255,255,255,0.8)] border-custom-light-secundary text-custom-text-dark backdrop-blur-sm" 
        : "text-white"}`}>
			<div className={`container mx-auto h-full ${isAdminOrManager ? "px-5 lg:pl-32" : "px-5 lg:px-20"}`}>
				<div className='flex items-center h-full'>
					<nav className='flex justify-between items-center gap-4 w-full h-full'>
						<Link to='/' className='text-4xl font-bold text-[#444] items-center space-x-2 flex'>
							Furni <span className="font-light text-emerald-400">Hub</span>
						</Link>
						<ul className="hidden lg:flex gap-4">
							<Link
								to={"/"}
								className='text-[#666] hover:text-emerald-400 transition duration-300
					 			ease-in-out'
							>
								Home
							</Link>
							<Link
								to={"/"}
								className='text-[#666] hover:text-emerald-400 transition duration-300
					 			ease-in-out'
							>
								Shop
							</Link>
							<Link
								to={"/"}
								className='text-[#666] hover:text-emerald-400 transition duration-300
					 			ease-in-out'
							>
								Contact
							</Link>
						</ul>
						<div className="hidden lg:flex  gap-4 h-full">
							<Link
								to={"/cart"}
								className='relative group text-[#666] hover:text-emerald-400 transition duration-300 ease-in-out flex items-center py-4 px-4'
							>
								<Search size={22} />
							</Link>
							{user && (
								<Link
									to={"/cart"}
									className='relative group text-[#666] hover:text-emerald-400 transition duration-300 
									ease-in-out flex items-center'
								>
									<ShoppingCart className='text-[#666]' size={22} />
									{cart.length > 0 && (
										<span
											className='absolute top-1/2 -right-3 bg-emerald-500 text-white rounded-full h-6 w-6 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out flex items-center justify-center'
										>
											{cart.length}
										</span>
									)}
								</Link>
							)}
							{user ? (
								<button
									className='text-[#666] py-4 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
									onClick={logout}
								>
									<LogOut size={22} />
								</button>
							) : (
								<>
									<Link
										to={"/login"}
										className='text-[#666] py-2 px-4 
										rounded-md flex items-center transition duration-300 ease-in-out'
									>
										<User size={22} />
									</Link>
								</>
							)}
							{isAdminOrManager && (
								<Link
									className='bg-emerald-700 hover:bg-emerald-600 text-white px-4 h-full font-medium
									transition duration-300 ease-in-out flex items-center flex-col justify-center'
									to={"/secret-dashboard"}
								>
									<Lock className='inline-block mb-2' size={18} />
									<span className='hidden sm:inline'>Dashboard</span>
								</Link>
							)}
						</div>

						<div className="flex lg:hidden text-[#444]">
							<div className="flex gap-2 h-full">
								<Link
									to={"/"}
									className='relative group text-[#666] hover:text-emerald-400 transition duration-300 ease-in-out flex items-center py-4 px-4'
								>
									<Search size={22} />
								</Link>
								{user && (
									<Link
										to={"/cart"}
										className='relative group text-[#666] hover:text-emerald-400 transition duration-300 
										ease-in-out flex items-center'
									>
										<ShoppingCart className='text-[#666]' size={22} />
										{cart.length > 0 && (
											<span
												className='absolute top-1/2 -right-3 bg-emerald-500 text-white rounded-full h-6 w-6 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out flex items-center justify-center'
											>
												{cart.length}
											</span>
										)}
									</Link>
								)}
								{!user && (
									<Link
										to={"/login"}
										className='text-[#666] py-2 px-4 
											rounded-md flex items-center transition duration-300 ease-in-out'
									>
										<User size={22} />
									</Link>
								)}
								<button onClick={()=> setIsMenuOpen(true)} className="p-4">
									<Equal size={30}/>
								</button>
							</div>
							<div className={`fixed z-50 top-0 right-0 w-3/4 max-w-sm h-dvh bg-white shadow-lg transform flex flex-col justify-center items-center transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
								<button onClick={()=> setIsMenuOpen(false)} className="absolute top-5 left-5">
									<X size={34} />
								</button>

								{user && (
									<button
									className='text-[#666] py-4 px-4 rounded-md flex items-center transition duration-300 ease-in-out absolute top-5 right-5'
									onClick={logout}
									>
										<LogOut size={22} />
									</button>
								)}

								<ul className="flex flex-col items-center justify-center gap-4 text-xl">
									<Link
										to={"/"}
										className='text-[#666] hover:text-emerald-400 transition duration-300
										ease-in-out'
									>
										Home
									</Link>
									<Link
										to={"/"}
										className='text-[#666] hover:text-emerald-400 transition duration-300
										ease-in-out'
									>
										Shop
									</Link>
									<Link
										to={"/"}
										className='text-[#666] hover:text-emerald-400 transition duration-300
										ease-in-out'
									>
										Contact
									</Link>
								</ul>

								{isAdminOrManager && (
									<Link
										className='bg-emerald-700 hover:bg-emerald-600 text-white px-4 h-28 w-full font-medium transition duration-300 ease-in-out flex items-center flex-col justify-center absolute left-0 bottom-0 gap-4 lg:gap-2'
										to={"/secret-dashboard"}
									>
										<Lock className='inline-block' size={18} />
										<span className='sm:inline'>Dashboard</span>
									</Link>
								)}
							</div>
						</div>
					</nav>
				</div>

			</div>
		</header>
	);
};
export default Navbar;
