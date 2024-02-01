import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './ThemeContext';
// import { useLocation } from 'react-router-dom'

const RootApp = ({ role }) => {

  useEffect(() => {
    // Perform any asynchronous operations here if needed
  }, [role]);

  return (
    <React.StrictMode>
      <ThemeProvider>
        <App role={role} />
      </ThemeProvider>
    </React.StrictMode>
  );
};

  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(<RootApp />);