import React, { useState } from 'react'
import { Box, Text, Hide, Image } from '@chakra-ui/react';
import Students from '../assets/Students-amico.svg'
import CustomInput from './CustomInput';
import { NavLink } from 'react-router-dom';

const SignupForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [institution, setInstitution] = useState('');

    const handleEmailChange = (value) => {
        setEmail(value);
    };

    const handleNameChange = (value) => {
        setName(value);
    }

    const handleInstitutionChange = (value) => {
        setInstitution(value);
    }

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

  return (
    <Box display='flex' flexDir='row' alignItems='center' justifyContent='space-between' w='full' h='100svh'>
        <Box w={['full', 'full', '55%']} h='full' display='flex' alignItems='center' justifyContent='center'>
            <Box rounded='xl' bg='lightsteelblue' w={['90%', '70%', '80%', '75%']} h='auto' py='5' px='3' gap='4' display='flex' flexDir='column' alignItems='center' fontFamily={'Lato'}>
                <Box display='flex' alignItems='center' flexDir='column' w={['95%', '80%']} textAlign='center' p='2' gap='1'>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Admin Sign Up</Text>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='normal'>Create Admin Account!</Text>
                    <Text as='p' fontSize={['sm', 'base', 'lg']}>Welcome aboard! Enter your details to create your account.</Text>
                </Box>

                <form className='w-[95%] md:w-[80%] mt-2 flex flex-col justify-between gap-6'>
                    <CustomInput type="text" label="Full Name" placeholder="Full Name" value={name} onChange={handleNameChange} />
                    <CustomInput type="email" label="Email" placeholder="Email" value={email} onChange={handleEmailChange} />
                    <CustomInput type="text" label="Name of Institution" placeholder="Name of Institution" value={institution} onChange={handleInstitutionChange} />
                    <CustomInput type="password" label="Password" placeholder="Password" value={password} onChange={handlePasswordChange} />

                    <button type="submit" className='text-blue-400 px-2 py-2 rounded-xl w-[70%] mx-auto bg-white font-semibold shadow-neutral-200 border-neutral-50 shadow-md transition duration-300  hover:font-semibold hover:bg-blue-400 hover:text-white hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center' >Sign In</button>
                </form>

                <p className='text-blue-500 my-2 text-xs md:text-sm '>Already have an account? <NavLink to='/login' className='underline cursor-pointer'>Sign in</NavLink></p>
            </Box>
        </Box>

        <Hide below='lg'>
            <Box w='45%' display={['hidden', 'flex']} h='full' alignItems='center' justifyContent='center'>
                <Image src={Students} alt='' objectFit='cover' w={['80%', '90%']} loading='lazy' />
            </Box>
        </Hide>
    </Box>
  )
}

export default SignupForm