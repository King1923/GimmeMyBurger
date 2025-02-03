import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

const ClientNavbar = () => {
  const { user, setUser } = useContext(UserContext);

  const logout = () => {
    localStorage.clear();
    window.location = '/';
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
              style={{ height: '60px', marginRight: '10px' }} // Adjust logo size to fit the taller navbar
            />
          </Box>

          {/* Navbar Links */}
          <Link to="/" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography variant="h6" component="div">
              Gimme My Burger
            </Typography>
          </Link>
          <Link to="/tutorials" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography>Home</Typography>
          </Link>
          <Link to="/menu" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography>Menu</Typography>
          </Link>
          <Link to="/cart" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography>Cart</Typography>
          </Link>
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
              <Link to="/register" style={{ textDecoration: 'none', color: 'yellow', marginRight: '15px' }}>
                <Typography>Register</Typography>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none', color: 'yellow', marginRight: '15px' }}>
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