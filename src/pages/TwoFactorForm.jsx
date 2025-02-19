import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import http from '../http';
import { useNavigate } from 'react-router-dom';

const TwoFactorForm = ({ tempToken, email }) => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await http.post('/user/verify-2fa', { Email: email, Code: code });
      // Store final access token and optionally user data
      localStorage.setItem("accessToken", res.data.AccessToken);
      toast.success("2FA verified successfully!");
      navigate("/"); // Redirect to the protected route or home page
    } catch (err) {
      toast.error(err.response.data.message || "2FA verification failed");
    }
  };

  return (
    <Box sx={{ maxWidth: '400px', mt: 3, mx: 'auto' }} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Enter your 2FA code sent to your email
      </Typography>
      <TextField
        label="2FA Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        margin="dense"
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Verify
      </Button>
    </Box>
  );
};

export default TwoFactorForm;
