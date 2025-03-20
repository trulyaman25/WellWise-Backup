import { Linkedin, Instagram, Github, Brain, Stethoscope, HeartPulse } from 'lucide-react';
import { useState } from 'react';

function Footer() {
    const services = [
        {
            title: "Mental Health Screening",
            description: "Advanced 4-stage psychological assessment using AI-powered analysis to detect early signs of mental health concerns.",
            icon: <Brain className="w-6 h-6 text-emerald-600 mb-2" />
        },
        {
            title: "Medical Consultations",
            description: "Connect with certified healthcare professionals for personalized medical advice and treatment plans.",
            icon: <Stethoscope className="w-6 h-6 text-emerald-600 mb-2" />
        },
        {
            title: "Health Monitoring",
            description: "Continuous health tracking and analysis with our advanced AI systems for preventive healthcare.",
            icon: <HeartPulse className="w-6 h-6 text-emerald-600 mb-2" />
        }
    ];

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+91',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <>
            <div id="#contact">
                <div id='footer' className="w-full flex flex-col justify-between rounded-t-[70px] lg:rounded-t-[120px] bg-gray-100 pt-10 sm:pt-20 pr-4 sm:pr-20 pl-4 sm:pl-20 pb-10">
                    <div className='rounded-t-[70px] lg:rounded-t-[120px] flex flex-col justify-center items-center gap-10'>
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <h1 className='font-albulaHeavy text-4xl sm:text-5xl text-center px-4 bg-gray-800 bg-clip-text text-transparent'>Your Health, Our Priority</h1>
                            <p className='font-googleSansLight text-xl sm:text-2xl text-gray-500 max-w-[600px] text-center px-4'>Advanced healthcare solutions with personalized mental wellness support</p>
                        </div>

                        <span className='w-[70%] h-[1px] bg-gray-300'></span>

                        <div className='w-full flex flex-col lg:flex-row justify-between items-start gap-10 xl:px-12 2xl:px-24'>
                            <div className='w-full py-8 px-4 lg:w-1/2 flex flex-col gap-6'>
                                <h2 className='font-googleSansRegular text-center lg:text-start text-3xl sm:text-4xl text-gray-800'>Our Services</h2>
                                <div className='flex flex-col gap-4'>
                                    {services.map((service, index) => (
                                        <div key={index} className='bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300'>
                                            <div className="flex items-center gap-3 mb-2">
                                                {service.icon}
                                                <h3 className='font-googleSansRegular text-2xl text-gray-700'>{service.title}</h3>
                                            </div>
                                            <p className='font-googleSansLight text-gray-600 text-sm sm:text-base'>{service.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <span className='w-[90%] h-[1px] bg-emerald-100 sm:hidden'></span>

                            <div className='w-full lg:w-1/2'>
                                <div className='py-8 px-4 transition-all duration-300'>
                                    <h2 className='font-googleSansRegular text-3xl sm:text-4xl text-center lg:text-start mb-6 text-gray-800'>Schedule a Consultation</h2>
                                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                        <div className='flex flex-row gap-4'>
                                            <input type="text" name="firstName"value={formData.firstName}onChange={handleChange}placeholder="First Name" required className='flex w-[50%] p-4 border-2 border-[#eeedec] font-googleSansRegular focus:outline-none focus:ring-2 focus:ring-gray-300'/>
                                            <input type="text" name="lastName"value={formData.lastName}onChange={handleChange}placeholder="Last Name" required className='flex w-[50%] p-4 border-2 border-[#eeedec] font-googleSansRegular focus:outline-none focus:ring-2 focus:ring-gray-300'/>
                                        </div>
                                        
                                        <input type="email" name="email"value={formData.email}onChange={handleChange}placeholder="Email Address" required className='flex-1 p-4 border-2 border-[#eeedec] font-googleSansRegular focus:outline-none focus:ring-2 focus:ring-gray-300' />
                                        
                                        <div className='flex gap-4'>
                                            <select name="countryCode" value={formData.countryCode}onChange={handleChange}className="appearance-none text-center border-2 border-[#eeedec] font-googleSansRegular focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white w-[100px]"  >
                                                <option value="+91">+91</option>
                                                <option value="+1">+1</option>
                                            </select>
                                            <input type="tel" name="phone"value={formData.phone}onChange={handleChange}placeholder="Phone Number" required className='flex-1 p-4 border-2 border-[#eeedec] font-googleSansRegular focus:outline-none focus:ring-2 focus:ring-gray-300'  />
                                        </div>
                                        
                                        <textarea name="message"value={formData.message}onChange={handleChange}placeholder="Tell me about your project" required rows={6} 
                                            className='p-4 border-2 border-[#eeedec] font-albulaRegular focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none' />
                                        
                                        <button type="submit"className='bg-[#FED685] text-[#131313] font-NoirProRegular text-xs px-10 py-4 hover:cursor-pointer hover:bg-yellow-400 transition-all duration-300 ease-in-out' >
                                            SEND MESSAGE
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <span className='w-[90%] h-[1px] bg-gray-300'></span>

                        <div className='w-[90%] sm:w-[100%] lg:w-[90%] flex flex-col-reverse sm:flex-row justify-between items-center gap-10'>
                            <h1 className='text-gray-500 font-albulaLight text-center'>&copy; 2024 WellWise Healthcare. All rights reserved</h1>
                            <div className='flex flex-row justify-between items-center gap-2 xs:gap-3'>	 
                                <a className='bg-emerald-700 p-2 rounded-full capitalize hover:bg-emerald-600 transition-all duration-300'>
                                    <Linkedin className='w-[20px] h-[20px] m-1 text-white'/>
                                </a>
                                <a className='bg-emerald-700 p-2 rounded-full capitalize hover:bg-emerald-600 transition-all duration-300'>
                                    <Instagram className='w-[20px] h-[20px] m-1 text-white'/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;