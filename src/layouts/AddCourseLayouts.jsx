import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CustomInput from '../components/CustomInput';
import { Text } from '@chakra-ui/react';
import { RiAddLine } from "react-icons/ri";
import { IoRemoveSharp } from "react-icons/io5";
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../Firebase';
import { toast } from 'sonner'
import Toast from '../components/Toast';

const AddCourseLayouts = ({ role }) => {
        // Get role from the query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    role = queryParams.get('role');

    // eslint-disable-next-line
    const [allCourses, setAllCourses] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);
    const [courseDataArray, setCourseDataArray] = useState([]);
    const [index, setIndex] = useState(courseDataArray.length > 0 ? courseDataArray.length : 0);
    const [search, setSearch] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedInput, setSelectedInput] = useState('');

    const [courseCount, setCourseCount] = useState(0);


    const handleProgramChange = (value, label) => {
        setFormData((prevData) => ({
            ...prevData,
            programName: value,
        }));
        if (label === 'Study Program') {
            setSearch(value);

            fetchCourse();
            setSelectedInput(value);
        }
        // setSearch(value);
        // setSelectedInput(value);
        // fetchCourse();
    };


    const handleCourseNameChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            courseName: value,
        }));
      };
    
    
    const handleCourseCodeChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            courseNo: value,
        }));
    };




        //   DEFAULT VALUES OF FORM DATA //
    const [formData, setFormData] = useState({
        programName: '',
        courseName: '',
        courseNo: '',
    });
    



    useEffect(() => {
        fetchCourseCount();
    }, []);





    useEffect(() => {
            // Initialize courseDataArray with default course details when the component mounts
        const defaultCourseDetails = {
            courseName: formData.courseName,
            courseNo: formData.courseNo,
            programName: search,
        };
        setCourseDataArray([defaultCourseDetails]);
    }, [search, formData.courseName, formData.courseNo]);




      const fetchCourse = async () => {
        // e.preventDefault();
        try {
            const querySnapshot = await getDocs(collection(firestore, 'Course of Study'));
            const coursesData = querySnapshot.docs.map((doc) => doc.data());

            const updatedFilteredCourses = coursesData.filter((course) => {
                return course.programName.toLowerCase().includes(search.toLowerCase());
            });

            setFilteredCourses(updatedFilteredCourses);

            console.log('Filtered Courses:', filteredCourses);
        } catch (error) {
            console.error('Error fetching course count:', error);
        }
    };




    useEffect(() => {
        // Handle side effects when filteredCourses changes
        if (filteredCourses.length > 0) {
            console.log('Filtered Courses:', filteredCourses);
        } else {
            console.log('No filtered courses or data not yet fetched');
        }
    }, [filteredCourses, search, selectedInput]);




      const fetchCourseCount = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'Courses'));
            const courseCount = querySnapshot.size;
            // Update the state or variable with the course count
            setCourseCount(courseCount);
        } catch (error) {
            console.error('Error fetching course count:', error);
        }
    };




        //   ADDING NEW DYNAMIC COURSE DETAILS DIVS
    const handleAddCourse = async (e) => {
        e.preventDefault();

        try {
                // Create a new course details div
            const newCourseDetailsDiv = (
                <div key={index} className='course details flex flex-row items-center justify-between w-full gap-2'>
                    <CustomInput type="text" label="Course Name" placeholder="Course Name" value={formData.courseName} onChange={handleCourseNameChange} />
                    <CustomInput type="text" label="Course Code" placeholder="Course Code" value={formData.courseNo} onChange={handleCourseCodeChange} />
                    <button onClick={(e) => handleRemoveCourse(index, e)} className='p-0.5 rounded-md shadow-sm bg-white text-red-600 dark:bg-red-600 dark:text-white hover:scale-110'><IoRemoveSharp size='20' /></button>
                </div>
            );

            addCourseToArray();
            setFormData({ ...formData, courseName: '', courseNo: '' });
            setCourseDetails((prevCourseDetails) => [...prevCourseDetails, newCourseDetailsDiv]);
                // Increment the index for the next newCourseDetailsDiv
            setIndex((index) => index + 1);
        }
        catch (err) {
            console.log(err.message);
        }
        
    };



    useEffect(() => {
        // Handle side effects when selectedCourse changes
        if (selectedCourse && selectedCourse.programName) {
            console.log('Selected Course:', selectedCourse);
            setSearch(selectedCourse.programName);
        } else {
            console.log('No selected course or data not yet fetched');
        }
    }, [selectedCourse, search]);



        //   REMOVING THE DYNAMIC COURSE DETAILS DIVS
    const handleRemoveCourse = (indexToRemove, e) => {
        e.preventDefault();

        setCourseDetails((prevCourseDetails) => {
          const updatedCourseDetails = [...prevCourseDetails];
          updatedCourseDetails.splice(indexToRemove, 1);
          return updatedCourseDetails;
        });
      }




    const handleSelectCourse = (course) => {
        setSearch(course.programName);
        try {
            if (course.programName.toLowerCase() === selectedInput.toLowerCase()) {
                setSearch(course.programName);
                setSelectedInput(course.programName);
            }
    
            setSelectedCourse(course.programName);
    
            setFilteredCourses((prevFilteredCourses) =>
                prevFilteredCourses.filter((c) => c !== course)
            );
        }
        catch (err) {
            console.log(err.message);
            showToastMessage('Error saving course', 'error');
        }
    };





    const addCourseToArray = () => {
        const newCourseDetails = {
            courseName: formData.courseName,
            courseNo: formData.courseNo,
            programName: selectedInput,
        };

        if (index === 0) {
            setCourseDataArray([newCourseDetails]);
        } 
        else {
            setCourseDataArray((prevCourseDataArray) => [...prevCourseDataArray, newCourseDetails]);
        }

        setAllCourses((prevAllCourses) => [...prevAllCourses, newCourseDetails]);
    }
    





    useEffect(() => {
        // Fetch courses when search or selectedInput changes
        fetchCourse();
        // eslint-disable-next-line
    }, [search]);





    const handleSave = async (e) => {
        e.preventDefault();

        try {
            await Promise.all(courseDataArray.map(async (courseDetail) => {
                await addDoc(collection(firestore, 'Courses'), courseDetail);
            }));
                // Update course count after successful save
            await fetchCourseCount();

            showToastMessage('Course(s) successfully added', 'success');
            setTimeout(() => {
                //   RESETTING THE FORM
                setFormData ({
                    programName: '',
                    search: '',
                    courseName: '',
                    courseNo: '',
                });
            }, 1500);
        }
        catch (err) {
            console.error('Error saving course:', err.message);
            alert(err.message);
            showToastMessage('Error saving course', 'error');
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
    <div className='flex items-center justify-center w-full h-screen'>
      <div className='flex flex-col lg:flex-row items-center justify-between w-full h-[100%] py-4 px-2 gap-4 lg:gap-0'>
        {role === 'admin' && (
            <React.Fragment>
                <div className='w-full lg:w-[40%] flex flex-col items-start justify-start h-auto lg:h-full p-1 gap-3'>
                
                    <form onSubmit={handleSave} className='trick w-full md:w-[80%] mt-2 flex flex-col justify-between text-center gap-6 mx-auto py-2 px-3 rounded-md bg-gray-500 text-white dark:bg-white dark:text-blue-600 overflow-y-auto'>
                        <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Add Courses</Text>
                        <CustomInput type="text" label="Study Program" placeholder="Study Program" value={search} onChange={(value) => handleProgramChange(value, 'Study Program')} />
                        {search && filteredCourses.length > 0 && (
                            <ul className='bg-blue-100 w-full py-1.5 px-2 -mt-5 rounded-lg text-left gap-0.5'>
                                {filteredCourses.map((course, index) => (
                                    <li key={index} onClick={() => handleSelectCourse(course)} className='cursor-pointer'>
                                        {course.programName}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className='flex flex-col items-start justify-between w-full gap-2'>
                            <div className='flex flex-row items-center justify-between w-full gap-2'>
                                <div key={index} className='flex flex-row items-center justify-between w-full gap-2'>
                                    <CustomInput type="text" label="Course Name" placeholder="Course Name" value={formData.courseName} onChange={handleCourseNameChange} />
                                    <CustomInput type="text" label="Course Code" placeholder="Course Code" value={formData.courseNo} onChange={handleCourseCodeChange} />
                                    <button onClick={handleAddCourse} className='p-0.5 rounded-md shadow-sm bg-white text-blue-600 dark:bg-blue-600 dark:text-white hover:scale-110'><RiAddLine size='20' /></button>
                                </div>
                            </div>
                            {courseDetails}
                        </div>

                        <button type="submit" className='text-white px-2 py-2 rounded-xl w-[70%] mx-auto bg-blue-400 font-semibold shadow-neutral-200 border-neutral-50 shadow-sm transition duration-300  hover:font-semibold hover:bg-white hover:text-blue-400 hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center'>Add Courses</button>
                    </form>

                    <div className='flex flex-col w-[90%] lg:w-[80%] justify-start h-auto mx-auto py-2 px-2 gap-3 text-center bg-gray-600 text-white dark:bg-white dark:text-blue-600 rounded-md'>
                        <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Summary</Text>
                        <div className='flex flex-col items-start justify-start text-left gap-1'>
                            <Text as='p' fontSize={['xs', 'sm', 'base']} fontWeight='semibold' gap='2'>Number of registered courses: <Text as='span' fontSize={['sm', 'md', 'md']}>{courseCount}</Text></Text>
                        </div>
                    </div>                    
                </div>


                <div className='w-full lg:w-[60%] flex items-start justify-center h-screen'>
                        
                </div>
            </React.Fragment>
        )}
        {role === 'teacher' && (
            <React.Fragment>
                <div className='w-full lg:w-[40%] flex flex-col items-start justify-center h-auto lg:h-full p-1 gap-2 overflow-y-auto'>
                    <div className='flex flex-col w-[90%] lg:w-[80%] justify-start h-auto mx-auto py-2 px-2 gap-3 text-center bg-gray-600 text-white dark:bg-white dark:text-blue-600 rounded-md'>
                        <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Summary</Text>
                        <div className='flex flex-col items-start justify-start text-left gap-1'>
                            <Text as='p' fontSize={['xs', 'sm', 'base']} fontWeight='semibold' gap='2'>Number of registered courses: <Text as='span' fontSize={['sm', 'md', 'md']}>{courseCount}</Text></Text>
                        </div>
                    </div>
                </div>

                <div className='w-full lg:w-[60%] flex items-start justify-center h-full bg-white'>
            
                </div>
            </React.Fragment>
        )}
      </div>

      <Toast showToast={showToastMessage} />
    </div>
  )
}

export default AddCourseLayouts