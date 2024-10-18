import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Box, CircularProgress, Typography } from '@mui/material';

const LinkRedirect = () => {
  const { shortCode } = useParams(); // Get shortCode from URL params
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore
        console.log('Fetching link for shortCode:', shortCode);
        const linkRef = doc(db, 'links', shortCode); // Reference to the link document
        console.log('Link Document Reference:', linkRef.path);

        const linkDoc = await getDoc(linkRef); // Fetch the document
        console.log('Link Document Data:', linkDoc.data()); // Log document data

        if (linkDoc.exists()) { // Check if the document exists
          const linkData = linkDoc.data();
          console.log('Fetched document data:', linkData);
          
          const { longURL, userUid, linkId } = linkData; // Extract necessary fields

          // Update total clicks for the user's link
          const userLinkRef = doc(db, 'users', userUid, 'links', linkId);
          await updateDoc(userLinkRef, {
            totalClicks: increment(1),
          });
          console.log('Redirecting to:', longURL);
          window.location.replace(longURL); // Redirect to longURL
        } else {
          console.error('Short URL not found');
          setErrorMessage('Short URL not found');
        }
      } catch (error) {
        console.error('Error fetching link:', error);
        setErrorMessage('An error occurred while fetching the link');
      } finally {
        setLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchLinks(); // Call the fetch function
  }, [shortCode]);

  // Loading state UI
  if (loading) {
    return (
      <Box mt={10} textAlign="center">
        <CircularProgress />
        <Typography>Redirecting to the link...</Typography>
      </Box>
    );
  }

  // Error message UI
  return (
    <Box mt={10} textAlign="center">
      <Typography>{errorMessage || 'An unexpected error occurred.'}</Typography>
    </Box>
  );
};

export default LinkRedirect;
