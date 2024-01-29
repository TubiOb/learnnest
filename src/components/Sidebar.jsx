import React from 'react'
import SidebarItems from './SidebarItems'
import { Box } from '@chakra-ui/react';

const Sidebar = () => {
  return (
    <Box w='50px' pos='relative' zIndex='50' display='flex' alignItems='center' justifyContent='center' h='100svh'>
        <SidebarItems />
    </Box>
  )
}

export default Sidebar