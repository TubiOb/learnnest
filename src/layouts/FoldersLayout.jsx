// import React, { useEffect, useState } from 'react'
// import { useParams, useLocation } from 'react-router-dom'
// import { firestore } from '../Firebase';
// import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'

// const FoldersLayout = ({ role }) => {
//       // Get role from the query parameters
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   role = queryParams.get('role');

//   const { documentId } = useParams();
//   const [currentFolderData, setCurrentFolderData] = useState(null);
//   const [parentFolder, setParentFolder] = useState(null);
//   const [childFolders, setChildFolders] = useState([]);

//   useEffect(() => {
//     const fetchFolderData = async () => {
//       try {
//         const folderRef = doc(firestore, 'Folder', documentId);
//         const folderDoc = await getDoc(folderRef);

//         if (folderDoc.exists()) {
//           const folderData = folderDoc.data();
//           setCurrentFolderData(folderData);

//           if (folderData.parentFolderId) {
//             const parentFolderRef = doc(firestore, 'Folder', folderData.parentFolderId);
//             const parentFolderDoc = await getDoc(parentFolderRef);

//             if (parentFolderDoc.exists()) {
//               const parentFolderData = parentFolderDoc.data();
//               setParentFolder(parentFolderData);
//             }
//           }

//           // Fetch child folders
//           const childFoldersQuery = query(collection(firestore, 'Folder'), where('parentFolderId', '==', documentId));
//           const childFoldersSnapshot = await getDocs(childFoldersQuery);
//           const childFoldersData = childFoldersSnapshot.docs.map((doc) => doc.data());
//           setChildFolders(childFoldersData);
//         }
//         else {

//         }
//       }
//       catch (err) {

//       }
//     }

//     fetchFolderData();
//   }, [documentId, currentFolderData]);






//   const [modalData, setModalData] = useState({
//     isOpen: false,
//     modalHeader: '',
//     inputLabel: '',
//     inputPlaceholder: '',
//     buttonName: '',
//   });

//   const handleOpenModal = (modalHeader, inputLabel, inputPlaceholder, buttonName) => {
//     setModalData({
//       isOpen: true,
//       modalHeader,
//       inputLabel,
//       inputPlaceholder,
//       buttonName,
//     });
//   };

//   const handleCloseModal = () => {
//     setModalData({
//       isOpen: false,
//       modalHeader: '',
//       inputLabel: '',
//       inputPlaceholder: '',
//       buttonName: '',
//     });
//   };






//   return (
//     <div className='flex items-start justify-start w-[85%] mx-auto h-full lg:h-screen'>
//       <div className='flex flex-col items-center w-full h-[100%] py-4 px-2 gap-4 lg:gap-2'>
//       {role === 'teacher' && (
//             <React.Fragment>
//                 <div className='w-full items-end flex justify-end gap-3'>
//                     <button type="" onClick={() => handleOpenModal('Upload File', 'File name', 'File name', 'Upload File')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFileArrowUp /> Upload File</button>
//                     <button type="" onClick={() => handleOpenModal('Create File', 'File name', 'File name', 'Create File')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFileCirclePlus /> Create File</button>
//                     <button type="" onClick={() => handleOpenModal('Create Folder', 'Folder name', 'Folder name', 'Create Folder')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFolderPlus /> Create Folder</button>
//                     {/* <button type="" className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><HiMiniFolderArrowDown /> Download Folder</button> */}
//                 </div>

//                 <hr className='my-3 w-full' />


//                 <div className='flex w-full items-start flex-col'>
//                   <Breadcrumb fontWeight='medium' marginStart='5' fontSize='sm' flexDir='column'>
//                     <BreadcrumbItem isCurrentPage _hover={{ cursor: 'pointer', color: 'black' }} className='dark:hover:text-white'>
//                       <BreadcrumbLink as={NavLink} to={`test?role=${role}`}>Home</BreadcrumbLink>
//                     </BreadcrumbItem>

//                     <BreadcrumbItem _hover={{ cursor: 'pointer', color: 'black' }} className='dark:hover:text-white'>
//                       <BreadcrumbLink as={NavLink} to='#'>About</BreadcrumbLink>
//                     </BreadcrumbItem>
//                   </Breadcrumb>
//                 </div>


//                 <ShowItems title={'Created Folders'} items={foldersData.filter(item => item.type === 'folder')} foldersData={foldersData} onItemsChange={handleItemsChange} />
//                 {/* <ShowItems title={'Created Files'} items={files.filter(item => item.type === 'file')} filesData={teacherFilesData} onItemsChange={handleItemsChange} /> */}
//             </React.Fragment>
              
//           )}
//           {role === 'student' && (
//             <React.Fragment>
//                 <div className='w-full flex justify-end gap-3'>
//                     {/* <button type="" onClick={() => handleOpenModal('Download File', <CustomInput type="text" label="" placeholder="" value={''} onChange={''} />, <Button onClick={handleCloseModal}>Download File</Button>)} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><BsFileEarmarkArrowDownFill /> Download File</button> */}
//                     <button type="" onClick={() => handleOpenModal('Upload File', 'File name', 'File name', 'Upload File')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFileArrowUp /> Upload File</button>
//                     <button type="" onClick={() => handleOpenModal('Create File', 'File name', 'File name', 'Create File')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFileCirclePlus /> Create File</button>
//                 </div>

//                 <hr className='my-3 w-full' />


//                 <div className='flex w-full items-start flex-col'>
//                   <Breadcrumb fontWeight='medium' fontSize='sm' flexDir='column'>
//                     <BreadcrumbItem _hover={{ cursor: 'pointer', color: 'black' }} className='dark:hover:text-white'>
//                       <BreadcrumbLink as={NavLink} to={`test?role=${role}`}>Home</BreadcrumbLink>
//                     </BreadcrumbItem>

//                     <BreadcrumbItem _hover={{ cursor: 'pointer', color: 'black' }} className='dark:hover:text-white'>
//                       <BreadcrumbLink as={NavLink} to='#'>About</BreadcrumbLink>
//                     </BreadcrumbItem>
//                   </Breadcrumb>
//                 </div>

               
//                 {/* <ShowItems title={'Created Files'} items={files.filter(item => item.type === 'file')}  filesData={filesData} onItemsChange={handleItemsChange} /> */}
//             </React.Fragment>
//           )}
//         <div>
//             {
//               childFolders.length > 0 ? (
//                 <p>
//                   {JSON.stringify(childFolders)};
//                 </p>
//               ) :
//               (
//                 <p>
//                   Empty Folder
//                 </p>
//               )
//             }
//           </div>
//       </div>
//     </div>
//   )
// }

// export default FoldersLayout