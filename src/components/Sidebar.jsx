import React from 'react'
import SidebarItems from './SidebarItems'
import { Box } from '@chakra-ui/react';

const Sidebar = ({ role }) => {
  return (
    <Box w='50px' pos='relative' zIndex='50' display='flex' alignItems='center' justifyContent='center' className='h-screen shrink lg:h-screen lg:shrink-0 w-[50px] relative z-50 flex justify-center items-center border-r border-r-gray-300'>
        <SidebarItems role={role} />
    </Box>
  )
}

export default Sidebar