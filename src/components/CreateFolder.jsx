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

    const modalHeader = "Modal Title";
    
    const modalBody = (
        <div>
        {/* Your dynamic content for the modal body */}
        <p>This is the dynamic content of the modal body.</p>
        </div>
    );

    const modalFooter = (
        <>
        <Button colorScheme='blue' mr={3} onClick={handleClose}>
            Close
        </Button>
        {/* Additional buttons or elements for the modal footer */}
        </>
    );
  return (
    <div className=''>

        <CustomModal isOpen={handleOpen} onClose={handleClose} modalHeader={modalHeader} modalBody={modalBody} modalFooter={modalFooter} />
    </div>
  )
}

export default CreateFolder