import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import Account from './components/Account/Account';
import Theme from './theme';
import { ThemeProvider } from '@emotion/react';
import { auth } from './firebase';
import { Box, CircularProgress } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import LinkRedirect from './components/LinkRedirect/linkRedirect'; // Corrected import

const App = () => {
  const [user, setUser] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true); // Set initial load to true by default

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitialLoad(false); // Set loading state to false once user state is updated
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show loading indicator until user state is determined
  if (initialLoad) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={Theme}>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/account" /> : <HomePage />}
        />
        <Route
          path="/account"
          element={user ? <Account /> : <Navigate to="/" />}
        />
        <Route path="/:shortCode" element={<LinkRedirect />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
