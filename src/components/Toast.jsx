import React from 'react'
import { Toaster } from 'sonner'
import '../index.css'
import { Box } from '@chakra-ui/react'

const Toast = ({ showToast }) => {

  return (
    <Box>
        <Toaster
            position='top-right'
            visibleToasts={2}
            dir='rtl'
            theme="light"
            invert={true}
            expand={true}
            richColors
            closeButton
            containerStyle={{ marginRight: '2%' }}
            />
    </Box>
  )
}

export default Toast