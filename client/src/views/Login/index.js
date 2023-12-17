import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { login } from "../../utility/api";
import { setToken } from "../../utility/utils";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // state for success snackbar
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false); // state for error snackbar
  const navigate = useNavigate(); // hook for navigation
  const [showPassword, setShowPassword] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
    setOpenErrorSnackbar(false); // close error snackbar
  };

  const handleClick = async () => {
    // collect form input data
    const formData = {
      email,
      password,
    };

    try {
      const data = await login(formData);
      console.log("login successful!", data);
      // get token from response body
      const token = data.token;
      // save the token given by the server for later fetch requests
      setToken(token);
      // set isLoggedIn to true upon successful login
      setIsLoggedIn(true);
      // open the success snackbar upon successful login
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/"); // redirect after showing Success Snackbar
      }, 2000);
    } catch (error) {
      console.error("Login failed:", error);
      setOpenErrorSnackbar(true); // open the error snackbar on failed login
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "65vh",
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px", // spacing between elements
        }}
      >
        <Typography variant="h2" gutterBottom>
          Login
        </Typography>
        <TextField
          id="filled-basic"
          label="E-mail"
          variant="filled"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          id="password_field"
          label="Password"
          variant="filled"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: '100%' }} 
        />
        <Button variant="contained" onClick={handleClick}>
          Login
        </Button>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            style={{ backgroundColor: "purple", color: "white" }}
          >
            No Account? Sign up!
          </Button>
        </Link>
      </Box>
      <Snackbar // succesful snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successfully logged in!
        </MuiAlert>
      </Snackbar>

      <Snackbar //error snackbar
        open={openErrorSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Login failed! Please try again.
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default Login;
