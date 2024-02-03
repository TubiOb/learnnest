import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaFileCirclePlus, FaFileArrowUp, FaFolderPlus } from "react-icons/fa6";
// import { BsFileEarmarkArrowDownFill } from "react-icons/bs";
// import { HiMiniFolderArrowDown } from "react-icons/hi2";
import ShowItems from '../components/ShowItems';
import CustomModal from './../components/CustomModal';

const AssignmentsLayouts = ({ role }) => {
          // Get role from the query parameters
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      role = queryParams.get('role');

      const folders = ['New Folder', 'New folder 2'];
      const files = ['New File', 'New file 2'];


      


      const [modalData, setModalData] = useState({
        isOpen: false,
        modalHeader: '',
        inputLabel: '',
        inputPlaceholder: '',
        buttonName: '',
      });
    
      const handleOpenModal = (modalHeader, inputLabel, inputPlaceholder, buttonName) => {
        setModalData({
          isOpen: true,
          modalHeader,
          inputLabel,
          inputPlaceholder,
          buttonName,
        });
      };
    
      const handleCloseModal = () => {
        setModalData({
          isOpen: false,
          modalHeader: '',
          inputLabel: '',
          inputPlaceholder: '',
          buttonName: '',
        });
      };



  return (
    <div className='flex items-center justify-center w-full h-screen'>
        <div className='flex flex-col items-center w-full h-[100%] py-4 px-2 gap-4 lg:gap-2'>
        {role === 'teacher' && (
          <React.Fragment>
              <div className='w-full items-end flex justify-end gap-3'>
                  <button type="" onClick={() => handleOpenModal('Upload File', 'File name', 'File name', 'Upload File')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFileArrowUp /> Upload File</button>
                  <button type="" onClick={() => handleOpenModal('Create File', 'File name', 'File name', 'Create File')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFileCirclePlus /> Create File</button>
                  <button type="" onClick={() => handleOpenModal('Create Folder', 'Folder name', 'Folder name', 'Create Folder')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFolderPlus /> Create Folder</button>
                  {/* <button type="" className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><HiMiniFolderArrowDown /> Download Folder</button> */}
              </div>

              <hr className='my-3 w-full' />

              <ShowItems title={'Created Folders'} items={folders} />
              <ShowItems title={'Created Files'} items={files} />
          </React.Fragment>
            
        )}
        {role === 'student' && (
          <React.Fragment>
              <div className='w-full flex justify-end gap-3'>
                  {/* <button type="" onClick={() => handleOpenModal('Download File', <CustomInput type="text" label="" placeholder="" value={''} onChange={''} />, <Button onClick={handleCloseModal}>Download File</Button>)} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><BsFileEarmarkArrowDownFill /> Download File</button> */}
                  <button type="" onClick={() => handleOpenModal('Upload File', 'File name', 'File name', 'Upload File')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFileArrowUp /> Upload File</button>
                  <button type="" onClick={() => handleOpenModal('Create File', 'File name', 'File name', 'Create File')} className='py-1.5 px-1 lg:px-2.5 border border-neutral-300 rounded-md text-xs lg:text-sm font-medium flex gap-1 items-center hover:bg-white hover:text-blue-600'><FaFileCirclePlus /> Create File</button>
              </div>

              <hr className='my-3 w-full' />

              <ShowItems title={'Created Folders'} items={folders} />
              <ShowItems title={'Created Files'} items={files} />
          </React.Fragment>
            
        )}
            
        </div>

        <CustomModal isOpen={modalData.isOpen} onClose={handleCloseModal} modalHeader={modalData.modalHeader} inputLabel={modalData.inputLabel} inputPlaceholder={modalData.inputPlaceholder} buttonName={modalData.buttonName} />
    </div>
  )
}

export default AssignmentsLayouts