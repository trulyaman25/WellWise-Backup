import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Logo from '/favicon.png';

function Header() {
	const [navbarHeight, setNavbarHeight] = useState('h-32');
	const [textColor, setTextColor] = useState('text-black');

	const [logoSize, setLogoSize] = useState('w-[100px] h-[100px]');
	const [logoText, setLogoText] = useState('text-4xl');
	const [justifyState, setJustifyState] = useState('justify-between');

	useEffect(() => {
		let lastScrollY = window.scrollY;

		const handleScroll = () => {
			const screenHeight = window.innerHeight;
			const scrollThreshold = screenHeight * 0.25;

			if (window.scrollY > scrollThreshold) {
				setNavbarHeight('h-24');
				setLogoSize('hidden');
				setLogoText('hidden');
				setJustifyState('justify-center');
			} else {
				setNavbarHeight('h-32');
				setLogoText('text-4xl');
				setLogoSize('w-[100px] h-[100px]');
				setJustifyState('justify-between');
			}

			lastScrollY = window.scrollY;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const scrollToSection = (sectionId) => {
		const element = document.getElementById(sectionId);
		if (element) {
			const offsetTop = element.offsetTop;
			const headerOffset = 100;
			window.scrollTo({
				top: offsetTop - headerOffset,
				behavior: 'smooth'
			});
		}
	};

	return (
		<header className={`fixed w-full ${navbarHeight} px-32 transition-all duration-300 flex flex-row ${justifyState} items-center z-50 transition-all ease-in-out`}>
			<div className={`cursor-pointer flex flex-row justify-center item-center gap-7 px-6 py-3 rounded-xl ${textColor} transition-all ease-in-out`}>
                <img src={Logo} alt="Well Wise Logo" className={`${logoSize} transition-all ease-in-out`}/>
                <span className={`flex flex-row justify-center items-center font-googleSansBlack ${logoText} text-[#227176]`}>Well Wise</span>
			</div>

			<div className="w-fit h-fit bg-gray-900 rounded-full p-3 flex flex-row justify-between gap-10 items-center transition-all ease">
				<Link to="#home" className={`px-10 py-2 transition-all bg-gray-800 duration-300 flex flex-row justify-center items-center font-googleSansLight rounded-full text-white border-2 border-[#6536ff] border-transparent hover:border-[#c3e5e0]`} onClick={() => scrollToSection('home')} >
					Home
				</Link>

				<Link to="#about" className={`px-10 py-2 transition-all bg-gray-800 duration-300 flex flex-row justify-center items-center font-googleSansLight rounded-full text-white border-2 border-[#6536ff] border-transparent hover:border-[#c3e5e0]`} onClick={() => scrollToSection('about')} >
					About Us
				</Link>

				<Link to="#team" className={`px-10 py-2 transition-all bg-gray-800 duration-300 flex flex-row justify-center items-center font-googleSansLight rounded-full text-white border-2 border-[#6536ff] border-transparent hover:border-[#c3e5e0]`} onClick={() => scrollToSection('team')} >
					Our Team
				</Link>

				<Link to="#contact" className={`px-10 py-2 transition-all bg-gray-800 duration-300 flex flex-row justify-center items-center font-googleSansLight rounded-full text-white border-2 border-[#6536ff] border-transparent hover:border-[#c3e5e0]`} onClick={() => scrollToSection('contact')} >
					Contact Us
				</Link>
			</div>
		</header>
	);
}

export default Header;