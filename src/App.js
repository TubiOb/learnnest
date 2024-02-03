import { ChakraProvider } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { createRoutesFromElements, createBrowserRouter, Route, RouterProvider } from 'react-router-dom';
import Preloader from './components/Preloader';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './ThemeContext';
import DashboardLayout from './layouts/DashboadLayout';
import './index.css'
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import CourseRegistrationLayout from './layouts/CourseRegistrationLayout';
import FieldRegistrationLayout from './layouts/FieldRegistrationLayout';
import AddCourseLayouts from './layouts/AddCourseLayouts';
import AssignmentsLayouts from './layouts/AssignmentsLayouts';
import TestsLayout from './layouts/TestsLayout';

function App({ role }) {
  const [isLoading, setIsLoading] = useState(true);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={isLoading ? <Preloader /> : <LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path='dashboard' element={<Dashboard />} >
          <Route path='' element={<DashboardLayout role={role} />} />
          <Route path={`teachers`} element={<TeacherLayout role={role} />} />
          <Route path={`students`} element={<StudentLayout role={role} />} />
          <Route path={`courses`} element={<CourseRegistrationLayout role={role} />} />
          <Route path={'register-study-course'} element={<FieldRegistrationLayout role={role} />} />
          <Route path={'subjects'} element={<AddCourseLayouts role={role} />} />
          <Route path={'assignments'} element={<AssignmentsLayouts role={role} />} />
          <Route path={'tests'} element={<TestsLayout role={role} />} />
        </Route>
      </Route>
    )
  )

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4500);
  }, []);


  return (
    <ThemeProvider>
      <div className='bg-white dark:bg-[#00072d] text-gray-500 dark:text-white  border-gray-300 dark:border-gray-500'>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
