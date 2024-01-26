import React, { useState } from 'react'
import { Box, Text, Hide, Image } from '@chakra-ui/react';
import Students from '../assets/Students-amico.svg'
import DefaultImage from '../assets/user.png'
import CustomInput from './CustomInput';
import { NavLink, useNavigate  } from 'react-router-dom';
import { toast } from 'sonner'
import Toast from './Toast';
import { firestore, auth } from '../Firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, where } from 'firebase/firestore';

const SignupForm = () => {
        //   SETTING UP NAVIGATION //
    const history = useNavigate();


    const handleEmailChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            email: value,
        }));
    };

    const handleNameChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            name: value,
        }));
    };

    const handleInstitutionChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            institution: value,
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
        name: '',
        email: '',
        institution: '',
        password: '',
    });






        //    GETTING FIRSTNAME AS USERNAME FROM GOOGLE AUTH //
    const getFirstName = () => {
        const fullName = formData.username || '';
        const username = fullName.split(' ')[0];
        return username;
    };






        //   SAVING ADMIN/INSTITUTION ADMIN
    const handleSave = async (e) => {
        e.preventDefault();

            // PASSWORD VALIDATION
        const validatePassword = (password) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
            return passwordRegex.test(password);
        };
        
        if (!validatePassword(formData.password)) {
            showToastMessage('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_+)',
            'warning');
        }
        
            // EMAIL VALIDATION
        const validateEmail = (email) => {
            // eslint-disable-next-line
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(email);
        };
        
        if (!validateEmail(formData.email)) {
            showToastMessage('Invalid email address', 'error');
        }

            // CHECK IF EMAIL IS ALREADY REGISTERED
        const emailExists = await checkIfEmailExists(formData.email);

        if (emailExists) {
            showToastMessage(`User with the email ${formData.email} already exists`, 'warning');
            return;
        }


            //   GETTING USER DATA FROM FORM AND SENDING TO FIREBASE STORAGE
        try {
            const adminUserCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

            if (adminUserCredential && adminUserCredential.user) {
                    const adminUserId = adminUserCredential.user.uid;

                    const userDocRef = doc(firestore, `Admin/${adminUserId}`);

                    await setDoc(userDocRef, {
                        name: formData.name,
                        username: getFirstName(formData.username),
                        email: formData.email,
                        institution: formData.institution,
                        userImage: DefaultImage,
                    });

                    showToastMessage('Sign Up Successful', 'success');

                    setTimeout(() => {
                        //   RESETTING THE FORM
                        setFormData ({
                            name: '',
                            email: '',
                            institution: '',
                            password: '',
                        });


                        //   ROUTING BACK TO LOGIN PAGE
                        history('/login?role=admin');
                    }, 3500);

                    await sendEmailVerification(adminUserCredential.user);

                    showToastMessage('Email verification sent. Please check your inbox.', 'success');
            }
            else {
                showToastMessage('Sign Up failed', 'error');
                    setFormData ({
                        name: '',
                        email: '',
                        institution: '',
                        password: '',
                    });
            }
        }
            
        catch (err) {
            if (err.message.includes('auth/email-already-in-use')) {
                showToastMessage('Admin with the same email already exists', 'warning');
                setFormData ({
                    name: '',
                    email: '',
                    institution: '',
                    password: '',
                });
            }
        }
    }







        //   CHECKING IF THE EMAIL HAS ALREADY BEEN REGISTERED
    const checkIfEmailExists = async (email) => {
        const querySnapshot = await getDocs(collection(firestore, 'Admin User'), where('email', '==', email));
        return !querySnapshot.empty;
    };





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
        <Box w={['full', 'full', '55%']} h='full' display='flex' alignItems='center' justifyContent='center'>
            <Box rounded='xl' bg='lightsteelblue' w={['90%', '70%', '80%', '75%']} h='auto' py='5' px='3' gap='4' display='flex' flexDir='column' alignItems='center' fontFamily={'Lato'}>
                <Box display='flex' alignItems='center' flexDir='column' w={['95%', '80%']} textAlign='center' p='2' gap='1'>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Admin Sign Up</Text>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='normal'>Create Admin Account!</Text>
                    <Text as='p' fontSize={['sm', 'base', 'lg']}>Welcome aboard! Enter your details to create your account.</Text>
                </Box>

                <form onSubmit={handleSave} className='w-[95%] md:w-[80%] mt-2 flex flex-col justify-between gap-6'>
                    <CustomInput type="text" label="Full Name" placeholder="Full Name" value={formData.name} onChange={handleNameChange} />
                    <CustomInput type="email" label="Email" placeholder="Email" value={formData.email} onChange={handleEmailChange} />
                    <CustomInput type="text" label="Name of Institution" placeholder="Name of Institution" value={formData.institution} onChange={handleInstitutionChange} />
                    <CustomInput type="password" label="Password" placeholder="Password" value={formData.password} onChange={handlePasswordChange} />

                    <button type="submit" className='text-blue-400 px-2 py-2 rounded-xl w-[70%] mx-auto bg-white font-semibold shadow-neutral-200 border-neutral-50 shadow-md transition duration-300  hover:font-semibold hover:bg-blue-400 hover:text-white hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center' >Sign Up</button>
                </form>

                <p className='text-blue-500 my-2 text-xs md:text-sm '>Already have an account? <NavLink to='/login' className='underline cursor-pointer'>Sign In</NavLink></p>
            </Box>
        </Box>

        <Hide below='lg'>
            <Box w='45%' display={['hidden', 'flex']} h='full' alignItems='center' justifyContent='center'>
                <Image src={Students} alt='' objectFit='cover' w={['80%', '90%']} loading='lazy' />
            </Box>
        </Hide>

        <Toast showToast={showToastMessage} />
    </Box>
  )
}

export default SignupForm