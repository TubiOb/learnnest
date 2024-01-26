import React, { useState } from 'react'
import { Text } from '@chakra-ui/react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import CustomInput from './CustomInput';
import { toast } from 'sonner'
import Toast from '../components/Toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase';

const ForgotPasswordForm = () => {
    const [emailSent, setEmailSent] = useState(false);

        //   SETTING UP NAVIGATION //
    const history = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');

    const handleEmailChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            email: value,
        }));
    };


        //   DEFAULT VALUES OF FORM DATA //
    const [formData, setFormData] = useState({
        email: '',
    });





    const sendEmail = async (e) => {
        e.preventDefault();

        try {
            await sendPasswordResetEmail(auth, formData.email);

            setEmailSent(true);

            showToastMessage('Password Reset Email Sent', 'success');
            setTimeout(() => {
                setFormData({
                    email: '',
                });

                history(`/login?role=${role}`);
            }, 1500);
        }
        catch (err) {
            showToastMessage('Invalid Signin Parameter', 'error');
        }
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
    <div className="rounded-xl bg-white w-[90%] lg:w-[40%] 2xl:w-[50%] h-auto py-9 px-3 gap-4 flex flex-col font-['Lato'] items-center shadow-xl">
        <div className='flex flex-col w-[95%] md:w-[80%] p-2 gap-1'>
            <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold' textAlign={['left', 'center']}>Forgot your password?</Text>
            <Text as='p' fontSize={['xs', 'sm']} textAlign={['left', 'center']}>Enter the email associated with your account, and you will recieve an email with instructions to reset your password.</Text>
            {
                emailSent && (
                    <Text as='p' className='text-xs text-green-600 md:text-base text-left md:text-center' textColor='green.600' fontSize={['xs', 'base']} textAlign={['left', 'center']}>A password reset email has been sent to your mail.</Text>
                )
              }
        </div>

        <form onSubmit={sendEmail} className='w-[95%] md:w-[80%] mt-2 flex flex-col justify-between gap-6'>
            <CustomInput type="email" label="Email" placeholder="Email" value={formData.email} onChange={handleEmailChange} />

            <button type="submit" className='text-white px-3.5 py-2 rounded-xl w-auto mx-auto bg-blue-400 font-semibold shadow-neutral-200 border-neutral-50 shadow-md transition duration-300  hover:font-semibold hover:bg-white hover:text-blue-400 hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center' >Send Instructions</button>
        </form>

        <Text as='p' fontSize={['xs', 'sm']} textColor='blue.500' >Back to <NavLink to='/login' className='underline cursor-pointer'>Login</NavLink></Text>

        <Toast showToast={showToastMessage} />
    </div>
  )
}

export default ForgotPasswordForm