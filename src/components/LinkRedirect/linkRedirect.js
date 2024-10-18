import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Box, CircularProgress, Typography } from '@mui/material';

const LinkRedirect = () => {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
        try {
            const db = getFirestore();
            console.log('Fetching link for shortCode:', shortCode);
            const linkRef = doc(db, 'links', shortCode);
            console.log('Link Document Reference:', linkRef.path);
            
            const linkDoc = await getDoc(linkRef);

            if (linkDoc.exists()) {
                const linkData = linkDoc.data();
                console.log('Fetched document data:', linkData);
                
                const { longURL } = linkData; // Extract longURL

                // Update total clicks or redirect logic
                const userLinkRef = doc(db, 'users', linkData.userUid, 'links', linkData.linkId);
                await updateDoc(userLinkRef, {
                    totalClicks: increment(1),
                });
                console.log('Redirecting to:', longURL);
                window.location.replace(longURL);
            } else {
                console.error('Short URL not found');
                setErrorMessage('Short URL not found');
            }
        } catch (error) {
            console.error('Error fetching link:', error);
            setErrorMessage('An error occurred while fetching the link');
        } finally {
            setLoading(false);
        }
    };

    fetchLinks();
}, [shortCode]);

  if (loading) {
    return (
      <Box mt={10} textAlign="center">
        <CircularProgress />
        <Typography>Redirecting to the link...</Typography>
      </Box>
    );
  }

  return (
    <Box mt={10} textAlign="center">
      <Typography>{errorMessage || 'An unexpected error occurred.'}</Typography>
    </Box>
  );
};

export default LinkRedirect;
