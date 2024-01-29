import React from 'react'
import { Box, Image, Text } from '@chakra-ui/react';
import Student from '../assets/Happy-student-rafiki.svg'
import Admin from '../assets/Admin-rafiki.svg'
import Teacher from '../assets/Teacher-bro.svg'
import { NavLink } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box display='flex' alignItems='center' justifyContent='center' w='full' h={['screen', '100svh']} flexDir={['column', 'row']} >
        <Box display='flex' alignItems='center' justifyContent='space-between' w={['95%', '80%']} mx='auto' h='full' p='3' flexDir={['column', 'row']} gap='10' rounded='lg' >
            <NavLink to='/login?role=student' w={['90%', '80']} h={['300px', '300px']}>
                <Box display='flex' flexDir='column' alignItems='center' justifyContent='center' boxShadow='base' bg='white' _dark={{ bg: 'white', color: '#00072d' }} mx='auto' _hover={{ boxShadow: 'xl', transform: 'scale(1.04)'}} py='3' px='2' cursor='pointer' gap='3' textAlign='center' rounded='xl' >
                    <Image src={Student} alt='Students Login' objectFit='cover' w='full' h={['80%', '250px']} />
                    <Text as='h4' fontSize={['smaller', 'medium', 'large']} fontWeight='semibold' px='2'>Student</Text>
                    <Text as='p' fontSize={['xs', 'sm', 'md']} fontWeight='light'>Manage user roles, permissions, and system settings to ensure the smooth operation of the school website.</Text>
                </Box>
            </NavLink>
            

            <NavLink to='/login?role=admin' w={['90%', '80']} h={['300px', '300px']}>
                <Box display='flex' flexDir='column' alignItems='center' justifyContent='center' boxShadow='base' bg='white' _dark={{ bg: 'white', color: '#00072d' }} mx='auto' _hover={{ boxShadow: 'xl', transform: 'scale(1.04)'}} py='3' px='2' cursor='pointer' gap='3' textAlign='center' rounded='xl'>
                    <Image src={Admin} alt='Admin Login' objectFit='cover' w='full' h={['80%', '250px']} />
                    <Text as='h4' fontSize={['smaller', 'medium', 'large']} fontWeight='semibold' px='2'>Admin</Text>
                    <Text as='p' fontSize={['xs', 'sm', 'md']} fontWeight='light'>Create, manage, and grade assignments to facilitate effective teaching and assessment for students.</Text>
                </Box>
            </NavLink>
            

            <NavLink to='/login?role=teacher' w={['90%', '80']} h={['300px', '300px']}>
                <Box display='flex' flexDir='column' alignItems='center' justifyContent='center' boxShadow='base' bg='white' _dark={{ bg: 'white', color: '#00072d' }} mx='auto' _hover={{ boxShadow: 'xl', transform: 'scale(1.04)'}} py='3' px='2' cursor='pointer' gap='3' textAlign='center' rounded='xl'>
                    <Image src={Teacher} alt='Teahcers Login' objectFit='cover' w='full' h={['80%', '250px']} />
                    <Text as='h4' fontSize={['smaller', 'medium', 'large']} fontWeight='semibold' px='2'>Teacher</Text>
                    <Text as='p' fontSize={['xs', 'sm', 'md']} fontWeight='light'>Access course materials, submit assignments, and view grades for a personalized learning experience.</Text>
                </Box>
            </NavLink>
        </Box>
    </Box>
  )
}

export default LandingPage