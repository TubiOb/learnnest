import React from 'react'
import { Box, Image, Text, FormControl, Hide } from '@chakra-ui/react';
import Students from '../assets/Students-rafiki.svg'

const LoginForm = () => {
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

                <FormControl w={['95%', '80%']} mt='2' display='flex' flexDir='column' justifyContent='space-between' gap='6'>
            
                </FormControl>
            </Box>
        </Box>
    </Box>
  )
}

export default LoginForm