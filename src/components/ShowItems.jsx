import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { auth, firestore } from '../Firebase';
import { collection, doc, getDoc, getDocs, where } from 'firebase/firestore';
import { FaFolder, FaFileLines } from "react-icons/fa6";

const ShowItems = ({ title, role }) => {
      // Get role from the query parameters
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      role = queryParams.get('role');


      const [currentUser, setCurrentUser] = useState('');
      const [currentStudent, setCurrentStudent] = useState('');
      const [currentUserId, setCurrentUserId] = useState('');
      const [currentStudentId, setCurrentStudentId] = useState('');
      // eslint-disable-next-line
      const [department, setDepartment] = useState('');
      // eslint-disable-next-line
      const [course, setCourse] = useState('');
      const [loading, setLoading] = useState(true);
      const [foldersData,setFoldersData] = useState([]);
      const [filesData, setFilesData] = useState([]);



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
                      const program = userInfo.programName;
                      setCurrentStudent(loggedUser);
                      setCourse(program);
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





      const fetchFilesAndFolders = async () => {
        try {
          let foldersData = [];
          let filesData = [];

          if (role === 'teacher') {
            if (currentUser && currentUserId) {
              const lecturerRef = doc(firestore, 'Lecturer', currentUserId);
              const lecturerDoc = await getDocs(lecturerRef);

              if (lecturerDoc.exists()) {
                const lecturerInfo = lecturerDoc.data();
                const department = lecturerInfo.department;

                if (department) {
                      // Fetch folders
                  const foldersSnapshot = await getDocs(collection(firestore, 'Folder'), where('department', '==', department));
                  foldersData = foldersSnapshot.docs.map((doc) => doc.data());
                  

                      // Fetch files
                  const filesSnapshot = await getDocs(collection(firestore, 'File'), where('department', '==', department));
                  filesData = filesSnapshot.docs.map((doc) => doc.data());
                  
                }
                setFoldersData(foldersData);
                setFilesData(filesData);
              }
              setLoading(false);
            }
          }
          else if (role === 'student') {
            if (currentStudent && currentStudentId) {
              const studentRef = doc(firestore, 'Student', currentStudentId);
              const studentDoc = await getDoc(studentRef);

              if (studentDoc.exists()) {
                const studentInfo = studentDoc.data();
                const course = studentInfo.programName;

                if (course) {
                      // Fetch files
                  const filesSnapshot = await getDocs(collection(firestore, 'File'), where('department', '==', course));
                  filesData = filesSnapshot.docs.map((doc) => doc.data());
                  
                }
                setFilesData(filesData);
              }
              setLoading(false);
            }
          }
        }
        catch (err) {
          console.log('Error fetching File/Folder', err);
        }
      }


      useEffect(() => {
        fetchFilesAndFolders();
        // eslint-disable-next-line
      }, []);



  return (
    <div className='w-full'>
        <h4 className='text-center border-bottom'>{title}</h4>
        <div className='flex flex-col lg:flex-row gap-2 py-4 px-5 flex-wrap'>
          {loading ? (
            <React.Fragment>
              <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {foldersData.map((folder, index) => {
                return (
                  <React.Fragment>
                      <p key={index * 55}  className='flex flex-col py-3 text-center items-center w-32 border'> <FaFolder size='50' className='mb-3' />{folder.documentName}</p>
                  </React.Fragment>  
                )
              })}
              {filesData.map((file, index) => {
                return (
                  <React.Fragment>
                      <p key={index * 55} className='flex flex-col py-3 text-center items-center w-32 border'><FaFileLines size='50' className='mb-3' />{file.documentName}</p>
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        }
        </div>
    </div>
  )
}

export default ShowItems