import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CustomInput from '../components/CustomInput';
import { Text } from '@chakra-ui/react';
import CustomCheckBox from '../components/CustomCheckBox';

const CourseRegistrationLayout = ({ role }) => {
        // Get role from the query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    role = queryParams.get('role');
  
    const [checkedItems, setCheckedItems] = useState([]);
  
    const handleNameChange = (value) => {
      setFormData((prevData) => ({
          ...prevData,
          name: value,
      }));
    };
  
  
        //   DEFAULT VALUES OF FORM DATA //
    const [formData, setFormData] = useState({
        name: '',
    });


    const handleCheckboxChange = ({ checkedItems, selectedCourseNames }) => {
        console.log("Selected Items:", checkedItems);
        console.log("Selected Course Names:", selectedCourseNames);
    };



    useEffect(() => {
        // Log the selected items whenever it changes
        console.log("Selected Items:", checkedItems);
    }, [checkedItems]);
    



  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <div className='flex flex-col lg:flex-row items-center justify-between w-full h-[100%] py-4 px-2'>
        <div className='w-full lg:w-[40%] flex items-start justify-center h-auto lg:h-full p-1'>
          <form className='w-[90%] md:w-[80%] mt-2 flex flex-col justify-between text-center gap-6 mx-auto py-2 px-3 rounded-md bg-gray-600 text-white dark:bg-white dark:text-blue-600'>
            <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Add Courses</Text>
            <CustomInput type="text" label="Name" placeholder="Name" value={formData.name} onChange={handleNameChange} />
            <CustomCheckBox checkedItems={checkedItems} setCheckedItems={setCheckedItems} onChange={handleCheckboxChange} />
          </form>
        </div>
        <div className='w-full lg:w-[60%] flex items-start justify-center h-full'>
          
        </div>
      </div>
        
    </div>
  )
}

export default CourseRegistrationLayout