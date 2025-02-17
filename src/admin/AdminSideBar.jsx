import React, { useContext } from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText, Avatar, ListItemIcon } from '@mui/material';
import { Link, NavLink } from 'react-router-dom'; // Use NavLink for active styling
import UserContext from '../contexts/UserContext';
import Drawer from '@mui/material/Drawer';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';

const AdminSidebar = () => {
  const { user } = useContext(UserContext);

  // Helper function to convert role number to string
  const getRoleDisplay = (role) => {
    if (typeof role === 'number') {
      return role === 0 ? "Customer" : role === 1 ? "Administrator" : "Staff";
    }
    return role;
  };

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
          backgroundColor: '#000000',
          color: 'darkgoldenrod',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box>
        {/* Top Section */}
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          {/* Replace default avatar with image */}
          <Avatar
            src="src/assets/profile.webp"
            sx={{
              width: 60,
              height: 60,
              margin: '0 auto',
              mb: 1,
              border: '1px solid white',
            }}
          />
          {user && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {user.fName} {user.lName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {getRoleDisplay(user.role)}
              </Typography>
            </Box>
          )}
        </Box>
        <Divider />
        <List>
          {/* Dashboard Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/dashboard"
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'inherit',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'inherit' }}>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          {/* Customers Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/customers"
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'inherit',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'inherit' }}>
              <PeopleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
          {/* Products Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/products"
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'inherit',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'inherit' }}>
              <StorefrontIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          {/* Form Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/form"
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'inherit',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'inherit' }}>
              <DescriptionIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Form" />
          </ListItem>
          {/* Categories Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/categories"
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'inherit',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'inherit' }}>
              <CategoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItem>
          {/* Inventory Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/inventory"
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'inherit',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'inherit' }}>
              <Inventory2Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>
          {/* Orders Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/orders"
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'inherit',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'inherit' }}>
              <ReceiptLongIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          {/* Store Locator Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/adminstorelocator"
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'inherit',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'inherit' }}>
              <StoreMallDirectoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Store Locator" />
          </ListItem>

          {user ? (
            <>
              {/* Logout */}
              <ListItem
                button
                onClick={logout}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  pl: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: 'red',
                  '&:hover': { backgroundColor: 'yellow' },
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
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  pl: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: 'white',
                  '&:hover': { backgroundColor: 'yellow' },
                }}
              >
                <ListItemText primary="Register" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/login"
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  pl: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: 'white',
                  '&:hover': { backgroundColor: 'yellow' },
                }}
              >
                <ListItemText primary="Login" />
              </ListItem>
            </>
          )}
        </List>
      </Box>

      {/* Bottom Section with Burger Logo */}
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <img
          src="src/assets/BURGER_LOGO-removebg-preview 3.png" // Replace with your burger logo path
          alt="Burger Logo"
          style={{ height: '60px' }}
        />
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
