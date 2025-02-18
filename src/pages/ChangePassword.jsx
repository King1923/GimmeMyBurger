import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, LinearProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import zxcvbn from 'zxcvbn';
import UserContext from '../contexts/UserContext';

const passwordStrengthText = [
  'Very Weak',
  'Weak',
  'Fair',
  'Strong',
  'Very Strong'
];

const validationSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().trim()
    .min(8, 'New password must be at least 8 characters')
    .max(50, 'New password must be at most 50 characters')
    .required('New password is required')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/,
             'New password must include at least one uppercase letter, one lowercase letter, one number, and one special character')
    .test(
      'password-strength',
      'New password is too weak. Please choose a stronger password.',
      value => {
        if (!value) return false;
        const { score } = zxcvbn(value);
        return score >= 3;
      }
    ),
  confirmPassword: yup.string().trim()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [passwordScore, setPasswordScore] = useState(0);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        currentPassword: values.currentPassword.trim(),
        newPassword: values.newPassword.trim(),
        confirmPassword: values.confirmPassword.trim()
      };
      http.post('/user/change-password', payload)
        .then((res) => {
          toast.success("Password changed successfully.");
          // Clear the form fields
          formik.resetForm();
          // After 2 seconds, navigate back to the same change password page
          setTimeout(() => {
            navigate(`/change-password/${user.id}`);
          }, 2000);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Error changing password.");
        });
    }
  });

  const handleNewPasswordChange = (e) => {
    formik.handleChange(e);
    const { value } = e.target;
    if (value) {
      const result = zxcvbn(value);
      setPasswordScore(result.score);
    } else {
      setPasswordScore(0);
    }
  };

  const progressPercentage = (passwordScore / 4) * 100;
  const getProgressColor = (score) => {
    if (score < 2) return 'error';
    if (score < 3) return 'warning';
    return 'success';
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
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/settings')}>
              Settings
            </Typography>
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/manage-addresses')}>
              Addresses
            </Typography>
            <Typography sx={{ mb: 2, cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate(`/change-password/${user.id}`)}>
              Reset Password
            </Typography>
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/delete-account')}>
              Delete Account
            </Typography>
          </Box>
        </Grid>

        {/* MAIN CONTENT AREA */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Change Password
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="dense"
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
              helperText={formik.touched.currentPassword && formik.errors.currentPassword}
            />
            <TextField
              fullWidth
              margin="dense"
              label="New Password"
              name="newPassword"
              type="password"
              value={formik.values.newPassword}
              onChange={handleNewPasswordChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
            />
            {formik.values.newPassword && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  color={getProgressColor(passwordScore)}
                />
                <Typography variant="caption">
                  {passwordStrengthText[passwordScore]}
                </Typography>
              </Box>
            )}
            <TextField
              fullWidth
              margin="dense"
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: 'orange', color: 'white', '&:hover': { backgroundColor: 'darkorange' } }}
            >
              Change Password
            </Button>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
}

export default ChangePassword;
