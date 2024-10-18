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
        const linkDoc = await getDoc(linkRef);

        if (linkDoc.exists()) {
          const linkData = linkDoc.data();
          console.log('Fetched document data:', linkData);

          // Validate fields and ensure they exist in the document
          if (!linkData.longURL || !linkData.linkId || !linkData.userUid) {
            console.error('Required fields are missing in the document:', {
              longURL: linkData.longURL,
              linkId: linkData.linkId,
              userUid: linkData.userUid,
            });
            setErrorMessage('Required data fields are missing in the document.');
            return;
          }

          const { longURL, linkId, userUid } = linkData;
          const userLinkRef = doc(db, 'users', userUid, 'links', linkId);

          // Increment the click count
          await updateDoc(userLinkRef, {
            totalClicks: increment(1),
          });
          console.log('Redirecting to:', longURL);

          // Redirect to the long URL
          window.location.replace(longURL);
        } else {
          console.error('Short URL not found in Firestore');
          setErrorMessage('Short URL not found.');
        }
      } catch (error) {
        console.error('Error fetching the link:', error);
        setErrorMessage('An error occurred while fetching the link. Please try again later.');
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
