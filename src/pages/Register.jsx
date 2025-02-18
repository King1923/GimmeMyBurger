import React, { useState } from 'react';
import { Box, Typography, TextField, Button, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import zxcvbn from 'zxcvbn';

const passwordStrengthText = [
  'Very Weak',
  'Weak',
  'Fair',
  'Strong',
  'Very Strong'
];

const validationSchema = yup.object({
  fname: yup.string().trim()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must be at most 50 characters')
    .required('First name is required')
    .matches(/^[A-Za-z]+$/, "Only letters are allowed in first name"),
  lname: yup.string().trim()
    .min(3, 'Last name must be at least 3 characters')
    .max(50, 'Last name must be at most 50 characters')
    .required('Last name is required')
    .matches(/^[A-Za-z]+$/, "Only letters are allowed in last name"),
  email: yup.string().trim()
    .email('Enter a valid email')
    .max(50, 'Email must be at most 50 characters')
    .required('Email is required'),
  password: yup.string().trim()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be at most 50 characters')
    .required('Password is required')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/,
             'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character')
    .test(
      'password-strength',
      'Password is too weak. Please choose a stronger password.',
      value => {
        if (!value) return false;
        const { score } = zxcvbn(value);
        return score >= 3;
      }
    ),
  confirmPassword: yup.string().trim()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  mobile: yup.string().trim()
    .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
    .length(8, 'Mobile number must be exactly 8 digits')
    .required('Mobile number is required'),
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
      data.mobile = data.mobile.trim();
      data.dob = new Date(data.dob).toISOString();
      
      // Send the request to the backend
      http.post("/user/register", data)
        .then((res) => {
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

  const progressPercentage = (passwordScore / 4) * 100;

  const getProgressColor = (score) => {
    if (score < 2) return 'error';
    if (score < 3) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ marginTop: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ my: 2 }}>Register</Typography>
      <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="First Name"
          name="fname"
          value={formik.values.fname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.fname && Boolean(formik.errors.fname)}
          helperText={formik.touched.fname && formik.errors.fname}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Last Name"
          name="lname"
          value={formik.values.lname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lname && Boolean(formik.errors.lname)}
          helperText={formik.touched.lname && formik.errors.lname}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={handlePasswordChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
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
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Mobile"
          name="mobile"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          type="date"
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
          Register
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Register;
