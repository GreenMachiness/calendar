import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container, Grid, Typography, Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../../utility/api";

function Register(props) {
  const navigate = useNavigate(); // navigate to homepage
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false); // need setstate for Success Snackbar
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false); // need state for Error Snackbar

  const handleClick = async () => {
    // collect form input data
    const formData = {
      firstName,
      lastName,
      email,
      password,
      zipCode,
    };

    try {
      // send to the API to create an account
      const data = await register(formData);
      console.log("registration successful!", data);
      setOpenSuccessSnackbar(true); // set success snackbar open on successful registration
      setTimeout(() => {
        navigate("/login"); // redirect after showing Success Snackbar
      }, 2000); // redirect after 2 seconds
    } catch (error) {
      console.error("Failed to register:", error);
      setOpenErrorSnackbar(true); // set error snackbar open on failed registration
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };

  return (
    <Container maxWidth={"xs"}>
      <Typography variant="h3">Registration Page</Typography>
      <Grid
        className="register-form"
        container
        flexDirection={"column"}
        rowGap={2}
      >
        {/* firstname */}
        <TextField
          id="firstName_field"
          label="First Name"
          variant="filled"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {/* lastName */}
        <TextField
          id="lastName_field"
          label="Last Name"
          variant="filled"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {/* email */}
        <TextField
          id="email_field"
          label="E-mail"
          variant="filled"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* password */}
        <TextField
          id="password_field"
          label="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* zipCode */}
        <TextField
          id="zipCode_field"
          label="Zip Code"
          variant="filled"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
        {/* register button */}
        <Button variant="contained" onClick={handleClick}>
          Register
        </Button>
        {/* success Snackbar */}
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={3000}
          onClose={handleClose}
          message="Registration successful!"
          anchorOrigin={{
            //appear on center
            vertical: "top",
            horizontal: "center",
          }}
        />
        {/* error Snackbar */}
        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={3000}
          onClose={handleClose}
          message="Registration failed! Please try again."
          anchorOrigin={{
            //appear on center
            vertical: "top",
            horizontal: "center",
          }}
        />
      </Grid>
    </Container>
  );
}

export default Register;
