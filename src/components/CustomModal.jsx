import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import CustomInput from './CustomInput';
import { collection, doc, getDoc, getDocs, setDoc, where } from 'firebase/firestore';
import { auth, firestore } from '../Firebase';

const CustomModal = ({ isOpen, onClose, modalHeader, inputLabel, inputPlaceholder, buttonName, role }) => {
        // Get role from the query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    role = queryParams.get('role');
    const currentPath = location.pathname + `?role=${role}`;

    const [currentUser, setCurrentUser] = useState('');
    const [currentStudent, setCurrentStudent] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [currentStudentId, setCurrentStudentId] = useState('');
    // eslint-disable-next-line
    const [department, setDepartment] = useState('');
    // eslint-disable-next-line
    const [course, setCourse] = useState('');



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





    const handleNameChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            name: value,
        }));
    };



        //   DEFAULT VALUES OF FORM DATA //
    const [formData, setFormData] = useState({
        name: '',
    });

        // eslint-disable-next-line
    const [modalData, setModalData] = useState({
        isOpen: false,
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        const documentName = formData.name
        if (documentName) {
            if (documentName.length > 3) {
                let exists = false;
                let isFolder = false;
                
                if (modalHeader.toLowerCase().includes('folder')) {
                    isFolder = true;
                    exists = await checkIfFolderExists(documentName);
                }
                else {
                    exists = await checkIfFileExists(documentName);
                }

                if (exists) {
                    alert(`The ${isFolder ? 'folder' : 'file'} with name '${documentName}' already exists.`);
                }
                else {
                    const docRef =  doc(firestore, isFolder ? `Folder` : 'File', documentName);
                    let document;
                    if (role === 'teacher') {
                        document = {
                            createdAt: new Date(),
                            documentName: documentName,
                            userId: currentUserId,
                            createdBy: currentUser,
                            path: currentPath,
                            lastAccessed: null,
                            updatedAt: new Date(),
                            department: department,
                        };
                    }
                    else if (role === 'student') {
                        document = {
                            createdAt: new Date(),
                            documentName: documentName,
                            studentId: currentStudentId,
                            createdBy: currentStudent,
                            path: currentPath,
                            lastAccessed: null,
                            updatedAt: new Date(),
                            department: course,
                        };
                    }
                    
                    console.log(document);
                    await setDoc(docRef, document);
                    


                    alert(`Successfully created ${isFolder ? 'folder' : 'file'} with name '${documentName}'.`);
                }
                setFormData({
                    name: '',
                })
            }
            else {
                alert('Folder name must be at least 3 chaacters')
            }
        }
        else {
            alert('Folder name cannot be empty')
        }
        
        handleCloseModal();
    }


    const handleCloseModal = () => {
        setModalData({
          isOpen: false,
        });
        onClose();
    };



        //   CHECKING IF THE EMAIL HAS ALREADY BEEN REGISTERED
    const checkIfFolderExists = async (name) => {
        const querySnapshot = await getDocs(collection(firestore, `Folder`), where('folderName', '==', name));
        return !querySnapshot.empty;
    };


    const checkIfFileExists = async (name) => {
        const querySnapshot = await getDocs(collection(firestore, `File${role}`), where('fileName', '==', name));
        return !querySnapshot.empty;
    };


    






  return (
    <div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={['xs', 'md', 'lg']} colorScheme='teal'>
            <ModalOverlay backdropFilter='blur(5px) hue-rotate(30deg)' />
            <ModalContent>
                <ModalHeader>{modalHeader}</ModalHeader>
                <ModalCloseButton />
                <ModalBody className='w-full mt-2 flex flex-col justify-between gap-4'>
                    <form onSubmit={handleSubmit}>
                        <CustomInput type="text" label={inputLabel} formData={formData} placeholder={inputPlaceholder} value={formData.name} onChange={handleNameChange} />
                    </form>   
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleSubmit}>{buttonName}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
  )
}

export default CustomModal