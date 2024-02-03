import React, { useState } from 'react'
import { Box, Image, Text, Hide } from '@chakra-ui/react';
import Students from '../assets/Students-rafiki.svg'
import CustomInput from './CustomInput';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {  } from 'react-router-dom';
import { toast } from 'sonner'
import Toast from './Toast';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../Firebase';

const LoginForm = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');

        //   SETTING UP NAVIGATION //
    const history = useNavigate();


    const handleEmailChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            email: value,
        }));
    };


    const handlePasswordChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            password: value,
        }));
    };


        //   DEFAULT VALUES OF FORM DATA //
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });






    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            if (formData.email === '' || formData.password === '') {
                showToastMessage('Please fill in both email and password.', 'error');
                return;
            }

            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);

            const userId = userCredential.user.uid;

            let userDocRef;

            if (role === 'admin') {
                userDocRef = doc(firestore, `Admin/${userId}`);
            }
            else if (role === 'teacher') {
                userDocRef = doc(firestore, `Lecturer/${userId}`);
            }
            else if (role === 'student') {
                userDocRef =  doc(firestore, `Student/${userId}`);
            }
            else {
                showToastMessage('Invalid user role', 'error');
                return;
            }

            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                    // eslint-disable-next-line
                const userData = userDoc.data();

                showToastMessage('Sign In Successful', 'success');

                setTimeout(() => {
                    // setLoading(false);
                    setFormData({
                        email: '',
                        password: '',
                    });

                    history(`/dashboard?role=${role}`);
                }, 1500);
            }
        }
        catch (err) {
            if (formData.email === '' || formData.password === '') {
                showToastMessage('Please fill in both email and password.', 'error');
            } 
            else {
                showToastMessage('Invalid email or password', 'error');
                console.log(err.message);

                setFormData ({
                    email: '',
                    password: '',
                });
            }
        }
    }








        //   CONFIGURING TOAST TO TOAST MESSAGE
    const showToastMessage = (message, type) => {
        switch (type) {
            case 'success':
                toast.success(message, {
                    position: 'top-right',
                    duration: 3000,
                    preventDefault: true,
                });
                break;
            case 'error':
                toast.error(message, {
                    position: 'top-right',
                    duration: 3000,
                    preventDefault: true,
                });
                break;
            case 'warning':
                toast.warning(message, {
                    position: 'top-right',
                    duration: 3000,
                    preventDefault: true,
                });
                break;
            default:
                break;
        }
        };








  return (
    <Box display='flex' flexDir='row' alignItems='center' justifyContent='space-between' w='full' h='100svh'>
        <Hide below='lg'>
            <Box w='45%' display={['hidden', 'flex']} h='full' alignItems='center' justifyContent='center'>
                <Image src={Students} alt='' objectFit='cover' w={['80%', '90%']} loading='lazy' />
            </Box>
        </Hide>
        

        <Box w={['full', 'full', '55%']} h='full' display='flex' alignItems='center' justifyContent='center'>
            <Box rounded='xl' bg='lightsteelblue' color='blue.500' _dark={{ bg: 'white', color: 'blue.600' }} w={['90%', '70%', '80%', '75%']} h='auto' py='9' px='3' gap='4' display='flex' flexDir='column' alignItems='center' fontFamily={'Lato'}>
                <Box display='flex' alignItems='center' flexDir='column' w={['95%', '80%']} textAlign='center' p='2' gap='1'>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Welcome,</Text>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='normal'>Glad to see you!</Text>
                    <Text as='p' fontSize={['sm', 'base', 'lg']}>Enter your details to get signed in to your account</Text>
                </Box>

                <form onSubmit={handleSignIn} className='w-[95%] md:w-[80%] mt-2 flex flex-col justify-between gap-6'>
                    <CustomInput type="email" label="Email" placeholder="Email" value={formData.email} onChange={handleEmailChange} />
                    <CustomInput type="password" label="Password" placeholder="Password" value={formData.password} onChange={handlePasswordChange} />

                    <div className='flex flex-wrap w-full -mt-5 px-3 items-center justify-between'>
                        <p className='text-xs md:text-sm text-blue-600 hover:underline cursor-pointer'><NavLink to={`/forgot-password?role=${role}`} >Forgot password?</NavLink></p>
                    </div>

                    <button type="submit" className='text-blue-400 px-2 py-2 rounded-xl w-[70%] mx-auto bg-white font-semibold shadow-neutral-200 border-neutral-50 shadow-md transition duration-300  hover:font-semibold hover:bg-blue-400 hover:text-white hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center' >Sign In</button>
                </form>
                { (role === 'admin' || role === 'student' ) && ( 
                    <p className='text-blue-600 my-3 text-xs md:text-sm '>Don't have an account? <NavLink to={`/signup?role=${role}`} className='underline cursor-pointer'>Sign up</NavLink></p>
                 )}
            </Box>
        </Box>

        <Toast showToast={showToastMessage} />
    </Box>
  )
}

export default LoginForm