import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { auth, firestore } from '../Firebase';
import CustomTable from '../components/CustomTable';

const StudentLayout = ({ role }) => {
  const [students, setStudents] = useState([]);
  const [adminStudents, setAdminStudents] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [department, setDepartment] = useState('');
  // eslint-disable-next-line
  const [currentUserId, setCurrentUserId] = useState('');

  const columns = ['Student ID', 'Student Name', 'Email', 'Gender', 'Course'];

  const handleRowSelect = (selectedRows) => {
    // console.log('Selected Rows:', selectedRows);
  };

  const handleRowAction = (selectedRow) => {
    // console.log('Row Action:', selectedRow);
  };

       //   GETTING CURRENT USER
  useEffect(() => {
        const loggedInUser = auth.onAuthStateChanged( async (user) => {
            if (user) {
                let  userUID = user.uid;

                setCurrentUserId(userUID);
                const userDocRef = doc(firestore, `Lecturer`, userUID);
                try {
                    console.log(userDocRef);
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
            console.log(currentUser);
        });
        return () => loggedInUser();
  }, [currentUser]);





  useEffect(() => {
    const fetchStudents = async () => {
      try {
          if (currentUser) {
              const studentRef = await getDocs(collection(firestore, 'Student'));
  
              if (role === 'teacher') {
                const studentData = studentRef.docs
                  .filter(doc => doc.data().programName === department)
                  .map((doc) => {
                      const pupil = doc.data();
                      return { id: pupil.studentID, 
                               studentname: pupil.name,
                               email: pupil.email,
                               gender: pupil.gender,
                               course: pupil.programName
  
                      };
                  })
                  setStudents(studentData);
              }
              else if (role === 'admin') {
                const adminStudentData = studentRef.docs.map((doc) => {
                  const pupil = doc.data();
                    return {
                        id: pupil.studentID,
                        studentname: pupil.name,
                        email: pupil.email,
                        gender: pupil.gender,
                        course: pupil.programName
                    };
                });

                setAdminStudents(adminStudentData);
              }
  
              
          }
      }
      catch (err) {
          console.error('Error fetching courses:', err);
      }
    };

    fetchStudents();
  })
  






  return (
    <div className='flex items-center justify-center w-full h-screen'>
        <div className='w-full flex items-start justify-center h-full bg-white'>
          <div className='w-fit lg:w-[60%] flex py-4 px-3 items-start justify-center h-full'>
            {role === 'teacher' && (
              <React.Fragment>
                <CustomTable columns={columns} data={students} onRowSelect={handleRowSelect} onRowAction={handleRowAction} />
              </React.Fragment>
            )} 
            {role === 'admin' && (
              <React.Fragment>
                <CustomTable columns={columns} data={adminStudents} onRowSelect={handleRowSelect} onRowAction={handleRowAction} />
              </React.Fragment>
            )}
          </div>
        </div>
    </div>
  )
}

export default StudentLayout