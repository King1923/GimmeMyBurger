import React, { useState } from 'react';
import { Box, Typography, TextField, Button, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import zxcvbn from 'zxcvbn';
import ClientNavbar from '../client/ClientNavBar';

const passwordStrengthText = [
  'Very Weak',
  'Weak',
  'Fair',
  'Strong',
  'Very Strong'
];

// Define the validation schema using Yup
const validationSchema = yup.object({
  fname: yup.string().trim()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must be at most 50 characters')
    .required('First name is required')
    .matches(/^[a-zA-Z '-,.]+$/, "Only letters, spaces, and characters: ' - , . allowed"),
  lname: yup.string().trim()
    .min(3, 'Last name must be at least 3 characters')
    .max(50, 'Last name must be at most 50 characters')
    .required('Last name is required')
    .matches(/^[a-zA-Z '-,.]+$/, "Only letters, spaces, and characters: ' - , . allowed"),
  email: yup.string().trim()
    .email('Enter a valid email')
    .max(50, 'Email must be at most 50 characters')
    .required('Email is required'),
  password: yup.string().trim()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be at most 50 characters')
    .required('Password is required')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, 'Password must include at least 1 letter and 1 number'),
  confirmPassword: yup.string().trim()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  mobile: yup.string().trim()
    .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
    .min(8, 'Mobile number must be at least 8 digits')
    .max(8, 'Mobile number must be at most 8 digits')
    .required('Mobile number is required'),
  deliveryAddress: yup.string().trim()
    .max(100, 'Delivery address must be at most 100 characters')
    .required('Delivery address is required'),
  postalCode: yup.string().trim()
    .length(6, 'Postal code must be exactly 6 characters')
    .matches(/^[0-9]+$/, 'Postal code must contain only digits')
    .required('Postal code is required'),
  dob: yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth must be in the past')
});

function Register() {
  const navigate = useNavigate();
  const [passwordScore, setPasswordScore] = useState(0);

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirmPassword: "",
      deliveryAddress: "",
      postalCode: "",
      mobile: "",
      dob: ""
    },
    validationSchema: validationSchema,
    onSubmit: (data) => {
      // Trim and format fields as needed
      data.fname = data.fname.trim();
      data.lname = data.lname.trim();
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      data.deliveryAddress = data.deliveryAddress.trim();
      data.postalCode = data.postalCode.trim();
      data.mobile = data.mobile.trim();
      data.dob = new Date(data.dob).toISOString();
      // No need to handle data.role since the default is set in the User class.

      // Send the request to the backend
      http.post("/user/register", data)
        .then((res) => {
          console.log(res.data);
          navigate("/login");
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`);
        });
    }
  });

  // Function to handle password changes and update the strength score.
  const handlePasswordChange = (e) => {
    formik.handleChange(e);
    const { value } = e.target;
    if (value) {
      const result = zxcvbn(value);
      setPasswordScore(result.score);
    } else {
      setPasswordScore(0);
    }
  };

  // Map the score (0 to 4) to a percentage for the progress bar.
  const progressPercentage = (passwordScore / 4) * 100;

  // Optionally, change the color based on the strength score.
  const getProgressColor = (score) => {
    if (score < 2) return 'error';
    if (score < 3) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ClientNavbar/>
      <Typography variant="h5" sx={{ my: 2 }}>Register</Typography>
      <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="First Name"
          name="fname"
          value={formik.values.fname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.fname && Boolean(formik.errors.fname)}
          helperText={formik.touched.fname && formik.errors.fname}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Last Name"
          name="lname"
          value={formik.values.lname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lname && Boolean(formik.errors.lname)}
          helperText={formik.touched.lname && formik.errors.lname}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Password"
          name="password" type="password"
          value={formik.values.password}
          onChange={handlePasswordChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        {/* Conditionally render the Password Strength Meter */}
        {formik.values.password && (
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
          fullWidth margin="dense" autoComplete="off"
          label="Confirm Password"
          name="confirmPassword" type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Mobile"
          name="mobile"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Delivery Address"
          name="deliveryAddress"
          value={formik.values.deliveryAddress}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.deliveryAddress && Boolean(formik.errors.deliveryAddress)}
          helperText={formik.touched.deliveryAddress && formik.errors.deliveryAddress}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Postal Code"
          name="postalCode"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
          helperText={formik.touched.postalCode && formik.errors.postalCode}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off" type="date"
          label="Date of Birth"
          name="dob"
          value={formik.values.dob}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.dob && Boolean(formik.errors.dob)}
          helperText={formik.touched.dob && formik.errors.dob}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Register;
