import { AppBar, Toolbar, Typography, Box, Button, Container, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../contexts/UserContext';
import http from '../http'; // Ensure you import http if you're using it in useEffect
import PersonIcon from '@mui/icons-material/Person'; // Import profile icon
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import cart icon

const ClientNavbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("Failed to authenticate user:", err);
        });
    }
  }, [setUser]);

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      window.location = "/";
    }
  };

  // Open the dropdown menu on mouse enter
  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu when mouse leaves the menu area
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#000000',
        height: '115px', // Increased height
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
            <img
              src="src/assets/BURGER_LOGO-removebg-preview 3.png" // Replace with your logo path
              alt="Logo"
              style={{ height: '90px', marginRight: '10px' }}
            />
          </Box>

          {/* Navbar Links */}
          <Link to="/menu" style={{ textDecoration: 'none', color: 'orange', marginRight: '30px' }}>
            <Typography>MENU</Typography>
          </Link>
          <Link to="/addreward" style={{ textDecoration: 'none', color: 'orange', marginRight: '30px' }}>
            <Typography>REWARDS</Typography>
          </Link>
          <Link to="/storelocator" style={{ textDecoration: 'none', color: 'orange', marginRight: '30px' }}>
            <Typography>STORE LOCATOR</Typography>
          </Link>
          <Link to="/rewards" style={{ textDecoration: 'none', color: 'orange', marginRight: '30px' }}>
            <Typography>MY ORDERS</Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }}></Box>

          {/* User Actions */}
          {user ? (
            <>
              <Typography sx={{ marginRight: 2, color: 'orange', fontSize: '1.5rem' }}>
                {user.name}
              </Typography>
              {/* Cart Icon */}
              <IconButton onClick={() => navigate('/cart')} sx={{ color: 'orange', marginRight: 1 }}>
                <ShoppingCartIcon fontSize="large" sx={{ color: 'orange', fontSize: '2rem' }} />
              </IconButton>
              {/* Profile Icon with dropdown menu */}
              <Box
                onMouseEnter={handleMouseEnter}
                sx={{ display: 'inline-block' }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'transparent',
                    border: '3px solid orange',
                    width: 25,
                    height: 25
                  }}
                >
                  <PersonIcon fontSize="large" sx={{ color: 'orange', fontSize: '2.35rem' }} />
                </Avatar>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                  onMouseLeave: handleMenuClose,
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: { backgroundColor: '#000', color: 'orange' }
                }}
              >
                <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                  Orders
                </MenuItem>
                <MenuItem onClick={() => { navigate(`/editprofile/${user.id}`); handleMenuClose(); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/addresses'); handleMenuClose(); }}>
                  Addresses
                </MenuItem>
                <MenuItem onClick={() => { logout(); handleMenuClose(); }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link to="/register" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
                <Typography>REGISTER</Typography>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none', color: 'orange' }}>
                <Typography>LOGIN</Typography>
              </Link>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ClientNavbar;
