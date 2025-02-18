import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  Button,
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = yup.object({
  FName: yup.string().trim()
    .min(3, 'Must be at least 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required'),
  LName: yup.string().trim()
    .min(3, 'Must be at least 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required'),
  Email: yup.string().email('Enter a valid email')
    .max(50, 'Maximum 50 characters')
    .required('Required'),
  Mobile: yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
    .length(8, 'Mobile number must be exactly 8 digits')
    .required('Required'),
  DeliveryAddress: yup.string().trim()
    .max(150, 'Maximum 150 characters')
    .required('Required'),
  DoB: yup.date().required('Required'),
  PostalCode: yup.number().required('Required'),
});

function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  // Fetch current user data on mount
  useEffect(() => {
    http.get(`/user/${id}`)
      .then(response => {
        const user = response.data;
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
      // Update immediately without confirmation prompt
      http.put(`/user/${id}`, values)
        .then(response => {
          toast.success("Profile updated successfully.");
          // Delay navigation slightly so the toast shows up
          setTimeout(() => {
            navigate(`/editprofile/${id}`);
          }, 2000);
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
    <Box sx={{ minHeight: '100vh', p: 4 }}>
      <Grid container spacing={4}>
        {/* LEFT SIDEBAR */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            ACCOUNT
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography sx={{ mb: 2, cursor: 'pointer' , fontWeight: 'bold' }} onClick={() => navigate(`/editprofile/${user.id}`)}>
              Profile
            </Typography>
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/manage-addresses')}>
              Settings
            </Typography>
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/manage-addresses')}>
              Addresses
            </Typography>
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/change-password/${id}`)}>
              Reset Password
            </Typography>
            <Typography sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/delete-account')}>
              Delete Account
            </Typography>
          </Box>
        </Grid>

        {/* MAIN CONTENT AREA */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            PROFILE
          </Typography>
          <Box sx={{ p: 3 }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                {/* Each field: label above input */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2">First Name</Typography>
                  <TextField
                    fullWidth
                    name="FName"
                    value={formik.values.FName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.FName && Boolean(formik.errors.FName)}
                    helperText={formik.touched.FName && formik.errors.FName}
                    sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Last Name</Typography>
                  <TextField
                    fullWidth
                    name="LName"
                    value={formik.values.LName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.LName && Boolean(formik.errors.LName)}
                    helperText={formik.touched.LName && formik.errors.LName}
                    sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Email</Typography>
                  <TextField
                    fullWidth
                    name="Email"
                    value={formik.values.Email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Email && Boolean(formik.errors.Email)}
                    helperText={formik.touched.Email && formik.errors.Email}
                    sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Mobile</Typography>
                  <TextField
                    fullWidth
                    name="Mobile"
                    value={formik.values.Mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Mobile && Boolean(formik.errors.Mobile)}
                    helperText={formik.touched.Mobile && formik.errors.Mobile}
                    sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Delivery Address</Typography>
                  <TextField
                    fullWidth
                    name="DeliveryAddress"
                    value={formik.values.DeliveryAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.DeliveryAddress && Boolean(formik.errors.DeliveryAddress)}
                    helperText={formik.touched.DeliveryAddress && formik.errors.DeliveryAddress}
                    sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Date of Birth</Typography>
                  <TextField
                    fullWidth
                    name="DoB"
                    type="date"
                    value={formik.values.DoB}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.DoB && Boolean(formik.errors.DoB)}
                    helperText={formik.touched.DoB && formik.errors.DoB}
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Postal Code</Typography>
                  <TextField
                    fullWidth
                    name="PostalCode"
                    type="number"
                    value={formik.values.PostalCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.PostalCode && Boolean(formik.errors.PostalCode)}
                    helperText={formik.touched.PostalCode && formik.errors.PostalCode}
                    sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 2,
                      backgroundColor: 'orange',
                      color: 'white',
                      '&:hover': { backgroundColor: 'darkorange' }
                    }}
                  >
                    Update your profile
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
}

export default EditProfile;
