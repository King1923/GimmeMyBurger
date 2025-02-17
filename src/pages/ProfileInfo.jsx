import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Button,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { toast } from 'react-toastify';
import defaultProfile from '../assets/profile.webp';

function ProfileInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info on component mount
  useEffect(() => {
    http.get(`/user/${id}`)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Failed to fetch user info");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress /> 
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 8, color: '#fff' }}>
        User not found.
      </Typography>
    );
  }

  // Format dates for display:
  const formattedDoB = new Date(user.doB).toLocaleDateString();
  const formattedCreatedAt = new Date(user.createdAt).toISOString().split('T')[0];

  return (
    <Box sx={{ minHeight: '100vh', p: 4 }}>
      <Grid container spacing={4}>
        {/* LEFT SIDEBAR */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            ACCOUNT
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer', fontWeight: 'bold' }} 
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              Profile
            </Typography>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer' }} 
              onClick={() => navigate('/addresses')}
            >
              Addresses
            </Typography>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer' }} 
              onClick={() => navigate(`/change-password/${user.id}`)}
            >
              Reset Password
            </Typography>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer' }} 
              onClick={() => navigate('/delete-account')}
            >
              Delete Account
            </Typography>
          </Box>
        </Grid>

        {/* MAIN CONTENT AREA */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            PROFILE
          </Typography>
          <Box sx={{ p: 2 }}>
            {/* Combined User Info and Details */}
            <Grid container spacing={2}>
              {/* Name & Email */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#aaa' }}>
                  NAME
                </Typography>
                <Typography variant="body1">
                  {user.fName} {user.lName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#aaa' }}>
                  EMAIL
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Grid>
              {/* Mobile */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#aaa' }}>
                  MOBILE NUMBER
                </Typography>
                <Typography variant="body1">{user.mobile}</Typography>
              </Grid>
              {/* Delivery Address */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#aaa' }}>
                  DELIVERY ADDRESS
                </Typography>
                <Typography variant="body1">{user.deliveryAddress}</Typography>
              </Grid>
              {/* Date of Birth */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#aaa' }}>
                  DATE OF BIRTH
                </Typography>
                <Typography variant="body1">{formattedDoB}</Typography>
              </Grid>
              {/* Postal Code */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#aaa' }}>
                  POSTAL CODE
                </Typography>
                <Typography variant="body1">{user.postalCode}</Typography>
              </Grid>
              {/* Points Earned */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#aaa' }}>
                      POINTS EARNED
                    </Typography>
                    <Typography variant="body1">{user.pointsEarned}</Typography>
                  </Box>
                  <IconButton>
                    <MenuIcon sx={{ color: '#fff' }} />
                  </IconButton>
                </Box>
              </Grid>
              {/* Account Created */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#aaa' }}>
                  Account Created
                </Typography>
                <Typography variant="body1">{formattedCreatedAt}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3, borderColor: '#444' }} />
            {/* Action Buttons */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate(`/editprofile/${user.id}`)}
                sx={{ 
                  mr: 2,
                  backgroundColor: 'orange',
                  color: 'white',
                  '&:hover': { backgroundColor: 'darkorange' }
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfileInfo;
