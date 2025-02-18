import React, { useContext } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: yup.object({
      email: yup.string().trim()
        .email('Enter a valid email')
        .max(50, 'Email must be at most 50 characters')
        .required('Email is required'),
      password: yup.string().trim()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be at most 50 characters')
        .required('Password is required')
    }),
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      http.post("/user/login", data)
        .then((res) => {
          // Store authentication info and user details
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("userId", res.data.user.id);
          // Optionally store the role if needed later
          localStorage.setItem("role", res.data.user.role);
          setUser(res.data.user);

          // Check role: 1 means Staff, 0 means Customer.
          if (res.data.user.role === 1) {
            navigate("/addreward");
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`);
        });
    }
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: "100vh",
      backgroundColor: 'white',
      color: 'black',
      p: 2
    }}>
      <Typography variant="h5" sx={{ my: 3 }}>
        Welcome to GMB 
      </Typography>
      <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
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
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        />
        <TextField
          fullWidth 
          margin="dense" 
          autoComplete="off"
          label="Password"
          name="password" 
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        />
        <Button 
          fullWidth 
          variant="contained" 
          type="submit"
          sx={{
            mt: 2,
            backgroundColor: 'orange',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkorange'
            }
          }}
        >
          Login
        </Button>
      </Box>
      
      {/* Sign Up & Forgot Password Section */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2">
          No account yet?{" "}
          <span 
            onClick={() => navigate("/register")}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Sign up here
          </span>
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography 
            variant="body2" 
            onClick={() => navigate("/reset-password")}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Forgot Password?
          </Typography>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Login;
