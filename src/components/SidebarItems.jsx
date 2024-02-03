import React, { useState, useEffect } from 'react'
import Logo from '../assets/logo192.png'
import { NavLink } from 'react-router-dom';
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

const SidebarItems = ({ role }) => {

    const { theme, toggleTheme } = useTheme();

    const [activeMenu, setActiveMenu] = useState(() => {
        // Retrieve the active menu index from localStorage, defaulting to 0 if not present.
        return parseInt(localStorage.getItem('activeMenuIndex')) || 0;
    });

    useEffect(() => {
        // Save the active menu index to localStorage whenever it changes.
        localStorage.setItem('activeMenuIndex', activeMenu);
    }, [activeMenu]);



        //   DYNAMICALLY CREATING SIDEBAR MENUITEMS FOR EACH ROLE
    let sidebarMenus = [];

    if (role === 'admin') {
        sidebarMenus = [
            { name: 'Dashboard', icon: LuLayoutDashboard, active: true, path: (`/dashboard?role=${role}`) },
            { name: 'Field', icon: IoSchool, active: false, path: (`register-study-course?role=${role}`) },
            { name: 'Courses', icon: SiGoogleclassroom, active: false, path: (`subjects?role=${role}`) },
            { name: 'Lecturers', icon: GiTeacher, active: false, path: (`teachers?role=${role}`) },
            { name: 'Students', icon: PiStudentDuotone, active: false, path: (`students?role=${role}`) },
            { name: 'Fees', icon: MdPayments, active: false, path: '' },
            { name: 'Calendar', icon: IoCalendarOutline, active: false, path: '' },
        ];
    }
    else if (role === 'teacher') {
        sidebarMenus = [
            { name: 'Dashboard', icon: LuLayoutDashboard, active: true, path: (`/dashboard?role=${role}`) },
            { name: 'Courses', icon: SiGoogleclassroom, active: false, path: (`courses?role=${role}`) },
            { name: 'Students', icon: PiStudentDuotone, active: false, path: (`students?role=${role}`) },
            { name: 'Assignment', icon: MdAssignment, active: false, path: (`assignments?role=${role}`) },
            { name: 'Test', icon: SiTestcafe, active: false, path: '' },
            { name: 'Calendar', icon: IoCalendarOutline, active: false, path: '' },
        ];
    }
    else if (role === 'student') {
        sidebarMenus = [
            { name: 'Dashboard', icon: LuLayoutDashboard, active: true, path: (`/dashboard?role=${role}`) },
            { name: 'Course Registration', icon: GiArchiveRegister, active: false, path: (`courses?role=${role}`) },
            { name: 'Assignment', icon: MdAssignment, active: false, path: (`assignments?role=${role}`) },
            { name: 'Test', icon: SiTestcafe, active: false, path: '' },
            { name: 'Calendar', icon: IoCalendarOutline, active: false, path: '' },
            { name: 'Fees Payments', icon: MdPayments, active: false, path: '' },
        ];
    }

  return (
    <nav className='h-[100svh] flex flex-col flex-grow fixed px-1 py-2 items-center justify-between text-sm md:text-md border-r border-r-gray-300 w-[50px]'>
        <Box className="flex items-center font-['Montserrat Alternates'] mx-auto mt-2">
            <img src={Logo} alt="Memomaze" className='w-full' />
        </Box>

        <ul className='flex flex-col flex-1 items-center justify-center gap-4'>
            {sidebarMenus.map((menu, index) => (
                <NavLink to={menu.path} key={index} onClick={() => setActiveMenu(index)}>
                    <li className={`flex gap-1 items-center cursor-pointer px-1 py-1 relative group rounded-lg ${activeMenu === index ? 'bg-blue-400 hover:bg-blue-500 hover:text-white' : 'hover:bg-blue-500 hover:text-white'}`}>
                        {React.createElement(menu.icon, {color: menu.color, size: 25})}
                        <div className='absolute rounded-md px-2 py-1 ml-10 bg-blue-400 flex-nowrap font-medium z-50 invisible opacity-10 translate-x-1 transition-all group-hover:visible group-hover:opacity-100 group-hover:z-50 group-hover:translate-x-0'>
                            {menu.name}
                        </div>
                    </li>
                </NavLink>
                
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