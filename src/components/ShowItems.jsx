import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth, firestore } from '../Firebase';
import { collection, doc, getDoc, getDocs, where } from 'firebase/firestore';
import { FaFolder, FaFileLines } from "react-icons/fa6";
import { toast } from 'sonner'
import Toast from '../components/Toast';

const ShowItems = ({ title, role, type, onItemsChange }) => {
          // Get role from the query parameters
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      role = queryParams.get('role');

      const navigate = useNavigate();


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
      const [teacherFilesData, setTeacherFilesData] = useState([]);
      const [filesData, setFilesData] = useState([]);
      // eslint-disable-next-line
      const [currentFolder, setCurrentFolder] = useState(null);




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
                      showToastMessage('Teacher account not found', 'error');
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
              showToastMessage('Student account not found', 'error');
              console.error('Error fetching user data:', err);
            }
          }
          else {
            setCurrentStudent('');
          }
        });
        return () => loggedInStudent();
      }, [currentStudent, currentStudentId]);




      useEffect(() => {
        const fetchFilesAndFolders = async () => {
          try {
            let foldersData = [];
            let filesData = [];

            if (role === 'teacher') {
              if (currentUser && currentUserId) {
                const lecturerRef = doc(firestore, 'Lecturer', currentUserId);
                const lecturerDoc = await getDoc(lecturerRef);

                if (lecturerDoc.exists()) {
                  const lecturerInfo = lecturerDoc.data();
                  const department = lecturerInfo.department;

                  if (department) {
                        // Fetch folders
                    const foldersSnapshot = await getDocs(collection(firestore, 'Folder'), where('department', '==', department));
                    foldersData = foldersSnapshot.docs.map((doc) => ({ ...doc.data(), type: 'folder' }));
                    

                        // Fetch files
                    const filesSnapshot = await getDocs(collection(firestore, 'File'), where('department', '==', department));
                    filesData = filesSnapshot.docs.map((doc) => ({...doc.data(), type: 'file'}));
                    
                  }
                  setFoldersData(foldersData);
                  setTeacherFilesData(filesData);
                  setLoading(false);
                }
                
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
                    filesData = filesSnapshot.docs.map((doc) => ({...doc.data(), type: 'file'}));
                    
                  }
                  
                }
               
                setFilesData(filesData);
                setLoading(false);
                
              }
            }
          }
          catch (err) {
            showToastMessage('Error fetching File/Folder', 'error');
            console.log('Error fetching File/Folder', err);
          }
        }
      
        fetchFilesAndFolders();

        onItemsChange({ filesData, teacherFilesData, foldersData });
        // eslint-disable-next-line 
      }, [currentStudent, currentStudentId, currentUser, currentUserId, role]);







      const handleDoubleClick = (documentId, type) => {
        console.log('Double Clicked:', documentId, 'Type', type);
        if (type === 'folder') {
          setCurrentFolder(documentId);
          navigate(`folder/${documentId}?role=${role}`)
        }
        else {
          showToastMessage('File clicked', 'error');
          alert('File clicked');
        };
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
    <div className='w-full'>
        <h4 className='text-center border-bottom'>{title}</h4>
        <div className='flex items-center lg:items-start justify-center lg:justify-start gap-2 py-4 px-5 flex-wrap'>
          {loading ? (
            <React.Fragment>
              <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {role === 'teacher' && (
                <React.Fragment>
                  {foldersData.map((folder, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div className='flex flex-col py-3 text-center items-center w-32 border cursor-pointer' onDoubleClick={() => handleDoubleClick(folder.documentId, folder.type)}>
                        {folder.type === 'folder' ? (
                          <FaFolder size='50' className='mb-3' />
                        ) : (
                          <FaFileLines size='50' className='mb-3' />
                        )}
                        <p className=''> {folder.documentName}</p>
                        </div>
                          
                      </React.Fragment>  
                    )
                  })}
                
                  {teacherFilesData.map((file, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div className='flex flex-col py-3 text-center items-center w-32 border cursor-pointer' onDoubleClick={() => handleDoubleClick(file.documentId, file.type)}>
                        {file.type === 'file' ? (
                          <FaFileLines size='50' className='mb-3' />
                        ) : (
                          <FaFileLines size='50' className='mb-3' />
                        )}
                        <p className='' >{file.documentName}</p>
                        </div>
                          
                      </React.Fragment>
                    )
                  })}
                </React.Fragment>
              )}
              {role === 'student' && (
                <React.Fragment>
                  {filesData.map((file, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div className='flex flex-col py-3 text-center items-center w-32 border cursor-pointer' onDoubleClick={() => handleDoubleClick(file.documentId, file.type)}>
                          <FaFileLines size='50' className='mb-3' />
                          <p className='' >{file.documentName}</p>
                        </div>
                          
                      </React.Fragment>
                    )
                  })}
                </React.Fragment>
              )}
                  
                {/* </React.Fragment>
              )} */}
            </React.Fragment>
          )
        }
        </div>

        <Toast showToast={showToastMessage} />
    </div>
  )
}

export default ShowItems