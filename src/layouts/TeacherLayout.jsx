import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CustomInput from '../components/CustomInput';
import { Text } from '@chakra-ui/react';
import { collection, doc, getDocs, setDoc, where } from 'firebase/firestore';
import { toast } from 'sonner'
import Toast from '../components/Toast';
import { firestore, auth } from '../Firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import CustomRadioInput from '../components/CustomRadioInput';

const TeacherLayout = ({ role }) => {
        // Get role from the query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  role = queryParams.get('role');

  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleNameChange = (value) => {
    setFormData((prevData) => ({
        ...prevData,
        name: value,
    }));
  };


  const handleDeptChange = (value) => {
    setFormData((prevData) => ({
        ...prevData,
        dept: value,
    }));
  };


  const handleEmailChange = (value) => {
    setFormData((prevData) => ({
        ...prevData,
        email: value,
    }));
  };


  const handlePhoneChange = (value) => {
    setFormData((prevData) => ({
        ...prevData,
        phoneNumber: value,
    }));
  };
  
  const handlePasswordChange = (value) => {
    setFormData((prevData) => ({
        ...prevData,
        password: value,
    }));
  };


  useEffect(() => {
    // Generate the password only if it hasn't been generated yet
    if (!isPasswordGenerated) {
      const generatedPassword = generateRandomPassword();

      // Set the generated password in the form data state
      setFormData((prevData) => ({
        ...prevData,
        password: generatedPassword,
      }));

      // Mark the password as generated
      setIsPasswordGenerated(true);
    }
  }, [isPasswordGenerated]);


  const handleSelectedChange = (value) => {
    setFormData((prevData) => ({
        ...prevData,
        gender: value,
    }));
  };


  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];


      //   DEFAULT VALUES OF FORM DATA //
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phoneNumber: '',
      dept: '',
      password: '',
  });


      //   GETTING FIRSTNAME AS USERNAME FROM GOOGLE AUTH //
  const getFirstName = () => {
      const fullName = formData.name || '';
      const username = fullName.split(' ')[0];
      return username;
  };



  const handleSave = async (e) => {
    e.preventDefault();

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
        showToastMessage(`Lecturer with the email ${formData.email} already exists`, 'warning');
        return;
    }

    const generatedPassword = generateRandomPassword();

      //   GETTING USER DATA FROM FORM AND SENDING TO FIREBASE STORAGE
    try {
      const UserCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      if (UserCredential && UserCredential.user) {
          const UserId = UserCredential.user.uid;

          const docRef = doc(firestore, `Lecturer/${UserId}`);

          const lecturerID = generatedID();

          setEmailSent(true);

          await setDoc(docRef, {
            name: formData.name,
            username: getFirstName(formData.name),
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            gender: formData.gender,
            department: formData.dept,
            lecturerId: lecturerID,
          })

          showToastMessage('Sign Up Successful', 'success');

          
          setTimeout(() => {
              //   RESETTING THE FORM
              setFormData ({
                  name: '',
                  email: '',
                  phoneNumber: '',
                  dept: '',
                  password: generatedPassword,
              });


          }, 1500);

          await sendEmailVerification(UserCredential.user);
          await sendPasswordResetEmail(auth, formData.email);

          showToastMessage('Email verification, and password reset mail sent. Please check inbox.', 'success');
      }
      else {
        showToastMessage('Sign Up failed', 'error');
        setFormData ({
            name: '',
            email: '',
            phoneNumber: '',
            dept: '',
            password: generatedPassword,
        });
      }

      
    }
    catch (err) {
      if (err.message.includes('auth/email-already-in-use')) {
        showToastMessage('Admin with the same email already exists', 'warning');
        setFormData ({
            name: '',
            email: '',
            phoneNumber: '',
            dept: '',
            password: generatedPassword,
        });
      }
    }




  }





        //   GENERATING STUDENT/STAFF MATRIC NUMBER/ID
  function generatedID() {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const maxLetters = 2; 
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





      //   GENERATE RANDOM PASSWORD FOR LECTURER
  function generateRandomPassword() {
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%_+';
  
    const allCharacters = lowercaseLetters + uppercaseLetters + numbers + specialCharacters;
  
    let password = '';
    for (let i = 0; i < 9; i++) { // You can adjust the length (8 in this case) to your desired password length
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters.charAt(randomIndex);
    }
  
    return password;
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
    <div className='flex items-center justify-center w-full h-screen'>
      <div className='flex flex-col lg:flex-row items-center justify-between w-full h-[100%] py-4 px-2'>
        <div className='w-full lg:w-[40%] flex flex-col items-start justify-start h-auto lg:h-full p-1 gap-3'>
          <form onSubmit={handleSave} className='w-[90%] md:w-[80%] mt-2 flex flex-col justify-between gap-3 mx-auto py-2 px-3 rounded-md bg-gray-600 text-white dark:bg-white dark:text-blue-600'>
            <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold' textAlign='center'>Register Lecturers</Text>
            {
                emailSent && (
                    <Text as='p' className='text-xs text-green-600 md:text-base text-left md:text-center' textColor='green.600' fontSize={['xs', 'base']} textAlign={['left', 'center']}>A password reset email has been sent to {formData.name} mail.</Text>
                )
            }
            <CustomInput type="text" label="Name" placeholder="Name" value={formData.name} onChange={handleNameChange} />
            <CustomInput type="email" label="Email" placeholder="Email" value={formData.email} onChange={handleEmailChange} />
            <CustomRadioInput label='Gender' options={genderOptions} value={formData.gender} onChange={handleSelectedChange} />
            <CustomInput type="tel" label="Phone Number" placeholder="Phone Number" value={formData.phoneNumber} onChange={handlePhoneChange} />
            <CustomInput type="text" label="Department" placeholder="Department" value={formData.dept} onChange={handleDeptChange} />
            <CustomInput type="password" label="Password" placeholder="Password" value={formData.password} onChange={handlePasswordChange} />

            <button type="submit" className='text-white px-2 py-2 rounded-xl w-[70%] mx-auto bg-blue-400 font-semibold shadow-neutral-200 border-neutral-50 shadow-sm transition duration-300  hover:font-semibold hover:bg-white hover:text-blue-400 hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center'>Register</button>
          </form>

          <div className='flex flex-col w-[90%] lg:w-[80%] justify-start h-auto mx-auto py-2 px-2 gap-3 text-center bg-gray-600 text-white dark:bg-white dark:text-blue-600 rounded-md'>
            <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Summary</Text>
            <div className='flex flex-col items-start justify-start text-left gap-1'>
                <Text as='p' fontSize={['xs', 'sm', 'base']} fontWeight='semibold'>Number of lecturers: <Text as='span' fontSize={['sm', 'md', 'md']}>0</Text></Text>
            </div>
          </div>
        </div>


        <div className='w-full lg:w-[60%] flex items-start justify-center h-full'>
          
        </div>
      </div>
        
        <Toast showToast={showToastMessage} />
    </div>
  )
}

export default TeacherLayout