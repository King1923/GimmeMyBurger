import { Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import { Link, NavLink } from 'react-router-dom'; // Use NavLink for active styling
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import Drawer from '@mui/material/Drawer';

const AdminSidebar = () => {
  const { user, setUser } = useContext(UserContext);

  const logout = () => {
    localStorage.clear();
    window.location = '/';
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1D0200',
          color: 'darkgoldenrod',
        },
      }}
    >
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <img
          src="src/images/GimmeMyBurger_Logo.png" // Replace with your logo path
          alt="Logo"
          style={{ height: '60px', marginBottom: '10px' }}
        />
        <Typography variant="h6" sx={{ color: 'orange' }}>
          Gimme My Burger
        </Typography>
      </Box>
      <Divider />
      <List>
        {/* Navigation Links */}
        <ListItem
          button
          component={NavLink}
          to="/products"
          sx={{
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'inherit',
            '&.active': {
              color: 'white',
              backgroundColor: 'green',
            },
            '&:hover': {
              backgroundColor: 'yellow',
            },
          }}
        >
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/form"
          sx={{
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'inherit',
            '&.active': {
              color: 'white',
              backgroundColor: 'green',
            },
            '&:hover': {
              backgroundColor: 'yellow',
            },
          }}
        >
          <ListItemText primary="Form" />
          
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/categories"
          sx={{
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'inherit',
            '&.active': {
              color: 'white',
              backgroundColor: 'green',
            },
            '&:hover': {
              backgroundColor: 'yellow',
            },
          }}
        >
          <ListItemText primary="Categories" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/AdminPromotions"
          sx={{
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'inherit',
            '&.active': {
              color: 'white',
              backgroundColor: 'green',
            },
            '&:hover': {
              backgroundColor: 'yellow',
            },
          }}
        >
          <ListItemText primary="Promotions" />
        </ListItem>

        <ListItem
          button
          component={NavLink}
          to="/inventory"
          sx={{
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'inherit',
            '&.active': {
              color: 'white',
              backgroundColor: 'green',
            },
            '&:hover': {
              backgroundColor: 'yellow',
            },
          }}
        >
          <ListItemText primary="Inventory" />
        </ListItem>

        <ListItem
          button
          component={NavLink}
          to="/adminStoreLocator"
          sx={{
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'inherit',
            '&.active': {
              color: 'white',
              backgroundColor: 'green',
            },
            '&:hover': {
              backgroundColor: 'yellow',
            },
          }}
        >
          <ListItemText primary="Store Locator" />
        </ListItem>

        {user ? (
          <>
            {/* Account Name */}
            <ListItem button sx={{ justifyContent: 'center' }}>
              <Typography sx={{ color: 'darkblue', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {user.name}
              </Typography>
            </ListItem>
            {/* Logout Button */}
            <ListItem
              button
              onClick={logout}
              sx={{
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: 'red',
                '&:hover': {
                  backgroundColor: 'yellow',
                },
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            {/* Register and Login Buttons */}
            <ListItem
              button
              component={Link}
              to="/register"
              sx={{
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'yellow',
                },
              }}
            >
              <ListItemText primary="Register" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/login"
              sx={{
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'yellow',
                },
              }}
            >
              <ListItemText primary="Login" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;