import React, { memo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Tooltip,
  IconButton,
  LinearProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { ContentCopy, DeleteOutline } from "@mui/icons-material";
import copy from "copy-to-clipboard";

const LinkCard = ({ id, createdAt, name, longURL, shortCode, totalClicks, deleteLink }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const shortUrl = `${window.location.origin}/${shortCode}`;

  // Example max value for visualization
  const maxClicks = 1000;

  const handleCopy = () => {
    const success = copy(shortUrl);
    if (success) {
      // Update the browser URL without reloading the page
      window.history.pushState({}, "", shortUrl);
      setSnackbarOpen(true);
    } else {
      console.error("Failed to copy the URL.");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
          minWidth: 400,
          minHeight: 200,
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {name}
            </Typography>
            <Box>
              <Tooltip onClick={handleCopy} title="Copy Short URL" arrow>
                <IconButton color="primary" size="small">
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip onClick={() => deleteLink(id)} title="Delete Link" arrow>
                <IconButton color="error" size="small">
                  <DeleteOutline />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Box>
            <Tooltip title={longURL} arrow>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {longURL}
              </Typography>
            </Tooltip>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography color="textSecondary" variant="caption">
              Total Clicks: {totalClicks}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(totalClicks / maxClicks) * 10}
              sx={{ width: 160, ml: 2 }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Typography color="primary" sx={{ fontWeight: "bold" }}>
              {shortUrl}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Shortened URL copied to clipboard and updated in the browser!
        </Alert>
      </Snackbar>
    </>
  );
};

export default memo(LinkCard);
