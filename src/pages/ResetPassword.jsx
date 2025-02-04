import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { toast } from 'react-toastify';
import ClientNavbar from '../client/ClientNavBar';

function ResetPassword() {
  const { id } = useParams(); // User ID from URL
  const navigate = useNavigate();
  const [stage, setStage] = useState(1); // 1: Request Code, 2: Verify Code, 3: Reset Password
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Stage 1: Request Reset Code
  const requestCode = () => {
    http.post('/user/request-password-reset', id)
      .then(res => {
        toast.success(res.data.message);
        setStage(2);
      })
      .catch(err => {
        toast.error(err.response.data.message);
      });
  };

  // Stage 2: Verify Reset Code
  const verifyCode = () => {
    http.post('/user/verify-reset-code', { userId: id, code })
      .then(res => {
        toast.success(res.data.message);
        setStage(3);
      })
      .catch(err => {
        toast.error(err.response.data.message);
      });
  };

  // Stage 3: Reset Password
  const resetPassword = () => {
    http.post('/user/reset-password', { userId: id, newPassword })
      .then(res => {
        toast.success(res.data.message);
        navigate(`/profile/${id}`);
      })
      .catch(err => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <ClientNavbar/>
      {stage === 1 && (
        <>
          <Typography variant="h5" gutterBottom>
            Request Password Reset
          </Typography>
          <Button variant="contained" fullWidth onClick={requestCode}>
            Send Reset Code to Email
          </Button>
        </>
      )}
      {stage === 2 && (
        <>
          <Typography variant="h5" gutterBottom>
            Verify Reset Code
          </Typography>
          <TextField
            fullWidth
            label="Reset Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" fullWidth onClick={verifyCode}>
            Verify Code
          </Button>
        </>
      )}
      {stage === 3 && (
        <>
          <Typography variant="h5" gutterBottom>
            Reset Password
          </Typography>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" fullWidth onClick={resetPassword}>
            Save New Password
          </Button>
        </>
      )}
    </Box>
  );
}

export default ResetPassword;
