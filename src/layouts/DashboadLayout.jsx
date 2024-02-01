import React from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Text, Heading, Image, Stack, Card, CardBody } from '@chakra-ui/react';
import Teachers from '../assets/classroom_906175 (2).png'
import Courses from '../assets/certificate_6988174 (2).png'
import Students from '../assets/students_3941333  (2).png'
import Fees from '../assets/scholarship-hat_12327170 (2).png'
import Assignments from '../assets/clipboard_1308423.png'
import Tests from '../assets/test-results_12427209.png'

const DashboardLayout = ({ role }) => {
      // Get role from the query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  role = queryParams.get('role');


      //   DYNAMICALLY CREATING SIDEBAR MENUITEMS FOR EACH ROLE
  let cardContents = [];

  if (role === 'admin') {
    cardContents = [
      { icon: Students, contents: 'Students' },
      { icon: Teachers, contents: 'Teachers' },
      { icon: Courses, contents: 'Courses' },
      { icon: Fees, contents: 'Fees' },
    ];
  }
  else if (role === 'teacher') {
    cardContents = [
      { icon: Students, contents: 'Students' },
      { icon: Courses, contents: 'Courses' },
      { icon: Assignments, contents: 'Assignments' },
      { icon: Tests, contents: 'Tests' }
    ];
  }
  else if (role === 'student') {
    cardContents = [
      { icon: Teachers, contents: '' },
      { icon: Courses, contents: 'Courses' },
      { icon: Assignments, contents: 'Assignments' },
      { icon: Tests, contents: 'Tests' },
    ];
  };

  return (
    <Box display='flex' h={[ 'screen', '100vh']} py='2' px='4' flexGrow='grow' flex='1' w='full' alignItems='center' justifyContent='center'>
      <Box display='flex' flexDir={['column', 'row']} h='full' gap='6' w='90%' alignItems='center' justifyContent='center' mx='auto'>
        {cardContents.map((card, index) => (
          <Card className='dark:text-blue-600 dark:bg-white' key={index} py='3' w='230px' h='270px' bg='blue.600' color='white' alignItems='center' textAlign='center' justifyContent='center' _hover={{ transform: 'scale(1.04)', transition: 'ease-in-out' }} cursor='pointer' mx='auto' shadow='xl'>
            <CardBody>
              <Image
                src={card.icon}
                alt={card.contents}
                borderRadius='lg'
                w='28'
                mx='auto'
              />
              <Stack mt='6' spacing='3'>
                <Heading size='md'>{card.contents}</Heading>
                <Text fontSize='lg'>
                  0
                </Text>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default DashboardLayout