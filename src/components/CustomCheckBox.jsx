import React, { useEffect, useState } from 'react'
import { Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react'
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../Firebase';

const CustomCheckBox = ({ checkedItems, setCheckedItems, onChange }) => {
    const [courses, setCourses] = useState([]);

         //   GETTING CURRENT USER
    // useEffect(() => {
    //     const loggedInUser = auth.onAuthStateChanged( async (user) => {
    //         if (user) {
    //             let  userUID = user.uid;

    //             setCurrentUserId(userUID);
    //             const userDocRef = doc(firestore, 'User', userUID);
               
    //             try {
    //                 console.log(userDocRef);
    //                 const userData = await getDoc(userDocRef);
    //                 console.log(userData);

    //                 if (userData.exists()) {
    //                     const userInfo = userData.data();
    //                     console.log(userInfo)

    //                     if (userInfo) {
    //                         const loggedUser = userInfo.username;
    //                         const usersCourse = userInfo.programName;
    //                         setCurrentUser(loggedUser)
    //                         setUserCourse(usersCourse);
    //                         console.log(loggedUser)
    //                     }
    //                 }
    //             }
    //             catch (err) {
    //                 console.error('Error fetching user data:', err);
    //             }
    //         }
    //         else {
    //             setCurrentUser('')
    //             setCurrentUserId('')
    //         }
    //     });
    //     return () => loggedInUser();
    // }, []);



    const fetchCourses = async () => {
        try {
            const courseRef = await getDocs(collection(firestore, 'Courses'));

            const courseData = courseRef.docs.map((doc) => {
                const course = doc.data();

                return { id: course.courseNo, ...course };
            });
            setCourses(courseData);
        }
        catch (err) {
            console.error('Error fetching courses:', err);
        }
    };






    const handleCheckboxChange = (index) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = !newCheckedItems[index];
        setCheckedItems(newCheckedItems);

        const selectedCourseNames = newCheckedItems
            .map((isChecked, i) => isChecked ? { courseName: courses[i].courseName, courseNo: courses[i].courseNo } : null)
            .filter((course) => course !== null);

        onChange({ checkedItems: newCheckedItems, selectedCourseNames });
    };





    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line
    }, [])

  return (
    <CheckboxGroup alignItems='center' justifyContent='center' flexWrap="wrap">
        <Stack spacing={['2', '4']} direction='row' py='2' px={['1.5', '3']} flexWrap="wrap">
            {courses.map((course, index) => (
                <Checkbox key={course.id} isChecked={checkedItems[index]} colorScheme='green' onChange={() => handleCheckboxChange(index)}>{course.courseName}</Checkbox>
            ))}
            
        </Stack>
    </CheckboxGroup>
  )
}

export default CustomCheckBox