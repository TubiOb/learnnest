import React, { useState } from 'react'
import { Box, Image, Text, Hide } from '@chakra-ui/react';
import Students from '../assets/Students-rafiki.svg'
import CustomInput from './CustomInput';
import { NavLink } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  return (
    <Box display='flex' flexDir='row' alignItems='center' justifyContent='space-between' w='full' h='100svh'>
        <Hide below='lg'>
            <Box w='45%' display={['hidden', 'flex']} h='full' alignItems='center' justifyContent='center'>
                <Image src={Students} alt='' objectFit='cover' w={['80%', '90%']} loading='lazy' />
            </Box>
        </Hide>
        

        <Box w={['full', 'full', '55%']} h='full' display='flex' alignItems='center' justifyContent='center'>
            <Box rounded='xl' bg='lightsteelblue' w={['90%', '70%', '80%', '75%']} h='auto' py='9' px='3' gap='4' display='flex' flexDir='column' alignItems='center' fontFamily={'Lato'}>
                <Box display='flex' alignItems='center' flexDir='column' w={['95%', '80%']} textAlign='center' p='2' gap='1'>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Welcome,</Text>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='normal'>Glad to see you!</Text>
                    <Text as='p' fontSize={['sm', 'base', 'lg']}>Enter your details to get signed in to your account</Text>
                </Box>

                <form className='w-[95%] md:w-[80%] mt-2 flex flex-col justify-between gap-6'>
                    <CustomInput type="email" label="Email" placeholder="Email" value={email} onChange={handleEmailChange} />
                    <CustomInput type="password" label="Password" placeholder="Password" value={password} onChange={handlePasswordChange} />

                    <div className='flex flex-wrap w-full -mt-5 px-3 items-center justify-between'>
                        <p className='text-xs md:text-sm text-blue-600 hover:underline cursor-pointer'><NavLink to='/forgot-password' >Forgot password?</NavLink></p>
                    </div>

                    <button type="submit" className='text-blue-400 px-2 py-2 rounded-xl w-[70%] mx-auto bg-white font-semibold shadow-neutral-200 border-neutral-50 shadow-md transition duration-300  hover:font-semibold hover:bg-blue-400 hover:text-white hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center' >Sign In</button>
                </form>

                <p className='text-blue-600 my-3 text-xs md:text-sm '>Don't have an account? <NavLink to='/signup' className='underline cursor-pointer'>Sign up</NavLink></p>
            </Box>
        </Box>
    </Box>
  )
}

export default LoginForm