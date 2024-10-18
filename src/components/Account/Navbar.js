import React from "react";
import { Typography, AppBar, Toolbar, Button, Box } from "@mui/material";
import { getAuth, signOut } from "firebase/auth"; // Import signOut from Firebase

const Navbar = () => {
  const auth = getAuth(); // Initialize the auth instance

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      // Optionally, redirect the user to the home page or display a success message
      window.location.href = "/"; // Redirect to the home page
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <AppBar position="static"> {/* Change to "fixed" if you want the Navbar to stay at the top */}
      <Toolbar>
        <Typography variant="h6">Shrinkly.ai</Typography>
        <Box ml="auto"> {/* Use ml="auto" for automatic left margin */}
          <Button color="inherit">Links</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
