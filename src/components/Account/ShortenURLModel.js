import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

const ShortenURLModel = ({ createShortenLink, handleClose }) => {
    const [name, setName] = useState("");
    const [longURL, setLongURL] = useState("");
    const [nameError, setNameError] = useState("");
    const [urlError, setUrlError] = useState("");

    // Regular expression to check if the input is a valid URL
    const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/?]?.*)$/;

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset errors
        setNameError("");
        setUrlError("");

        // Validate name length
        if (name.length < 3) {
            setNameError("Name must be at least 3 characters long.");
            return;
        }

        // Validate URL format
        if (!urlRegex.test(longURL)) {
            setUrlError("Please enter a valid URL.");
            return;
        }

        // If validations pass, proceed with creating the shortened link
        await createShortenLink(name, longURL);
        handleClose(); // Ensure this is called after the link is created
    };

    return (
        <Modal open onClose={handleClose}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: 4, bgcolor: 'white', borderRadius: 2, maxWidth: 400, margin: 'auto' }}
            >
                <Typography variant="h6" mb={2}>Create Shortened URL</Typography>
                <TextField
                    label="Link Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                    error={Boolean(nameError)}
                    helperText={nameError}
                />
                <TextField
                    label="Long URL"
                    value={longURL}
                    onChange={(e) => setLongURL(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                    error={Boolean(urlError)}
                    helperText={urlError}
                />
                <Button type="submit" variant="contained" color="primary">Create Link</Button>
            </Box>
        </Modal>
    );
};

export default ShortenURLModel;
