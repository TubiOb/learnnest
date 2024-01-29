import React from 'react'
import Sidebar from '../components/Sidebar'
import { Box } from '@chakra-ui/react';

const Dashboard = () => {
  return (
    <Box display='flex' w='full' pos='relative' alignItems='start' h='screen'>
        <Sidebar />
    </Box>
  )
}

export default Dashboard