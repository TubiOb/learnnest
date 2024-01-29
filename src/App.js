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

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={isLoading ? <Preloader /> : <LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path='dashboard' element={<Dashboard />} />
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
