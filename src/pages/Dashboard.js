import React from 'react'
import Sidebar from '../components/Sidebar'
import { Box } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom'

const Dashboard = () => {
      // Get role from the query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role');

  return (
    <Box display='flex' w='full' alignItems='start' justifyContent='start' h='screen'>
        <Sidebar role={role} />

        <Outlet role={role} />
    </Box>
  )
}

export default Dashboard