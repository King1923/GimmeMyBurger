import React, { useContext, useState, useRef } from 'react';
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
  const [requires2FA, setRequires2FA] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  // Use an array of 6 digits instead of a single text field.
  const [codeDigits, setCodeDigits] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

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
      // Save the email so we can use it during 2FA verification.
      setUserEmail(data.email);
      http.post("/user/login", data)
        .then((res) => {
          // The server sends a success message indicating that a 2FA code has been emailed.
          toast.success(res.data.message);
          setRequires2FA(true);
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`);
        });
    }
  });

  // Handler for updating each digit in the code.
  const handleDigitChange = (e, index) => {
    const value = e.target.value;
    // Allow only a single digit.
    if (/^[0-9]?$/.test(value)) {
      const newDigits = [...codeDigits];
      newDigits[index] = value;
      setCodeDigits(newDigits);
      // Auto-focus next field if a digit was entered.
      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handler for submitting the 2FA code.
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    const code = codeDigits.join('');
    if (code.length < 6) {
      toast.error("Please enter a 6-digit code.");
      return;
    }
    try {
      const res = await http.post('/user/verify-2fa', {
        Email: userEmail,
        Code: code
      });
      // Check response structure—adjust property names as needed.
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("userId", res.data.user.id);
      toast.success("2FA verified successfully!");
      setUser(res.data.user);
      // Navigate based on role: 1 means Staff (admin), 0 means Customer.
      if (res.data.user.role === 1) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "2FA verification failed");
    }
  };

  // Handler for resending a new 2FA code.
  const handleResendCode = async () => {
    try {
      const res = await http.post('/user/resend-2fa', { Email: userEmail });
      toast.success(res.data.message || "A new 2FA code has been sent to your email");
      // Clear the input boxes and focus the first field.
      setCodeDigits(Array(6).fill(''));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend 2FA code");
    }
  };

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

      {requires2FA ? (
        // Render the inline 2FA form if required.
        <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={handle2FASubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Enter the 2FA code sent to your email
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            {codeDigits.map((digit, index) => (
              <TextField
                key={index}
                value={digit}
                onChange={(e) => handleDigitChange(e, index)}
                inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '24px' } }}
                sx={{ width: 50, backgroundColor: '#fff', borderRadius: 1 }}
                inputRef={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </Box>
          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
            sx={{
              mt: 2,
              backgroundColor: 'orange',
              color: 'white',
              '&:hover': { backgroundColor: 'darkorange' }
            }}
          >
            Verify
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleResendCode}
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
      ) : (
        // Render the login form if 2FA is not yet required.
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
              '&:hover': { backgroundColor: 'darkorange' }
            }}
          >
            Login
          </Button>
        </Box>
      )}
      
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
