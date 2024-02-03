import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import React, { useState } from 'react'
import CustomInput from './CustomInput';

const CustomModal = ({ isOpen, onClose, modalHeader, inputLabel, inputPlaceholder, buttonName }) => {
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
        alert(formData.name)
        if (formData.name) {

        }
        handleCloseModal();
    }


    const handleCloseModal = () => {
        setModalData({
          isOpen: false,
        });
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
                        <CustomInput type="text" label={inputLabel} placeholder={inputPlaceholder} value={formData.name} onChange={handleNameChange} />
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