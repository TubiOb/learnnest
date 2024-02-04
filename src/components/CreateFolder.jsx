import React, { useState } from 'react'
import CustomModal from './CustomModal'

const CreateFolder = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    
  return (
    <div className=''>

        <CustomModal isOpen={handleOpen} onClose={handleClose} modalHeader={modalHeader} modalBody={modalBody} modalFooter={modalFooter} />
    </div>
  )
}

export default CreateFolder