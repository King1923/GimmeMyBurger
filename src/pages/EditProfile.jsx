import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { toast } from 'react-toastify';
import ClientNavbar from '../client/ClientNavBar';

// Define validation schema using Yup (password field removed)
const validationSchema = yup.object({
  FName: yup.string().trim().min(3, 'Must be at least 3 characters').max(50, 'Maximum 50 characters').required('Required'),
  LName: yup.string().trim().min(3, 'Must be at least 3 characters').max(50, 'Maximum 50 characters').required('Required'),
  Email: yup.string().email('Enter a valid email').max(50, 'Maximum 50 characters').required('Required'),
  Mobile: yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
    .length(8, 'Mobile number must be exactly 8 digits')
    .required('Required'),
  DeliveryAddress: yup.string().trim().max(150, 'Maximum 150 characters').required('Required'),
  DoB: yup.date().required('Required'),
  PostalCode: yup.number().required('Required'),
});

function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  // Fetch the current user data
  useEffect(() => {
    http.get(`/user/${id}`)
      .then(response => {
        const user = response.data;
        // Pre-populate form fields; for date input, format as YYYY-MM-DD
        setInitialValues({
          FName: user.fName,
          LName: user.lName,
          Email: user.email,
          Mobile: user.mobile,
          DeliveryAddress: user.deliveryAddress,
          DoB: new Date(user.doB).toISOString().split('T')[0],
          PostalCode: user.postalCode,
        });
        setLoading(false);
      })
      .catch(error => {
        toast.error("Failed to fetch user info");
        setLoading(false);
      });
  }, [id]);

  // Initialize Formik when initialValues are available
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      FName: '',
      LName: '',
      Email: '',
      Mobile: '',
      DeliveryAddress: '',
      DoB: '',
      PostalCode: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Prompt user for confirmation before updating
      const confirmSave = window.confirm("Are you sure you want to save changes?");
      if (!confirmSave) {
        return; // Do not proceed if the user cancels
      }
      
      http.put(`/user/${id}`, values)
        .then(response => {
          toast.success("Profile updated successfully.");
          navigate(`/profile/${id}`);
        })
        .catch(error => {
          toast.error("Failed to update profile.");
        });
    }
  });

  if (loading || !initialValues) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2,  mx: 'auto', mt: 4 }}>
      <ClientNavbar/>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="FName"
                value={formik.values.FName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.FName && Boolean(formik.errors.FName)}
                helperText={formik.touched.FName && formik.errors.FName}
              />
            </Grid>
            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="LName"
                value={formik.values.LName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.LName && Boolean(formik.errors.LName)}
                helperText={formik.touched.LName && formik.errors.LName}
              />
            </Grid>
            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="Email"
                value={formik.values.Email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Email && Boolean(formik.errors.Email)}
                helperText={formik.touched.Email && formik.errors.Email}
              />
            </Grid>
            {/* Mobile */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile"
                name="Mobile"
                value={formik.values.Mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Mobile && Boolean(formik.errors.Mobile)}
                helperText={formik.touched.Mobile && formik.errors.Mobile}
              />
            </Grid>
            {/* Delivery Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Address"
                name="DeliveryAddress"
                value={formik.values.DeliveryAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.DeliveryAddress && Boolean(formik.errors.DeliveryAddress)}
                helperText={formik.touched.DeliveryAddress && formik.errors.DeliveryAddress}
              />
            </Grid>
            {/* Date of Birth */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="DoB"
                type="date"
                value={formik.values.DoB}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.DoB && Boolean(formik.errors.DoB)}
                helperText={formik.touched.DoB && formik.errors.DoB}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {/* Postal Code */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="PostalCode"
                type="number"
                value={formik.values.PostalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.PostalCode && Boolean(formik.errors.PostalCode)}
                helperText={formik.touched.PostalCode && formik.errors.PostalCode}
              />
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default EditProfile;
