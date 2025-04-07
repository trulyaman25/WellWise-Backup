import Lottie from "lottie-react";
import DownArrow from '../../essentials/animations/downArrow.json';
import linkedInIcon from '/icons/linkedinLogoSVG.svg'
import instagramIcon from '/icons/instagramLogoSVG.svg'
import teamData from '../../essentials/teamData.json';
import LandingImage from '/landingPageImg.jpg';
import IllustrationOne from '/illustration/homeIllustrationOne.webp';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useState, useEffect } from "react";
import './home.css';

function Home() {
    const { teamMembers } = teamData;

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerChildren = {
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    }

    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition({
                x: Math.random() * (20 - 10) + 10 * (Math.random() < 0.5 ? -1 : 1),
                y: Math.random() * (20 - 10) + 10 * (Math.random() < 0.5 ? -1 : 1),
            });
        }, 1500);
    
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-32 py-32 relative overflow-hidden">
                <div className="gradient-bg"></div>
                <motion.div id='home' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                    className="w-full flex flex-col lg:flex-row justify-between items-center gap-10 relative" >
                    <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center items-center lg:items-start px-4 lg:pl-20 gap-7 order-2 lg:order-1" >
                        <div className="h-fit font-googleSansBold text-center lg:text-left">
                            <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                                className="text-2xl md:text-3xl lg:text-4xl text-[#227176]" >
                                AI Driven
                            </motion.span>
                            <span className="text-2xl md:text-3xl lg:text-4xl"> Mental Health <br /> Detection & Support</span>
                            <div className="text-base md:text-lg lg:text-xl mt-4 text-gray-500 font-googleSansMedium w-full lg:w-[600px]">
                                Streamlining Mental Health Care with AI-Driven Solutions.
                            </div>
                            <div className="text-base md:text-lg lg:text-xl text-gray-500 font-googleSansMedium w-full lg:w-[600px]">
                                Early Detection, Prevention & Personalized Support
                            </div>
                        </div>
                        
                        <motion.button onClick={handleLoginClick} whileTap={{ scale: 0.95 }}
                            className="w-[120px] h-[50px] font-googleSansMedium text-lg bg-gray-900 text-white rounded-xl shadow-md hover:shadow-2xl transition-all ease-in-out cursor-pointer">
                            Log In
                        </motion.button>
                    </motion.div>

                    <motion.div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center items-center relative">
                        <div className="texture-bg"></div>
                        <motion.img 
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: position.x, y: position.y, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            src={LandingImage}
                            alt="Landing Image"
                            className="w-[80%] md:w-[70%] lg:w-full h-auto object-contain relative z-10"
                        />
                    </motion.div>
                </motion.div>
            </div>

            <section id="about" className="w-full min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-24 py-16 lg:py-32">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mb-16 lg:mb-24 px-4">
                    <span className="text-[#227176] font-albulaHeavy text-2xl md:text-3xl lg:text-4xl mb-6 lg:mb-10 inline-block">
                        ABOUT US
                    </span>
                    <h1 className="font-albulaHeavy text-3xl md:text-5xl lg:text-6xl text-gray-800 mb-6 lg:mb-8">
                        Revolutionizing Mental Healthcare
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-googleSansMedium leading-relaxed px-4">
                        Your comprehensive mental health companion, designed to streamline the journey towards better mental wellness through intelligent tracking and personalized care.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mb-32">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white cursor-pointer p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                        <div className="bg-[#227176]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#227176] transition-all duration-500">
                            <svg className="w-8 h-8 text-[#227176] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-googleSansMedium text-gray-800 mb-4">Appointment Management</h3>
                        <p className="text-gray-500 font-googleSansRegular leading-relaxed">Effortlessly schedule, track, and manage your mental health appointments. Never miss a session with smart reminders.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white cursor-pointer p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                        <div className="bg-[#227176]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#227176] transition-all duration-500">
                            <svg className="w-8 h-8 text-[#227176] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-googleSansMedium text-gray-800 mb-4">Health Record Tracking</h3>
                        <p className="text-gray-500 font-googleSansRegular leading-relaxed">Securely store and access your mental health records, treatment plans, and progress notes in one centralized location.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white cursor-pointer p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                        <div className="bg-[#227176]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#227176] transition-all duration-500">
                            <svg className="w-8 h-8 text-[#227176] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-googleSansMedium text-gray-800 mb-4">AI-Powered Insights</h3>
                        <p className="text-gray-500 font-googleSansRegular leading-relaxed">Leverage advanced AI technology to receive personalized insights and early detection of mental health patterns.</p>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl bg-white rounded-3xl p-4 text-white">
                    <div className="flex flex-col text-gray-900 lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="font-googleSansMedium text-4xl mb-6">Why Choose Well Wise?</h2>
                            <p className="font-googleSansRegular text-gray-500 text-lg opacity-90 mb-4">
                                We harness the power of AI and neuroscience to redefine mental health detection and care. Our cutting-edge technology provides real-time insights, empowering individuals and professionals to take proactive steps toward mental wellness.
                            </p>
                            <p className="font-googleSansRegular text-gray-500 text-lg opacity-90">
                                By simplifying complex data and making mental health assessments more accessible, we revolutionize the way mental well-being is understood and managed.
                            </p>
                        </div>
                        <div className="lg:w-1/2">
                            <img src={IllustrationOne} alt="Why Well Wise" className="rounded-2xl transform transition-all duration-500"/>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section id="team" className="w-full min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-24 py-16 lg:py-64">
                <h1 className="font-albulaLight tracking-widest uppercase text-gray-500 text-sm text-center">
                    Website Developed by <span className="text-[#227176] font-albulaBold hover:cursor-pointer">Team Binary Bots</span> for Hack-O-Harbour (Technovate 6.0), IIIT - Naya Raipur, Crafted with Love ❤️
                </h1>

                <h1 className="font-albulaHeavy text-5xl mt-6 text-gray-800 text-center">Meet the team</h1>
                <div className="flex flex-col items-center mt-6">
                    <Lottie animationData={DownArrow} loop={true} className="w-[100px] h-[100px] hover:cursor-pointer"/>
                </div>
                
                <motion.div variants={staggerChildren}initial="hidden"whileInView="visible"viewport={{ once: true }}className="grid grid-cols-1 md:grid-cols-2 gap-32 mt-64 px-5 w-full xl:max-w-4xl 2xl:max-w-5xl" >
                    {teamMembers.map((member, index) => (
                        <motion.div key={index}variants={fadeInUp}whileHover={{ y: -8 }}className="bg-gradient-to-br from-white cursor-pointer to-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative group" >
                            <div className="relative w-full h-[280px] lg:h-[220px] xl:h-[280px] 2xl:h-[400px] overflow-hidden">
                                <img src={member.img} alt={member.name} className="w-full h-full object-cover object-center transition-transform duration-500 ease-out transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                                    <div className="flex space-x-6">
                                        <a href={member.socialLinks[1].url} target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-all duration-200">
                                            <img src={linkedInIcon} alt="LinkedIn" className="w-8 h-8 filter brightness-0 invert"/>
                                        </a>
                                        <a href={member.socialLinks[0].url} target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-all duration-200">
                                            <img src={instagramIcon} alt="Instagram" className="w-8 h-8 filter brightness-0 invert"/>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-8 text-center bg-white">
                                <h2 className="text-xl font-semibold text-gray-800 uppercase font-albulaBold tracking-wider mb-2">
                                    {member.name}
                                </h2>
                                <h3 className="text-sm text-emerald-700 font-albulaLight inline-block px-4 py-1 rounded-full bg-purple-50 mb-3">
                                    {member.role}
                                </h3>

                                <p className="text-gray-500 font-albulaRegular text-sm leading-relaxed line-clamp-6">
                                    {member.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <div id="contact">
            </div>
        </>
    );
}

export default Home;