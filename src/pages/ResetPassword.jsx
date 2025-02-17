import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(1); // 1: Request Code, 2: Verify Code, 3: Reset Password
  const [email, setEmail] = useState("");      // User's email address
  const [code, setCode] = useState("");          // Reset code entered by user
  const [newPassword, setNewPassword] = useState("");  // New password entered by user
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password

  // Stage 1: Request Reset Code
  const requestCode = () => {
    http.post('/user/request-password-reset', { email: email.trim().toLowerCase() })
      .then(res => {
        toast.success(res.data.message);
        setStage(2);
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Error requesting reset code.");
      });
  };

  // Stage 2: Verify Reset Code
  const verifyCode = () => {
    http.post('/user/verify-reset-code', { email: email.trim().toLowerCase(), code })
      .then(res => {
        toast.success(res.data.message);
        setStage(3);
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Error verifying reset code.");
      });
  };

  // Stage 3: Reset Password
  const resetPassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    http.post('/user/reset-password', { email: email.trim().toLowerCase(), newPassword })
      .then(res => {
        toast.success(res.data.message);
        navigate('/login');
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Error resetting password.");
      });
  };

  // Button style for orange buttons
  const orangeButtonStyle = {
    backgroundColor: 'orange',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkorange'
    },
    mt: 2
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      {stage === 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Request Password Reset
          </Typography>
          <TextField
            fullWidth
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" fullWidth onClick={requestCode} sx={orangeButtonStyle}>
            Send Reset Code to Email
          </Button>
        </Box>
      )}
      {stage === 2 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Verify Reset Code
          </Typography>
          <TextField
            fullWidth
            label="Reset Code"
            placeholder="Enter the reset code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" fullWidth onClick={verifyCode} sx={orangeButtonStyle}>
            Verify Code
          </Button>
          {/* Resend Code Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={requestCode}
            sx={{
              mt: 2,
              borderColor: 'orange',
              color: 'orange',
              '&:hover': { borderColor: 'darkorange', backgroundColor: 'rgba(255,165,0,0.1)' }
            }}
          >
            Resend Code
          </Button>
        </Box>
      )}
      {stage === 3 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Reset Password
          </Typography>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ my: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" fullWidth onClick={resetPassword} sx={orangeButtonStyle}>
            Save New Password
          </Button>
        </Box>
      )}
      <ToastContainer />
    </Box>
  );
}

export default ResetPassword;
