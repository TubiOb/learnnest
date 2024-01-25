import { ChakraProvider } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { createRoutesFromElements, createBrowserRouter, Route, RouterProvider } from 'react-router-dom';
import Preloader from './components/Preloader';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={isLoading ? <Preloader /> : <LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    )
  )

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4500);
  }, []);


  return (
    <div>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </div>
    
    
  );
}

export default App;
