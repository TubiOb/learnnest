import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Text, Heading, Image, Stack, Card, CardBody } from '@chakra-ui/react';
import Teachers from '../assets/classroom_906175 (2).png'
import Courses from '../assets/certificate_6988174 (2).png'
import Students from '../assets/students_3941333  (2).png'
import Fees from '../assets/scholarship-hat_12327170 (2).png'
import Assignments from '../assets/clipboard_1308423.png'
import Tests from '../assets/test-results_12427209.png'
import { collection, doc, getDoc, getDocs, where } from 'firebase/firestore';
import { auth, firestore } from '../Firebase';

const DashboardLayout = ({ role }) => {
      // Get role from the query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  role = queryParams.get('role');

  const [lecturerCount, setLecturerCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [studentLecturerCount, setStudentLecturerCount] = useState(0);
  const [studentCourseCount, setStudentCourseCount] = useState(0);
  const [lecturerCourseCount, setLecturerCourseCount] = useState(0);
  const [lecturerStudentCount, setLecturerStudentCount] = useState(0);
  const [currentUser, setCurrentUser] = useState('');
  const [currentStudent, setCurrentStudent] = useState('');
  // eslint-disable-next-line
  const [department, setDepartment] = useState('');
  // eslint-disable-next-line
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentStudentId, setCurrentStudentId] = useState('');


      //   DYNAMICALLY CREATING SIDEBAR MENUITEMS FOR EACH ROLE
  let cardContents = [];

  if (role === 'admin') {
    cardContents = [
      { icon: Students, contents: 'Students', count: studentCount },
      { icon: Teachers, contents: 'Lecturers', count: lecturerCount },
      { icon: Courses, contents: 'Courses', count: courseCount },
      { icon: Fees, contents: 'Fees', count: 0 },
    ];
  }
  else if (role === 'teacher') {
    cardContents = [
      { icon: Students, contents: 'Students', count: lecturerStudentCount },
      { icon: Courses, contents: 'Courses', count: lecturerCourseCount },
      { icon: Assignments, contents: 'Assignments', count: 0 },
      { icon: Tests, contents: 'Tests', count: 0 }
    ];
  }
  else if (role === 'student') {
    cardContents = [
      { icon: Teachers, contents: 'Lecturers', count: studentLecturerCount },
      { icon: Courses, contents: 'Courses', count: studentCourseCount },
      { icon: Assignments, contents: 'Assignments', count: 0 },
      { icon: Tests, contents: 'Tests', count: 0 },
    ];
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










  const fetchLecturerCount = async () => {
      try {
        if (currentUser && currentUserId) {
          const lecturerRef = doc(firestore, 'Lecturer', currentUserId);
          const lecturerDoc = await getDocs(lecturerRef);

          if (lecturerDoc.exists()) {
            const lecturerInfo = lecturerDoc.data();
            const department = lecturerInfo.department;

            if (department) {
              const coursesQuerySnapshot = await getDocs(collection(firestore, 'Courses'), where('programName', '==', department));
              const studentsQuerySnapshot = await getDocs(collection(firestore, 'Student'), where('programName', '==', department));

              const courseCount = coursesQuerySnapshot.size;
              const studentCount = studentsQuerySnapshot.size;

              setLecturerCourseCount(courseCount);
              setLecturerStudentCount(studentCount);
            }
          };
        }
      } catch (error) {
          console.error('Error fetching course count:', error);
      }
  };




  const fetchStudentCount = async () => {
    try {
      if (currentStudent && currentStudentId) {
        const studentRef = doc(firestore, 'Student', currentStudentId);
        const studentDoc = await getDoc(studentRef);

        if (studentDoc.exists()) {
          const studentInfo = studentDoc.data();
          const course = studentInfo.programName;

          if (course) {
            const coursesQuerySnapshot = await getDocs(collection(firestore, 'Courses'), where('programName', '==', course));
            const lecturerQuerySnapshot = await getDocs(collection(firestore, 'Lecturer'), where('department', '==', course));
          
            const courseCount = coursesQuerySnapshot.size;
            const lecturerCount = lecturerQuerySnapshot.size;

            setStudentCourseCount(courseCount);
            setStudentLecturerCount(lecturerCount);
          }
        }
      } 
    } catch (error) {
        console.error('Error fetching course count:', error);
    }
  };




  useEffect(() => {
    fetchLecturerCount();
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    fetchStudentCount();
    // eslint-disable-next-line
  }, []);



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

  const fetchAdminStudentCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'Student'));
      const count = querySnapshot.size;

      setStudentCount(count);
    }
    catch (err) {
      console.error('Error fetching student count:', err);
    }
  };



  const fetchAdminLecturerCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'Lecturer'));
      const count = querySnapshot.size;

      setLecturerCount(count);
    }
    catch (err) {
      console.log('Error fetching lecturer count', err);
    }
  }




  useEffect(() => {
    fetchCourseCount();
  }, []);


  useEffect(() => {
    fetchAdminStudentCount();
  }, []);


  useEffect(() => {
    fetchAdminLecturerCount();
  }, []);






  return (
    <Box display='flex' h={[ 'screen', '100vh']} py='2' px='4' flexGrow='grow' flex='1' w='full' alignItems='center' justifyContent='center'>
      <Box display='flex' flexDir={['column', 'row']} h='full' gap='6' w='90%' alignItems='center' justifyContent='center' mx='auto'>
        {cardContents.map((card, index) => (
          <Card className='dark:text-blue-600 dark:bg-white' key={index} py='3' w='230px' h='270px' bg='blue.600' color='white' alignItems='center' textAlign='center' justifyContent='center' _hover={{ transform: 'scale(1.04)', transition: 'ease-in-out' }} cursor='pointer' mx='auto' shadow='xl'>
            <CardBody>
              <Image
                src={card.icon}
                alt={card.contents}
                borderRadius='lg'
                w='28'
                mx='auto'
              />
              <Stack mt='6' spacing='3'>
                <Heading size='md'>{card.contents}</Heading>
                <Text fontSize='lg'>
                  {card.count}
                </Text>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default DashboardLayout