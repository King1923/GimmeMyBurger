import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  ListItemIcon 
} from '@mui/material';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AdminSidebar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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

  // Navigate to AdminProfile page when the avatar is clicked
  const handleAvatarClick = () => {
    navigate(`/adminprofile/${user.id}`);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        // Drawer paper styling
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
          {/* Updated Avatar: now shows "ADMIN" in white */}
          <Avatar
            sx={{
              width: 60,
              height: 60,
              margin: '0 auto',
              mb: 1,
              border: '1px solid white',
              cursor: 'pointer',
              bgcolor: 'transparent',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
            onClick={handleAvatarClick}
          >
            ADMIN
          </Avatar>
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
        <List sx={{ width: '100%' }}>
          {/* Admin Profile Link with Icon (moved to the top of the list) */}
          <ListItem
            button
            component={NavLink}
            to={`/adminprofile/${user.id}`}
            sx={{
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          {/* Dashboard Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/dashboard"
            sx={{
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          {/* Customers Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/admincustomers"
            sx={{
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
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
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
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
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
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
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
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
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
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
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
              <ReceiptLongIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          {/* Promotions Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/adminpromotions"
            sx={{
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
              <AttachMoneyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Promotions" />
          </ListItem>
          {/* Store Locator Link with Icon */}
          <ListItem
            button
            component={NavLink}
            to="/adminstorelocator"
            sx={{
              width: '100%',
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#FFA500',
              '&.active': { color: 'white', backgroundColor: 'green' },
              '&:hover': { backgroundColor: 'yellow' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#FFA500' }}>
              <StoreMallDirectoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Store Locator" />
          </ListItem>

          {user ? (
            <ListItem
              button
              onClick={logout}
              sx={{
                width: '100%',
                pl: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: 'red',
                '&:hover': { backgroundColor: 'yellow' },
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <>
              <ListItem
                button
                component={Link}
                to="/register"
                sx={{
                  width: '100%',
                  pl: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#FFA500',
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
                  width: '100%',
                  pl: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#FFA500',
                  '&:hover': { backgroundColor: 'yellow' },
                }}
              >
                <ListItemText primary="Login" />
              </ListItem>
            </>
          )}
        </List>
      </Box>

      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <img
          src="/BURGER_LOGO-removebg-preview 3.png"
          alt="Burger Logo"
          style={{ height: '60px' }}
        />
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
