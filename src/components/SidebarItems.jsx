import React from 'react'
import Logo from '../assets/logo192.png'
import { useLocation, NavLink } from 'react-router-dom';
import { IoCalendarOutline } from "react-icons/io5";
import { GiTeacher, GiArchiveRegister } from "react-icons/gi";
import { LuLayoutDashboard, LuSunDim } from "react-icons/lu";
import { PiStudentDuotone, PiMoonDuotone } from "react-icons/pi";
import { MdAssignment, MdPayments } from "react-icons/md";
import { RiSettingsLine, RiNotification3Line } from "react-icons/ri";
import { IoSchool } from "react-icons/io5";
import { SiGoogleclassroom, SiTestcafe } from "react-icons/si";
import { Box, Avatar } from '@chakra-ui/react';
import { useTheme } from '../ThemeContext';

const SidebarItems = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');

    const { theme, toggleTheme } = useTheme();

        //   DYNAMICALLY CREATING SIDEBAR MENUITEMS FOR EACH ROLE
    let sidebarMenus = [];

    if (role === 'admin') {
        sidebarMenus = [
            { name: 'Dashboard', icon: LuLayoutDashboard, color: '', active: true },
            { name: 'Teachers', icon: GiTeacher, color: '', active: false },
            { name: 'Students', icon: PiStudentDuotone, color: '', active: false },
            { name: 'Course Field', icon: IoSchool, color: '', active: false },
            { name: 'Courses', icon: SiGoogleclassroom, color: '', active: false, alert: false },
            { name: 'Fees', icon: MdPayments, color: 'green.100', active: false },
            { name: 'School Calendar', icon: IoCalendarOutline, color: '', active: false },
        ];
    }
    else if (role === 'teacher') {
        sidebarMenus = [
            { name: 'Dashboard', icon: LuLayoutDashboard, color: '', active: true },
            { name: 'Students', icon: PiStudentDuotone, color: '', active: false },
            { name: 'Course Field', icon: IoSchool, color: '', active: false },
            { name: 'Courses', icon: SiGoogleclassroom, color: '', active: false },
            { name: 'Assignment', icon: MdAssignment, color: '', active: false },
            { name: 'Test', icon: SiTestcafe, color: '', active: false },
            { name: 'School Calendar', icon: IoCalendarOutline, color: '', active: false },
        ];
    }
    else if (role === 'student') {
        sidebarMenus = [
            { name: 'Dashboard', icon: LuLayoutDashboard, color: '', active: true },
            { name: 'Course Registration', icon: GiArchiveRegister, color: '', active: false },
            { name: 'Assignment', icon: MdAssignment, color: '', active: false },
            { name: 'Test', icon: SiTestcafe, color: '', active: false },
            { name: 'School Calendar', icon: IoCalendarOutline, color: '', active: false },
            { name: 'Fees Payments', icon: MdPayments, color: 'green.100', active: false },
        ];
    }

  return (
    <nav className='h-[100svh] flex flex-col flex-grow fixed px-1 py-2 items-center justify-between text-sm md:text-md border-r border-r-gray-300 w-[50px]'>
        <Box className="flex items-center font-['Montserrat Alternates'] mx-auto mt-2">
            <img src={Logo} alt="Memomaze" className='w-full' />
        </Box>

        <ul className='flex flex-col flex-1 items-center justify-center gap-4'>
            {sidebarMenus.map((menu, index) => (
                <li key={index} className={`flex gap-1 items-center cursor-pointer px-1 py-1 relative group rounded-lg ${menu.active ? 'bg-blue-200 hover:bg-blue-400' : 'hover:bg-blue-400 hover:text-white'}`}>
                    {React.createElement(menu.icon, {color: menu.color, size: 25})}
                    <div className='absolute rounded-md px-2 py-1 ml-10 bg-blue-400 font-medium z-50 invisible opacity-10 translate-x-1 transition-all group-hover:visible group-hover:opacity-100 group-hover:z-50 group-hover:translate-x-0'>
                        {menu.name}
                    </div>
                </li>
            ))}
        </ul>

        <div className='border-t border-t-gray-300 flex flex-col items-center justify-between gap-2'>
            <Box display='flex' flexDir='column' gap='2' p='1' alignItems='center' rounded='lg'>
                <RiSettingsLine size={['25']} className='hover:bg-blue-300 hover:text-white py-1 cursor-pointer rounded-lg' />
                <RiNotification3Line size={['25']} className='hover:bg-blue-300 hover:text-white py-1 cursor-pointer rounded-lg' />
            </Box>
            <button className='p-1 rounded-lg hover:bg-blue-300 hover:text-white' onClick={toggleTheme} >
                {theme === 'dark' ? <PiMoonDuotone size='20' /> : <LuSunDim size='20' />}
            </button>

            <NavLink to='profile'>
                <Box className="cursor-pointer group" display='flex' gap='2' alignItems='center'>
                    <Avatar size={['xs', 'sm']} src={Logo} />
                </Box>
            </NavLink>
        </div>
    </nav>
  )
}

export default SidebarItems