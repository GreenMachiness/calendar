import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { isUserLoggedIn, clearToken } from "../utility/utils";
import HomeIcon from "@mui/icons-material/Home";
import { fetchMe } from "../utility/api";
import TimerIcon from '@mui/icons-material/Timer';

const StyledButtonLink = styled(Link)(({ theme }) => ({
  //make navbar buttons look more like buttons rather than just text
  textDecoration: "none",
  color: "white",
  padding: theme.spacing(1.5, 2),
  margin: theme.spacing(0, 1),
  borderRadius: "25px",
  border: "2px groove white",

  transition: "background-color 0.3s, color 0.3s",
  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
}));

const Search = styled("div")(({ theme }) => ({
  //searchbar
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  //wrapper for searchIcon
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  //styling
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Navbar() {
  // material UI component
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn()); // usestate for loggedIn or not
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check if user is logged in
    if (isLoggedIn) {
      // fetch user's id using user token
      fetchMe().then((result) => {
        // console.log("fetchMe: ", result);
        // set user id state variable with the user id from the fetch request
        setUserId(result.data.id);
        // console.log("result.data:", result.data);
        setUser(result.data);
      });
    }
  }, [isLoggedIn]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleLogout = () => {
    //logout function
    setIsLoggedIn(false);
    clearToken();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        component={Link}
        to={`/profile/${userId}`}
        onClick={handleMenuClose}
      >
        Profile
      </MenuItem>
      <MenuItem component={Link} to={`/collection`} onClick={handleMenuClose}>
        My Tasks
      </MenuItem>
      {/* Logout Button */}
      <MenuItem
        onClick={() => {
          handleLogout();
          handleMenuClose();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <StyledButtonLink to={"/"}>
            <Typography variant="h6" noWrap>
              <HomeIcon sx={{ fontSize: 25 }} />
            </Typography>
          </StyledButtonLink>
          <StyledButtonLink to={"/stopwatch"}>
            <Typography variant="h6" noWrap>
              <TimerIcon sx={{ fontSize: 25 }} />
            </Typography>
          </StyledButtonLink>
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search> */}
          <Box sx={{ flexGrow: 1 }} />
          {!isLoggedIn ? (
            <StyledButtonLink to={"/login"}>
              <Typography variant="h6" noWrap>
                Login/Register
              </Typography>
            </StyledButtonLink>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center", // make name and account circle centered
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap>
                  {user && `Welcome, ${user.firstName} ${user.lastName}`}
                </Typography>
              </Box>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
