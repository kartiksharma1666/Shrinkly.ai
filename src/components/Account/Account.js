import React, { useEffect, useState,useCallback } from "react";
import { Grid2, Box, Typography, Button } from "@mui/material";
import Navbar from "./Navbar";
import LinkCard from "./LinkCard";
import ShortenURLModel from "./ShortenURLModel";
import { auth, firestore } from "../../firebase"; // Ensure this path is correct
import { nanoid } from "nanoid";
import { collection, addDoc, serverTimestamp, getDocs , deleteDoc, doc } from 'firebase/firestore';

const Account = () => {
    const [openModal, setOpenModal] = useState(false);
    const [links, setLinks] = useState([]);

    const handleCreateShortenURL = async (name, longURL) => {
        if (!auth.currentUser) {
            console.error("User is not authenticated.");
            return;
        }

        const link = {
            name,
            longURL : longURL.includes('https://') || longURL.includes('http://') ? longURL : `http://${longURL}`,
            createdAt: serverTimestamp(),
            shortCode: nanoid(6),
            totalClicks: 0,
        };

        try {
            const linksCollection = collection(firestore, "users", auth.currentUser.uid, "links");
            await addDoc(linksCollection, link);
            console.log("Link created:", link);
            await fetchLinks(); // Fetch links after creation to refresh the list
            setOpenModal(false); // Close modal after the link is created
        } catch (error) {
            console.error("Error creating link: ", error);
        }
    };

    const fetchLinks = async () => {
        if (!auth.currentUser) return;

        const linksCollection = collection(firestore, "users", auth.currentUser.uid, "links");
        const snapshot = await getDocs(linksCollection);
        const fetchedLinks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        

        // Sort links by createdAt in descending order
        fetchedLinks.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        setLinks(fetchedLinks);
    };
    const handleDelete = useCallback (async (linkId) => {
      if (!auth.currentUser) return;

      try {
          const linkRef = doc(firestore, "users", auth.currentUser.uid, "links", linkId);
          await deleteDoc(linkRef);
          await fetchLinks(); // Refresh the list after deletion
      } catch (error) {
          console.error("Error deleting link: ", error);
      }
  },[]);

  const handleCopyLink = () => {
      alert("Shortened URL copied to clipboard!"); // Optional: Use a more sophisticated notification system
  };

    useEffect(() => {
        fetchLinks();
    }, []);

    return (
        <>
            {openModal && <ShortenURLModel createShortenLink={handleCreateShortenURL} handleClose={() => setOpenModal(false)} />}
            <Navbar />
            <Box mt={1} pt={8}>
                <Grid2 container justifyContent="center">
                    <Grid2 item xs={10} sm={8} md={6}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Links</Typography>
                            <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                                Create New
                            </Button>
                        </Box>
                        {links.map((link) => (
                            <LinkCard key={link.id} {...link} deleteLink ={handleDelete} onCopy={handleCopyLink} />
                        ))}
                    </Grid2>
                </Grid2>
            </Box>
        </>
    );
};

export default Account;
