import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from 'lucide-react'; // Add this import

import Logo from '/favicon.png';

function Header() {
	const [navbarHeight, setNavbarHeight] = useState('h-32');
	const [textColor, setTextColor] = useState('text-black');

	const [logoSize, setLogoSize] = useState('w-[100px] h-[100px]');
	const [logoText, setLogoText] = useState('text-4xl');
	const [justifyState, setJustifyState] = useState('justify-between');
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	useEffect(() => {
		let lastScrollY = window.scrollY;

		const handleScroll = () => {
			const screenHeight = window.innerHeight;
			const scrollThreshold = screenHeight * 0.25;

			if (window.scrollY > scrollThreshold) {
				setNavbarHeight('h-24');
				setLogoSize('w-[50px] h-[50px]');
				setLogoText('hidden');
				setJustifyState('w-fit mx-auto bg-white rounded-full shadow-xl');
			} else {
				setNavbarHeight('h-32');
				setLogoText('text-4xl');
				setLogoSize('w-[100px] h-[100px]');
				setJustifyState('w-full');
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
		<header className={`fixed w-full ${navbarHeight} px-4 md:px-8 lg:px-32 transition-all duration-300 z-50 flex items-center justify-center`}>
			<div className={`p-1 px-2 flex flex-row items-center justify-between ${justifyState} transition-all duration-300`}>
				<div className={`cursor-pointer flex flex-row justify-center items-center gap-3 md:gap-7 px-3 md:px-6 py-2 md:py-3 rounded-xl ${textColor}`}>
					<img src={Logo} alt="Well Wise Logo" className={`${logoSize} transition-all ease-in-out`}/>
					<span className={`flex flex-row justify-center items-center font-googleSansBlack text-2xl md:${logoText} text-[#227176]`}>Well Wise</span>
				</div>

				<button onClick={toggleMenu} className="xl:hidden bg-gray-900 p-2 rounded-full text-white">
					{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>

				<div className={`${isMenuOpen ? 'flex' : 'hidden'} lg:hidden fixed top-[80px] left-0 right-0 bg-gray-900 flex-col items-center py-4 gap-4 transition-all duration-300`}>
					<Link to="#home" className="px-6 py-2 text-white font-googleSansLight hover:text-[#c3e5e0]" onClick={() => { scrollToSection('home'); setIsMenuOpen(false); }}>
						Home
					</Link>
					<Link to="#about" className="px-6 py-2 text-white font-googleSansLight hover:text-[#c3e5e0]" onClick={() => { scrollToSection('about'); setIsMenuOpen(false); }}>
						About Us
					</Link>
					<Link to="#team" className="px-6 py-2 text-white font-googleSansLight hover:text-[#c3e5e0]" onClick={() => { scrollToSection('team'); setIsMenuOpen(false); }}>
						Our Team
					</Link>
					<Link to="#contact" className="px-6 py-2 text-white font-googleSansLight hover:text-[#c3e5e0]" onClick={() => { scrollToSection('contact'); setIsMenuOpen(false); }}>
						Contact Us
					</Link>
				</div>

				<div className="hidden xl:flex w-fit h-fit bg-gray-900 rounded-full p-3 flex-row justify-between gap-10 items-center transition-all ease">
					<Link to="#home" className="px-10 py-2 transition-all bg-gray-800 duration-300 flex flex-row justify-center items-center font-googleSansLight rounded-full text-white border-2 border-[#6536ff] border-transparent hover:border-[#c3e5e0]" onClick={() => scrollToSection('home')}>
						Home
					</Link>
					<Link to="#about" className="px-10 py-2 transition-all bg-gray-800 duration-300 flex flex-row justify-center items-center font-googleSansLight rounded-full text-white border-2 border-[#6536ff] border-transparent hover:border-[#c3e5e0]" onClick={() => scrollToSection('about')}>
						About Us
					</Link>
					<Link to="#team" className="px-10 py-2 transition-all bg-gray-800 duration-300 flex flex-row justify-center items-center font-googleSansLight rounded-full text-white border-2 border-[#6536ff] border-transparent hover:border-[#c3e5e0]" onClick={() => scrollToSection('team')}>
						Our Team
					</Link>
					<Link to="#contact" className="px-10 py-2 transition-all bg-gray-800 duration-300 flex flex-row justify-center items-center font-googleSansLight rounded-full text-white border-2 border-[#6536ff] border-transparent hover:border-[#c3e5e0]" onClick={() => scrollToSection('contact')}>
						Contact Us
					</Link>
				</div>
			</div>
		</header>
	);
}

export default Header;