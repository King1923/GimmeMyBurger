import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import http from '../http'; // Ensure you import http if you're using it in useEffect

const ClientNavbar = () => {
  const { user, setUser } = useContext(UserContext);

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

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#1D0200', // Dark brown color
        height: '96px', // Increased height (50% more than usual)
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Toolbar disableGutters={true}>
          {/* Logo Placeholder */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
            <img
              src="src/images/GimmeMyBurger_Logo.png" // Replace with your logo path
              alt="Logo"
              style={{ height: '60px', marginRight: '10px' }}
            />
          </Box>

          {/* Navbar Links */}
          <Link to="/" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography variant="h6" component="div">
              Gimme My Burger
            </Typography>
          </Link>
          <Link to="/promotions" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography>Home</Typography>
          </Link>
          <Link to="/menu" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography>Menu</Typography>
          </Link>
          <Link to="/cart" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography>Cart</Typography>
          </Link>
          <Link to="/rewards" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography>Rewards</Typography>
          </Link>
          <Link to="/storelocator" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography>Store Locator</Typography>
          </Link>
          
          {/* Conditionally render the profile link only if user exists */}
          {user && (
            <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
              <Typography>Profile</Typography>
            </Link>
          )}
          
          <Box sx={{ flexGrow: 1 }}></Box>

          {/* User Actions */}
          {user ? (
            <>
              <Typography sx={{ marginRight: 2, color: 'orange' }}>{user.name}</Typography>
              <Button onClick={logout} sx={{ color: 'orange' }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/register" style={{ textDecoration: 'none', color: 'inherit', marginRight: '15px' }}>
                <Typography>Register</Typography>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography>Login</Typography>
              </Link>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ClientNavbar;
