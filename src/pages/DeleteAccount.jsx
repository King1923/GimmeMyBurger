import React, { useState, useContext } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function DeleteAccount() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDeleteAccount = () => {
    http.delete(`/user/${user.id}`)
      .then((res) => {
        toast.success(res.data.message || "Account deleted successfully.");
        localStorage.clear();
        setUser(null);
        navigate('/'); // Redirect to home or login page after deletion
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error deleting account.");
      });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* LEFT SIDEBAR */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            ACCOUNT
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/editprofile/${user.id}`)}>
              Profile
            </Typography>
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/manage-addresses')}>
              Addresses
            </Typography>
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/change-password/${user.id}`)}>
              Reset Password
            </Typography>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer', fontWeight: 'bold' }} 
              onClick={() => navigate('/delete-account')}
            >
              Delete Account
            </Typography>
          </Box>
        </Grid>

        {/* MAIN CONTENT AREA */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Delete Account
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenDialog}
            sx={{ mt: 2 }}
          >
            Delete My Account
          </Button>

          <Dialog
            open={open}
            onClose={handleCloseDialog}
            aria-labelledby="delete-account-dialog-title"
          >
            <DialogTitle id="delete-account-dialog-title">
              Confirm Account Deletion
            </DialogTitle>
            <DialogContent>
              <Typography>
                This will permanently delete your account and all associated data. Are you sure you want to proceed?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleDeleteAccount} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
}

export default DeleteAccount;
