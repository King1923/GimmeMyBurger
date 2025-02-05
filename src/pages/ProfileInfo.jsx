import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { toast } from 'react-toastify';
import defaultProfile from '../assets/profile.webp';
import ClientNavbar from '../client/ClientNavbar';



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
      <Typography variant="h6" align="center" sx={{ mt: 8 }}>
        User not found.
      </Typography>
    );
  }

  // Format dates for display:
  // Date of Birth in local date format.
  const formattedDoB = new Date(user.doB).toLocaleDateString();
  // Account Created formatted as YYYY-MM-DD (without time).
  const formattedCreatedAt = new Date(user.createdAt).toISOString().split('T')[0];

  return (
    <Box sx={{ p: 2,mx: 'auto', mt: 4 }}>
      <ClientNavbar/>
      <Card elevation={3}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ width: 56, height: 56 }}
              src={defaultProfile}
            />
          }
          title={
            <Typography variant="h5" component="div">
              {user.fName} {user.lName}
            </Typography>
          }
          subheader={user.email}
          sx={{ backgroundColor: 'orange' }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Mobile
              </Typography>
              <Typography variant="body1">{user.mobile}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Delivery Address
              </Typography>
              <Typography variant="body1">{user.deliveryAddress}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">{formattedDoB}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Postal Code
              </Typography>
              <Typography variant="body1">{user.postalCode}</Typography>
            </Grid>
            {/* Points Earned with Burger Icon */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Points Earned
                  </Typography>
                  <Typography variant="body1">{user.pointsEarned}</Typography>
                </Box>
                <IconButton>
                  <MenuIcon />
                </IconButton>
              </Box>
            </Grid>
            {/* Account Created without time */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Account Created
              </Typography>
              <Typography variant="body1">{formattedCreatedAt}</Typography>
            </Grid>
          </Grid>
          {/* Action Buttons */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/editprofile/${user.id}`)}
              sx={{ mr: 2 }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(`/reset-password/${user.id}`)}
            >
              Reset Password
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProfileInfo;
