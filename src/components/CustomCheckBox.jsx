import React, { useEffect, useState } from 'react'
import { Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../Firebase';
import { useLocation } from 'react-router-dom'

const CustomCheckBox = ({ checkedItems, setCheckedItems, onChange, role }) => {
        // Get role from the query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    role = queryParams.get('role');


    const [courses, setCourses] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    // eslint-disable-next-line
    const [currentUserId, setCurrentUserId] = useState('');
    const [userCourse, setUserCourse] = useState('');
    const [loading, setLoading] = useState(true);

         //   GETTING CURRENT USER
    useEffect(() => {
        const loggedInUser = auth.onAuthStateChanged( async (user) => {
            if (user) {
                let  userUID = user.uid;

                setCurrentUserId(userUID);
                const userDocRef = doc(firestore, `Student`, userUID);
                try {
                    console.log(userDocRef);
                    const userData = await getDoc(userDocRef);

                    if (userData.exists()) {
                        const userInfo = userData.data();

                        if (userInfo) {
                            const loggedUser = userInfo.username;
                            const usersCourse = userInfo.programName;
                            setCurrentUser(loggedUser);
                            setUserCourse(usersCourse);
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
            console.log(currentUser);
        });
        return () => loggedInUser();
    }, [currentUser]);




    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (currentUser) {
                    const courseRef = await getDocs(collection(firestore, 'Courses'));

                    const courseData = courseRef.docs
                        .filter(doc => doc.data().programName === userCourse)
                        .map((doc) => {
                            const course = doc.data();
                            return { id: course.courseNo, ...course };
                        })
                        setCourses(courseData);
                        setLoading(false);
                }
            }
            catch (err) {
                console.error('Error fetching courses:', err);
            }
        };
   
        fetchCourses();
        // eslint-disable-next-line
    }, [])






    const handleCheckboxChange = (index) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = !newCheckedItems[index];
        setCheckedItems(newCheckedItems);

        const selectedCourseNames = newCheckedItems
            .map((isChecked, i) => isChecked ? { courseName: courses[i].courseName, courseNo: courses[i].courseNo } : null)
            .filter((course) => course !== null);

        onChange({ checkedItems: newCheckedItems, selectedCourseNames });
    };





    

  return (
    <CheckboxGroup alignItems='center' justifyContent='center' flexWrap="wrap">
        <Stack spacing={['2', '4']} direction='row' py='2' px={['1.5', '3']} flexWrap="wrap">
            {role === 'student' && (
                <React.Fragment>
                    {loading ? (
                        <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
                    ) : (
                        <React.Fragment>
                            {courses.map((course, index) => (
                                <Checkbox key={course.id} isChecked={checkedItems[index]} colorScheme='green' onChange={() => handleCheckboxChange(index)}>{course.courseName}</Checkbox>
                            ))}
                        </React.Fragment>
                    )}
                </React.Fragment>
            )}
            {role === 'teacher' && (
                <React.Fragment>
                    
                </React.Fragment>
            )}
        </Stack>
    </CheckboxGroup>
  )
}

export default CustomCheckBox