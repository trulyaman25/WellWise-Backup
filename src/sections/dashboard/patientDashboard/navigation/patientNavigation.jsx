import { NavLink, Link } from 'react-router-dom';
import WellWiseLogo from '/favicon.png';
import HomeLightIcon from '/icons/homeLight.png';
import BrainLightIcon from '/icons/brainLight.png';
import UserLightIcon from '/icons/userLight.png';
import HomeIcon from '/icons/home.png';
import BrainIcon from '/icons/brain.png';
import UserIcon from '/icons/user.png';
import LogOutIcon from '/icons/logout.png';
import StethoscopeIcon from '/icons/stethoscope.png';
import GameIcon from '/icons/game.png';

function PatientDashboardNavigation() {
    return (
        <nav className='flex flex-col justify-between items-center w-[350px] h-screen py-10 px-5 bg-gray-950'>
            <div id='wellWiseLogo'>
                <Link to='home' className='flex flex-col justify-center items-center gap-7'>
                    <img src={WellWiseLogo} alt="Well Wise Logo" className='w-[100px] h-[100px]' />
                    <h1 className='w-full text-center text-white font-albulaHeavy text-4xl'>Well Wise</h1>
                </Link>
            </div>

            <div id='NavigationLinks' className='w-full h-full flex flex-col justify-center items-center gap-6'>
                <NavLink to='home' className={({ isActive }) => `w-[300px] flex justify-start items-center p-4 rounded-3xl transition-colors font-googleSansBlack text-2xl gap-6 duration-300  ${isActive ? 'bg-[#d4eceb] text-[#1a5252]' : 'text-[#d4eceb]'}`} >
                    {({ isActive }) => (
                        <>
                            <img src={isActive ? HomeIcon : HomeLightIcon} alt="Home Icon" className='w-[40px] h-[40px] transition-all duration-300' />
                            <h1>Home</h1>
                        </>
                    )}
                </NavLink>

                <NavLink to='takeTest' className={({ isActive }) => `w-[300px] flex justify-start items-center p-4 rounded-3xl transition-colors font-googleSansBlack text-2xl gap-6 duration-300 ${isActive ? 'bg-[#d4eceb] text-[#1a5252]' : 'text-[#d4eceb]'}`} >
                    {({ isActive }) => (
                        <>
                            <img src={isActive ? BrainIcon : BrainLightIcon} alt="Brain Icon" className='w-[40px] h-[40px] transition-all duration-300' />
                            <h1>MH Test</h1>
                        </>
                    )}
                </NavLink>

                <NavLink to='profile' className={({ isActive }) => `w-[300px] flex justify-start items-center p-4 rounded-3xl transition-colors font-googleSansBlack text-2xl gap-6 duration-300 ${isActive ? 'bg-[#d4eceb] text-[#1a5252]' : 'text-[#d4eceb]'}`} >
                    {({ isActive }) => (
                        <>
                            <img src={isActive ? UserIcon : UserLightIcon} alt="Profile Icon" className='w-[40px] h-[40px] transition-all duration-300' />
                            <h1>Profile</h1>
                        </>
                    )}
                </NavLink>


                <NavLink to='/' className={({ isActive }) => `group w-[300px] hover:bg-rose-500 flex justify-start items-center p-4 rounded-3xl transition-colors font-googleSansBlack text-2xl gap-6 duration-300 ${isActive ? 'bg-[#d4eceb] text-[#1a5252]' : ' text-[#d4eceb]'}`} >
                    <img src={LogOutIcon} alt="Stethoscope Icon" className='w-[40px] h-[40px] transition-all duration-300 group-hover:invert group-hover:brightness-0' />
                    <h1 className=''>Log Out</h1>
                </NavLink>
            </div>

            <div>
                <h1 className='text-slate-400 text-center font-albulaLight text-sm'>Made with love by <span className='cursor-pointer hover:text-[#FED678] transition-all ease-in-out'>Team Binary Bots ❤️</span></h1>
            </div>
        </nav>
    );
}

export default PatientDashboardNavigation;