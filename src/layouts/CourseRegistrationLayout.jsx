import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Text, Box } from '@chakra-ui/react';
import CustomCheckBox from '../components/CustomCheckBox';
import { addDoc, collection, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../Firebase';
import { toast } from 'sonner'
import Toast from '../components/Toast';
import CustomTable from '../components/CustomTable';

const CourseRegistrationLayout = ({ role }) => {
        // Get role from the query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    role = queryParams.get('role');

        //   SETTING UP NAVIGATION //
    const history = useNavigate();
  
    const [checkedItems, setCheckedItems] = useState([]);
    const [courses, setCourses] = useState([]);
    const [retrievedCourses, setRetrievedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseCount, setCourseCount] = useState(0);


    const columns = ['Course Code', 'Course Name'];

    const handleRowSelect = (selectedRows) => {
      // console.log('Selected Rows:', selectedRows);
    };

    const handleRowAction = (selectedRow) => {
      // console.log('Row Action:', selectedRow);
    };
  
  
        //   DEFAULT VALUES OF FORM DATA //
        // eslint-disable-next-line
    const [formData, setFormData] = useState({
        regCourses: '',
    });


    const handleCheckboxChange = ({ checkedItems, selectedCourseNames }) => {
        // console.log("Selected Items:", checkedItems);
        // console.log("Selected Course Names:", selectedCourseNames);

        setFormData((prevData) => ({
          ...prevData,
          regCourses: selectedCourseNames,
        }));

        setCourses(selectedCourseNames);
    };




    const handleSave = async (e) => {
        e.preventDefault();

        try {
          await addDoc(collection(firestore, `Registered Courses`), {
            regCourses: courses,
          });

          showToastMessage('Course Registration successful', 'success');

          setTimeout(() => {
            
            //   ROUTING BACK TO LOGIN PAGE
            history(`/dashboard?role=${role}`);
        }, 1500);
        }
        catch (err) {

        }
    }



    useEffect(() => {
        // Log the selected items whenever it changes
    }, [checkedItems]);

   




    useEffect(() => {
        const fetchRegisteredCourses = async () => {
          // e.preventDefault();
          try {
              const collectionRef = collection(firestore, 'Registered Courses');
              const querySnapshot = await getDocs(collectionRef);
              const retrievedData = [];
              
              querySnapshot.forEach(async (doc) => {
                    // eslint-disable-next-line
                const documentId = doc.id;
                const docRef = doc.ref;
                const docSnapshot = await getDoc(docRef);
        
                if (docSnapshot.exists()) {
                  const data = docSnapshot.data();
        
                      // Assuming the data is stored in the "courses" field
                  if (data && Array.isArray(data.regCourses)) {
                    const transformedData = data.regCourses.map((course) => ({
                      courseCode: course.courseNo,
                      courseName: course.courseName,
                    }));
                    retrievedData.push(...transformedData);
                    const courseCount = retrievedData.length;
                    setCourseCount(courseCount);
                  }
                }
                setRetrievedCourses(retrievedData);
                setLoading(false);
              });
              
          } 
          catch (error) {
              console.error('Error fetching courses:', error);
          }
        };


        fetchRegisteredCourses();
    }, [])
    





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
    <div className='flex items-center justify-center w-full h-full lg:h-screen'>
      <div className='flex flex-col lg:flex-row items-center justify-between w-full h-[100%] py-4 px-2'>
        <div className='w-full lg:w-[40%] flex flex-col items-start justify-start h-auto lg:h-full p-1 gap-3'>
          <form onSubmit={handleSave} className='w-[90%] md:w-[80%] mt-2 flex flex-col justify-between text-center gap-6 mx-auto py-2 px-3 rounded-md bg-gray-600 text-white dark:bg-white dark:text-blue-600'>
            <Box>
              <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Register Your Courses</Text>
              <Text as='p' fontSize={['sm', 'sm', 'base']} fontWeight='semibold'>Below is a list of courses available to you for this program. Select your required courses.</Text>
            </Box>
          
            <Box rounded='lg' className='bg-blue-600 text-white'>
              <CustomCheckBox checkedItems={checkedItems} setCheckedItems={setCheckedItems} onChange={handleCheckboxChange} />
            </Box>
            
            <button type="submit" className='text-white px-2 py-2 rounded-xl w-[70%] mx-auto bg-blue-400 font-semibold shadow-neutral-200 border-neutral-50 shadow-sm transition duration-300  hover:font-semibold hover:bg-white hover:text-blue-400 hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center'>Register</button>
          </form>

          <div className='flex flex-col w-[90%] lg:w-[80%] justify-start h-auto mx-auto py-2 px-2 gap-3 text-center bg-gray-600 text-white dark:bg-white dark:text-blue-600 rounded-md'>
              <Text as='h4' fontSize={['lg', 'xl', '2xl']} fontWeight='semibold'>Summary</Text>
              <div className='flex flex-col items-start justify-start text-left gap-1'>
                  <Text as='p' fontSize={['xs', 'sm', 'base']} fontWeight='semibold' gap='2'>Number of your registered courses: <Text as='span' fontSize={['sm', 'md', 'md']}>{courseCount}</Text></Text>
              </div>
          </div>
        </div>

        <div className='w-fit lg:w-[60%] flex py-4 px-3 items-start justify-center h-full'>
          {loading ? (
            <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
          ) : (
            <CustomTable columns={columns} data={retrievedCourses} onRowSelect={handleRowSelect} onRowAction={handleRowAction} />
          )}
          
        </div>
      </div>
        
      <Toast showToast={showToastMessage} />
    </div>
  )
}

export default CourseRegistrationLayout