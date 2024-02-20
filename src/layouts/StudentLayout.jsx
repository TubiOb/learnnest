import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { auth, firestore } from '../Firebase';
import CustomTable from '../components/CustomTable';

const StudentLayout = ({ role }) => {
      // Get role from the query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  role = queryParams.get('role');

  const [students, setStudents] = useState([]);
  const [adminStudents, setAdminStudents] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [admin, setAdmin] = useState('');
  // eslint-disable-next-line
  const [department, setDepartment] = useState('');
  // eslint-disable-next-line
  const [currentUserId, setCurrentUserId] = useState('');
  // eslint-disable-next-line
  const [adminId, setAdminId] = useState('');
  const [loading, setLoading] = useState(true);

  const columns = ['Student ID', 'Student Name', 'Email', 'Gender', 'Department'];

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
    const fetchStudents = async () => {
      try {
        if (role === 'teacher') {
          if (currentUser && currentUserId) {
            const lecturerRef = doc(firestore, 'Lecturer', currentUserId);
            const lecturerDoc = await getDoc(lecturerRef);

            if (lecturerDoc.exists()) {
              const lecturerInfo = lecturerDoc.data();
              const department = lecturerInfo.department;

              if (department) {
                const studentQuery = query(collection(firestore, 'Student'), where('programName', '==', department));
                const studentRef = await getDocs(studentQuery);
                const studentData = studentRef.docs
                  .map((doc) => {
                      const pupil = doc.data();
                      return { id: pupil.studentID, 
                              studentname: pupil.name,
                              email: pupil.email,
                              gender: pupil.gender,
                              course: pupil.programName,
                      };
                  })
                setStudents(studentData);
                setLoading(false);
              }
            }      
          }
        }
          
      }
      catch (err) {
          console.error('Error fetching courses:', err);
      }
    };

    fetchStudents();
  }, [currentUser, currentUserId, role]);











  useEffect(() => {
    const loggedInAdmin = auth.onAuthStateChanged( async (user) => {
        if (user) {
            let  userUID = user.uid;

            setAdminId(userUID);
            const userDocRef = doc(firestore, `Admin`, userUID);
            try {
                const userData = await getDoc(userDocRef);

                if (userData.exists()) {
                    const userInfo = userData.data();

                    if (userInfo) {
                        const loggedUser = userInfo.username;
                        setAdmin(loggedUser);
                    }
                }
            }
            catch (err) {
                console.error('Error fetching user data:', err);
            }
        }
        else {
            setAdmin('')
            // setCurrentUserId('')
        }
    });
    return () => loggedInAdmin();
}, [admin, adminId]);





  




  useEffect(() => {
    const fetchAllStudents = async () => {
      if (admin && adminId) {
        const studentRef = await getDocs(collection(firestore, 'Student'));
        
        if (role === 'admin') {
          const adminStudentData = studentRef.docs.map((doc) => {
            const pupil = doc.data();
              return {
                  id: pupil.studentID,
                  studentname: pupil.name,
                  email: pupil.email,
                  gender: pupil.gender,
                  course: pupil.programName,
              };
          });

          setAdminStudents(adminStudentData);
          setLoading(false);
        }
      }
    }

    fetchAllStudents();
  }, [admin, adminId, role]);
  






  return (
    <div className='flex items-center justify-center mx-auto w-[85%] h-full lg:h-screen'>
        <div className='flex flex-col lg:flex-row items-center justify-center w-full h-[100%] py-4'>
              <div className='w-full lg:w-[60%] flex py-4 px-3 items-start justify-center h-full'>
                {role === 'teacher' && (
                  <React.Fragment>
                    {loading ? (
                      <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
                        ) : (
                      <CustomTable columns={columns} data={students} onRowSelect={handleRowSelect} onRowAction={handleRowAction} />
                    )}
                  </React.Fragment>
                )} 
                {role === 'admin' && (
                  <React.Fragment>
                    {loading ? (
                      <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
                    ) : (
                      <CustomTable columns={columns} data={adminStudents} onRowSelect={handleRowSelect} onRowAction={handleRowAction} />
                    )}
                  </React.Fragment>
                )}
              </div>
        </div>
    </div>
  )
}

export default StudentLayout