import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import Logo from '/favicon.png';

function Header() {
	const [navbarHeight, setNavbarHeight] = useState('h-40');
	const [textColor, setTextColor] = useState('text-black');

	useEffect(() => {
		let lastScrollY = window.scrollY;

		const handleScroll = () => {
			const screenHeight = window.innerHeight;
			const scrollThreshold = screenHeight * 0.95;

			if (window.scrollY > lastScrollY && window.scrollY > 50) {
				setNavbarHeight('h-20');
			} else {
				setNavbarHeight('h-32 xl:h-40');
			}

			if (window.scrollY > scrollThreshold) {
				setTextColor('text-black');
			} else {
				setTextColor('text-black');
			}

			lastScrollY = window.scrollY;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<header className={`fixed w-screen ${navbarHeight} px-14 bg-opacity-10 backdrop-blur-lg transition-all duration-300 flex flex-row justify-between items-center border-b border-black border-opacity-20 z-50`}>
			<div className={`cursor-pointer flex flex-row justify-center item-center ${textColor}`}>
                <img src={Logo} alt="Well Wise Logo" className="w-[100px] h-[100px]"/>
                <span className="flex flex-row justify-center items-center">Well Wise</span>
			</div>
			<div className="w-[500px] h-full flex flex-row justify-between items-center">

				<NavLink to="#home"
					className={`px-4 py-2 transition-all duration-300 w-[100px] flex flex-row justify-center items-center font-albulaRegular rounded-xl ${textColor} border-2 border-[#6536ff] border-transparent hover:border-[#6536ff]`}
					onClick={() => window.scrollTo({ top: document.getElementById('home').offsetTop, behavior: 'smooth' })}
				>
					Home
				</NavLink>

				<NavLink to="#about"
					className={`px-4 py-2 transition-all duration-300 w-[100px] flex flex-row justify-center items-center font-albulaRegular rounded-xl ${textColor} border-2 border-[#6536ff] border-transparent hover:border-[#6536ff]`}
					onClick={() => window.scrollTo({ top: document.getElementById('about').offsetTop, behavior: 'smooth' })}
				>
					About
				</NavLink>

				<NavLink to="#team"
					className={`px-4 py-2 transition-all duration-300 w-[100px] flex flex-row justify-center items-center font-albulaRegular rounded-xl ${textColor} border-2 border-[#6536ff] border-transparent hover:border-[#6536ff]`}
					onClick={() => window.scrollTo({ top: document.getElementById('team').offsetTop, behavior: 'smooth' })}
				>
					Team
				</NavLink>

				<NavLink onClick={() => loginWithRedirect()}
					className={`px-4 py-2 transition-all border-2 border-gray-200 duration-100 rounded-xl bg-[#6536ff] hover:bg-[#472d99] w-[100px] flex flex-row justify-center items-center font-albulaLight text-white`}>
					Login
				</NavLink>
			</div>
		</header>
	);
}

export default Header;