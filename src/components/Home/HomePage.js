import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const HomePage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const auth = getAuth();

  const handleChange = (event) => {
    setForm((oldForm) => ({
      ...oldForm,
      [event.target.name]: event.target.value,
    }));
    setErrorMessage(""); // Reset error message on input change
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      console.log("User signed up:", userCredential.user);
      setSnackbarMessage("Sign-up successful!");
      setSnackbarOpen(true);
      handleCloseDialog(); // Close the dialog on successful signup
    } catch (error) {
      console.error("Error signing up:", error.message);
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      console.log("User signed in:", userCredential.user);
      setSnackbarMessage("Sign-in successful!");
      setSnackbarOpen(true);
      handleCloseDialog(); // Close the dialog on successful sign-in
    } catch (error) {
      console.error("Error signing in:", error.message);
      setErrorMessage("User not found or invalid password."); // Set a user-friendly error message
      setSnackbarMessage(""); // Clear snackbar message
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm({ email: "", password: "" }); // Reset form
    setErrorMessage(""); // Reset error message
  };

  return (
    <Box display="flex" flexDirection="column" p={2} boxSizing="border-box" height="100vh" bgcolor="#56B7BA" color="fff">
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2} width="100%">
        <Typography variant="h4" color="white">Shrinkly.ai</Typography>
        <Button
          sx={{ color: '#56B7BA', backgroundColor: 'white', borderColor: '#56B7BA' }}
          variant="outlined"
          onClick={handleOpenDialog}
        >
          Login/SignUp
        </Button>
      </Box>
      <Box display="flex" flexGrow={1} alignItems="center" mt={4}>
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <Box>
              <Typography variant="h3" color="white">Shrink URLs, Expand Possibilities</Typography>
              <Box my={2}>
                <Typography color="white">Powerful link shortener to help your brand grow.</Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'grey',
                  color: 'white',
                  padding: '12px 24px',
                  fontSize: '18px',
                  width: '200px',
                }}
                onClick={handleOpenDialog}
              >
                Get Started
              </Button>
            </Box>
          </Grid>
          <Grid item sm={6}>
            <img style={{ width: '100%', borderRadius: '10px' }} src="/assests/screely.png" alt="mock" />
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      {/* Dialog for Login/Signup */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isLogin ? "Login" : "Sign Up"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={form.password}
            onChange={handleChange}
          />
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={isLogin ? handleSignIn : handleSignUp} color="primary">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </DialogActions>
        <Box textAlign="center" mt={2}>
          {isLogin ? (
            <Typography>
              Don't have an account?{" "}
              <Button onClick={() => setIsLogin(false)}>Sign Up</Button>
            </Typography>
          ) : (
            <Typography>
              Already have an account?{" "}
              <Button onClick={() => setIsLogin(true)}>Login</Button>
            </Typography>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default HomePage;
