import '../index.css'
import LearnNest from '../assets/3d-business-guy-and-girl-students.png'
import { Box, Text, Image } from '@chakra-ui/react'

const Preloader = () => {
  return (
    <Box display='flex' flexDir='column' w='full' h='100svh' bg='white' justifyContent='center' alignItems='center' gap='2'>
        <Box display='flex' pos='relative' alignItems='center' justifyContent='center' w={['48', '64', '72']} h={['48', '64', '80']} >
            <Image src={LearnNest} alt="LearnNest" objectFit='cover' loading='lazy' pos='absolute' align='center' w={['24', '36', '44']} />
        </Box>
        <Text as='h4' className='learn' fontSize={['x-large', 'xx-large', 'xxx-large']} fontWeight='semibold'>LearnNest</Text>
    </Box>
  )
}

export default Preloader