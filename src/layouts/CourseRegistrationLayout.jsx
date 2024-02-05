import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Text, Box } from '@chakra-ui/react';
import CustomCheckBox from '../components/CustomCheckBox';
import { addDoc, collection, doc, getDoc, getDocs, where } from 'firebase/firestore';
import { auth, firestore } from '../Firebase';
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
    const [retrievedLecturerCourses, setRetrievedLecturerCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseCount, setCourseCount] = useState(0);

    const [currentUser, setCurrentUser] = useState('');
    const [currentStudent, setCurrentStudent] = useState('');
    // eslint-disable-next-line
    const [department, setDepartment] = useState('');
    // eslint-disable-next-line
    const [currentUserId, setCurrentUserId] = useState('');
    const [currentStudentId, setCurrentStudentId] = useState('');


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






    useEffect(() => {
      const loggedInUser = auth.onAuthStateChanged( async (user) => {
          if (user) {
              let  userUID = user.uid;
  
              setCurrentUserId(userUID);
              const userDocRef = doc(firestore, `Lecturer`, userUID);
              try {
                  const userData = await getDoc(userDocRef);
  
                  if (userData.exists()) {
                      const userInfo = userData.data();
  
                      if (userInfo) {
                          const loggedUser = userInfo.username;
                          const department = userInfo.department;
                          setCurrentUser(loggedUser);
                          setDepartment(department);
                      }
                  }
              }
              catch (err) {
                  console.error('Error fetching user data:', err);
              }
          }
          else {
              setCurrentUser('')
              // setCurrentUserId('')
          }
      });
      return () => loggedInUser();
    }, [currentUser, currentUserId]);
  
  
  
  
  
    useEffect(() => {
      const loggedInStudent = auth.onAuthStateChanged( async (user) => {
        if (user) {
          let  userUID = user.uid;
  
          setCurrentStudentId(userUID);
          const userDocRef = doc(firestore, `Student`, userUID);
          try {
            const userData = await getDoc(userDocRef);
  
            if (userData.exists()) {
                const userInfo = userData.data();
  
                if (userInfo) {
                    const loggedUser = userInfo.username;
                    setCurrentStudent(loggedUser);
                }
            }
          }
          catch (err) {
            console.error('Error fetching user data:', err);
          }
        }
        else {
          setCurrentStudent('');
        }
      });
      return () => loggedInStudent();
    }, [currentStudent, currentStudentId]);






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
            if (currentStudent && currentStudentId) {
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
          } 
          catch (error) {
              console.error('Error fetching courses:', error);
          }
        };


        fetchRegisteredCourses();
    }, [currentStudent, currentStudentId]);







    useEffect(() => {
      const fetchLecturersCourses = async () => {
        try {
          if (currentUser && currentUserId) {
            const lecturerRef = doc(firestore, 'Lecturer', currentUserId);
            const lecturerDoc = await getDoc(lecturerRef);
            const retrievedData = [];
  
            if (lecturerDoc.exists()) {
              const lecturerInfo = lecturerDoc.data();
              const department = lecturerInfo.department;
  
              if (department) {
                const coursesQuerySnapshot = await getDocs(collection(firestore, 'Courses'), where('programName', '==', department));
                const transformedData = coursesQuerySnapshot.docs.map(courseDoc => {
                  const courseData = courseDoc.data();
                  return {
                    courseCode: courseData.courseNo,
                    courseName: courseData.courseName,
                  }
                })
                retrievedData.push(...transformedData);
              }
            };
            setRetrievedLecturerCourses(retrievedData);
            setLoading(false);
          }
        } catch (error) {
            console.error('Error fetching course count:', error);
        }
      }

      fetchLecturersCourses();
    }, [currentUser, currentUserId]);
    





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
    <div className='flex items-center justify-center w-[85%] mx-auto h-full lg:h-screen'>
      <div className='flex flex-col lg:flex-row items-center justify-center w-full h-[100%] py-4 px-2'>
        <div className='w-full lg:w-[40%] flex flex-col items-start justify-start h-auto lg:h-full p-1 gap-3'>
        {role === 'student' && (
          <React.Fragment>
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
          </React.Fragment>
        )}

          {role === 'teacher' && (
            <React.Fragment>

            </React.Fragment>
          )}
        </div>

        <div className='w-full lg:w-[60%] flex py-4 px-1 items-start justify-center h-full'>
          {role === 'student' && (
            <React.Fragment>
                {loading ? (
                  <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
                ) : (
                  <CustomTable columns={columns} data={retrievedCourses} onRowSelect={handleRowSelect} onRowAction={handleRowAction} />
                )}
            </React.Fragment>
          )}
          {role === 'teacher' && (
            <React.Fragment>
              {loading ? (
                <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
              ) : (
                <CustomTable columns={columns} data={retrievedLecturerCourses} onRowSelect={handleRowSelect} onRowAction={handleRowAction} />
              )}
            </React.Fragment>
          )}  
        </div>
      </div>
        
      <Toast showToast={showToastMessage} />
    </div>
  )
}

export default CourseRegistrationLayout