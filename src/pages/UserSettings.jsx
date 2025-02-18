import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField
} from '@mui/material';
import { toast } from 'react-toastify';
import http from '../http';

const UserSettings = () => {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');

  // On mount, fetch current 2FA settings (adjust the endpoint as needed)
  useEffect(() => {
    http.get('/User/2fa')
      .then((res) => {
        // Assume the response is in the format: { enabled: true/false, secret: 'XYZ' }
        setTwoFAEnabled(res.data.enabled);
        if (!res.data.enabled && res.data.secret) {
          // When not enabled, backend may provide a secret for registration.
          setSecret(res.data.secret);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch 2FA settings.");
        setLoading(false);
      });
  }, []);

  const handleToggle2FA = (event) => {
    const enabled = event.target.checked;
    if (enabled) {
      // Call the enable 2FA endpoint
      http.post('/User/enable2fa')
        .then((res) => {
          toast.success("2FA enabled. Please scan the QR code with your authenticator app.");
          setTwoFAEnabled(true);
          // Assume the response contains a secret or QR code data
          setSecret(res.data.secret);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to enable 2FA.");
        });
    } else {
      // Call the disable 2FA endpoint
      http.post('/User/disable2fa')
        .then(() => {
          toast.success("2FA disabled.");
          setTwoFAEnabled(false);
          setSecret('');
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to disable 2FA.");
        });
    }
  };

  const handleVerify2FA = () => {
    // Call the verify endpoint with the entered code
    http.post('/User/verify2fa', { code })
      .then(() => {
        toast.success("2FA verification successful.");
        // Optionally, update the UI if needed
      })
      .catch((err) => {
        console.error(err);
        toast.error("2FA verification failed.");
      });
  };

  if (loading) {
    return <Box sx={{ p: 4 }}>Loading settings...</Box>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={twoFAEnabled}
            onChange={handleToggle2FA}
            color="primary"
          />
        }
        label="Enable Two-Factor Authentication"
      />
      {twoFAEnabled && secret && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Scan this QR code with your authenticator app:
          </Typography>
          {/* 
            You could use a QR Code component/library here to generate a QR code from the secret.
            For this example, we’ll simply display the secret.
          */}
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {secret}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Enter 2FA Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              size="small"
            />
            <Button variant="contained" color="primary" onClick={handleVerify2FA}>
              Verify Code
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserSettings;
