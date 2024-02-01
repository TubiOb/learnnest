import React, { useState } from 'react'
import { Box, Text, Hide, Image } from '@chakra-ui/react';
import Students from '../assets/Students-amico.svg'
import DefaultImage from '../assets/user.png'
import CustomInput from './CustomInput';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner'
import Toast from './Toast';
import { firestore, auth } from '../Firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, where } from 'firebase/firestore';
import CustomRadioInput from './CustomRadioInput';

const SignupForm = () => {
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

    const handleNameChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            name: value,
        }));
    };

    const handlePhoneChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            phoneNumber: value,
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

    const handleDoBChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            dateOfBirth: value,
        }));
    };

    const handleAddressChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            address: value,
        }));
    };

    const handleSelectedChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            gender: value,
        }));
    };

    const handleCourseChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            course: value,
        }));
    }




        //   DEFAULT VALUES OF FORM DATA //
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: '',
        institution: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        password: '',
    });






        //    GETTING FIRSTNAME AS USERNAME FROM GOOGLE AUTH //
    const getFirstName = () => {
        const fullName = formData.name || '';
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

            // PHONE NUMBER VALIDATION
        const validatePhoneNumber = (phoneNumber) => {
            const phoneNumberRegex = /((^\+)(234){1}[0-9]{10})|((^234)[0-9]{10})|((^0)(7|8|9){1}(0|1){1}[0-9]{8})/;
            return phoneNumberRegex.test(phoneNumber);
        }

        if (!validatePhoneNumber(formData.phoneNumber)) {
            showToastMessage('Invalid Phone number', 'error')
        }

            // CHECK IF EMAIL IS ALREADY REGISTERED
        const emailExists = await checkIfEmailExists(formData.email);

        if (emailExists) {
            showToastMessage(`User with the email ${formData.email} already exists`, 'warning');
            return;
        }


            //   GETTING USER DATA FROM FORM AND SENDING TO FIREBASE STORAGE
        try {
            const UserCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

            if (UserCredential && UserCredential.user) {
                    const UserId = UserCredential.user.uid;

                    // const userDocRef = doc(firestore, `Admin/${adminUserId}`);

                    let userDocRef;

                    if (role === 'admin') {
                        userDocRef = doc(firestore, `Admin/${UserId}`);
                    }
                    else if (role === 'student') {
                        userDocRef =  doc(firestore, `Student/${UserId}`);
                    }
                    else {
                        showToastMessage('Invalid user role', 'error');
                        return;
                    }

                        // Generate student ID
                    const studentID = generatedID('student');
                    const staffID = generatedID('admin');

                    if (role === 'admin') {
                        await setDoc(userDocRef, {
                            name: formData.name,
                            username: getFirstName(formData.name),
                            email: formData.email,
                            phoneNumber: formData.phoneNumber,
                            institution: formData.institution,
                            gender: formData.gender,
                            userImage: DefaultImage,
                            staffID: staffID,
                        });
                    }
                    else if (role === 'student') {
                        await setDoc(userDocRef, {
                            name: formData.name,
                            username: getFirstName(formData.name),
                            email: formData.email,
                            phoneNumber: formData.phoneNumber,
                            address: formData.address,
                            institution: formData.institution,
                            gender: formData.gender,
                            dateOfBirth: formData.dateOfBirth,
                            course: formData.course,
                            studentID: studentID,
                            userImage: DefaultImage,
                        });
                    }
                    



                    showToastMessage('Sign Up Successful', 'success');

                    setTimeout(() => {
                        //   RESETTING THE FORM
                        setFormData ({
                            name: '',
                            email: '',
                            course: '',
                            institution: '',
                            phoneNumber: '',
                            dateOfBirth: '',
                            address: '',
                            password: '',
                        });


                        //   ROUTING BACK TO LOGIN PAGE
                        history(`/login?role=${role}`);
                    }, 3500);

                    await sendEmailVerification(UserCredential.user);

                    showToastMessage('Email verification sent. Please check your inbox.', 'success');
            }
            else {
                showToastMessage('Sign Up failed', 'error');
                    setFormData ({
                        name: '',
                        email: '',
                        course: '',
                        institution: '',
                        phoneNumber: '',
                        dateOfBirth: '',
                        address: '',
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
                    course: '',
                    institution: '',
                    phoneNumber: '',
                    dateOfBirth: '',
                    address: '',
                    password: '',
                });
            }
        }
    }




        //   GENERATING STUDENT/STAFF MATRIC NUMBER/ID
    function generatedID(role) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let maxLetters;
        if (role === 'admin') {
            maxLetters = 2; 
        }
        else if (role === 'student') {
            maxLetters = 3;
        }
        const maxNumbers = 2;
        const maxIDLength = 10;
      
           // Generate random numbers
        const generatedNumbers = Math.floor(Math.pow(10, maxNumbers) * Math.random());

            // Generate random letters
        let generatedLetters = '';
        for (let i = 0; i < maxLetters; i++) {
          const randomIndex = Math.floor(Math.random() * letters.length);
          generatedLetters += letters.charAt(randomIndex);
        }
      
             // Calculate the remaining length for random characters
        const remainingLength = maxIDLength - maxNumbers - maxLetters;

            // Generate random characters for the remaining length
        const generatedRandomChars = Math.floor(Math.pow(10, remainingLength) * Math.random()).toString().padStart(remainingLength, '0');
      
            // Combine letters and numbers
        const generatedID = generatedNumbers.toString().padStart(maxNumbers, '0') + generatedLetters + generatedRandomChars;
      
        return generatedID;
    };





        //   CHECKING IF THE EMAIL HAS ALREADY BEEN REGISTERED
    const checkIfEmailExists = async (email) => {
        const querySnapshot = await getDocs(collection(firestore, `capitalizeFirstLetter(${role})`), where('email', '==', email));
        return !querySnapshot.empty;
    };



        //   CAPITALIZING PASSED ROLE NAME
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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






    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];





  return (
    <Box display='flex' flexDir='row' alignItems='center' justifyContent='space-between' w='full' h='100svh' overflowY='auto'>
        <Box w={['full', 'full', '55%']} h='full' display='flex' alignItems='center' justifyContent='center'>
            <Box rounded='xl' bg='lightsteelblue' color='blue.500' _dark={{ bg: 'white', color: 'blue.600' }} w={['90%', '70%', '80%', '75%']} h='auto' py='5' px='3' gap='2' display='flex' flexDir='column' alignItems='center' fontFamily={'Lato'}>
                <Box display='flex' alignItems='center' flexDir='column' w={['95%', '80%']} textAlign='center' p='2' gap='1'>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>{capitalizeFirstLetter(role)} Sign Up</Text>
                    <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='normal'>Create {capitalizeFirstLetter(role)} Account!</Text>
                    <Text as='p' fontSize={['sm', 'base', 'lg']}>Welcome! Enter your details to create your account.</Text>
                </Box>

                <form onSubmit={handleSave} className='w-[95%] md:w-[80%] mt-2 flex flex-col justify-between gap-2.5'>
                    {role === 'admin' && (
                        <React.Fragment>
                            <CustomInput type="text" label="Full Name" placeholder="Full Name" value={formData.name} onChange={handleNameChange} />
                            <CustomInput type="email" label="Email" placeholder="Email" value={formData.email} onChange={handleEmailChange} />
                            <CustomInput type="tel" label="Phone Number" placeholder="Phone Number" value={formData.phoneNumber} onChange={handlePhoneChange} />
                            <CustomInput type="text" label="Name of Institution" placeholder="Name of Institution" value={formData.institution} onChange={handleInstitutionChange} />
                            <CustomRadioInput label='Gender' options={genderOptions} value={formData.gender} onChange={handleSelectedChange} />
                            <CustomInput type="password" label="Password" placeholder="Password" value={formData.password} onChange={handlePasswordChange} />
                        </React.Fragment>
                        
                    )}

                    {role === 'student' && (
                        <React.Fragment>
                            <CustomInput type="text" label="Full Name" placeholder="Full Name" value={formData.name} onChange={handleNameChange} />
                            <CustomInput type="email" label="Email" placeholder="Email" value={formData.email} onChange={handleEmailChange} />
                            <CustomInput type="tel" label="Phone Number" placeholder="Phone Number" value={formData.phoneNumber} onChange={handlePhoneChange} />
                            <CustomInput type="address" label="Address" placeholder="Address" value={formData.address} onChange={handleAddressChange} />
                            <CustomInput type="text" label="Name of Institution" placeholder="Name of Institution" value={formData.institution} onChange={handleInstitutionChange} />
                            <CustomInput type="text" label="Course" placeholder="Course" value={formData.course} onChange={handleCourseChange} />
                            <CustomInput type="date" label="" placeholder="Date of birth" value={formData.dateOfBirth} onChange={handleDoBChange} />
                            <CustomRadioInput label='Gender' options={genderOptions} value={formData.gender} onChange={handleSelectedChange} />
                            <CustomInput type="password" label="Password" placeholder="Password" value={formData.password} onChange={handlePasswordChange} />
                        </React.Fragment>
                    )}
                    

                    <button type="submit" className='text-blue-400 px-2 py-2 rounded-xl w-[70%] mx-auto bg-white font-semibold shadow-neutral-200 border-neutral-50 shadow-md transition duration-300  hover:font-semibold hover:bg-blue-400 hover:text-white hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center' >Sign Up</button>
                </form>

                <p className='text-blue-500 my-2 text-xs md:text-sm '>Already have an account? <NavLink to={`/login?role=${role}`} className='underline cursor-pointer'>Sign In</NavLink></p>
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