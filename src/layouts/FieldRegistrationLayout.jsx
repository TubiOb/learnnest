import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CustomInput from '../components/CustomInput';
import { Text } from '@chakra-ui/react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../Firebase';
import { toast } from 'sonner'
import Toast from '../components/Toast';

const FieldRegistrationLayout = ({ role }) => {
        // Get role from the query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    role = queryParams.get('role');

    const [courseCount, setCourseCount] = useState(0);
    const [regCourseCount, setRegCourseCount] = useState(0);
  
  
    const handleProgramChange = (value) => {
      setFormData((prevData) => ({
          ...prevData,
          programName: value,
      }));
    };
  
  
        //   DEFAULT VALUES OF FORM DATA //
    const [formData, setFormData] = useState({
        programName: '',
    });




    const handleSave = async (e) => {
      e.preventDefault();

      if (formData.programName.trim() === '') {
        showToastMessage('Study program name cannot be empty', 'warning');
        return;
      }

      try {
        await addDoc(collection(firestore, `Course of Study`), {
          programName: formData.programName,
        });

        showToastMessage('Study Program successfully added', 'success');

            // Update course count after successful save
        fetchCourseCount();
          
        setTimeout(() => {
            //   RESETTING THE FORM
            setFormData ({
                programName: '',
            });
        }, 1500);
      }
      catch (err) {
        showToastMessage('Error occurred while saving data', 'error');
      }
    }




    const fetchCourseCount = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'Course of Study'));
            const courseCount = querySnapshot.size;
            // Update the state or variable with the course count
            setCourseCount(courseCount);
        } catch (error) {
            console.error('Error fetching course count:', error);
        }
    };


    useEffect(() => {
      fetchCourseCount();
    }, []);




    const fetchCoursesCount = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'Courses'));
            const coursesCount = querySnapshot.size;
            // Update the state or variable with the course count
            setRegCourseCount(coursesCount);
        } catch (error) {
            console.error('Error fetching course count:', error);
        }
    };

    useEffect(() => {
        fetchCoursesCount();
    }, []);




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
          <form onSubmit={handleSave} className='w-[90%] lg:w-[80%] mt-2 flex flex-col justify-between text-center gap-6 mx-auto py-2 px-3 rounded-md bg-gray-600 text-white dark:bg-white dark:text-blue-600'>
            <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Register Study Program</Text>
            <CustomInput type="text" label="Study Program" placeholder="Study Program" value={formData.programName} onChange={handleProgramChange} />

            <button type="submit" className='text-white px-2 py-2 rounded-xl w-[70%] mx-auto bg-blue-400 font-semibold shadow-neutral-200 border-neutral-50 shadow-sm transition duration-300  hover:font-semibold hover:bg-white hover:text-blue-400 hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center'>Create</button>
          </form>

          <div className='flex flex-col w-[90%] lg:w-[80%] justify-start h-auto mx-auto py-2 px-2 gap-3 text-center bg-gray-600 text-white dark:bg-white dark:text-blue-600 rounded-md'>
            <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Summary</Text>
            <div className='flex flex-col items-start justify-start text-left gap-1'>
                <Text as='p' fontSize={['xs', 'sm', 'base']} fontWeight='semibold' gap='2'>Field(s) of study: <Text as='span' fontSize={['sm', 'md', 'md']}>{courseCount}</Text></Text>
                <Text as='p' fontSize={['xs', 'sm', 'base']} fontWeight='semibold' gap='2'>Number of courses: <Text as='span' fontSize={['sm', 'md', 'md']}>{regCourseCount}</Text></Text>
                <Text as='p' fontSize={['xs', 'sm', 'base']} fontWeight='semibold' gap='2'>Number of Students: <Text as='span' fontSize={['sm', 'md', 'md']}>0</Text></Text>
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

export default FieldRegistrationLayout