import React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import api from '../lib/axios';
import NextLink from 'next/link';
import Router from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ErrorSnackbar from '../components/settings/settings-error-msg';
import TextFieldWrapper from '../components/general/textfield-wrapper';
import { BeeCard } from '../components/login/side-card';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';


const Login = () => {

  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Manage password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const onSubmit = async (values) => {
    try {

      const { data } = await api.post("/api/login", values);
      
      if (data.success) {
        const token = data.token;
        
        // Set the JWT in local storage
        localStorage.setItem('jwt', token);

        if (typeof Router !== 'undefined') {
          Router.push("/dashboard").catch(console.error);
        }
      }
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message);
      } else {
        console.error(err);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit
  });

  return (
    <>
      <Head>
        <title>Login | Beedata</title>
      </Head>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: {xs: 'column', sm: 'row'},
          flexGrow: 1,
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: {xs: '100%', sm: '50%'},
            pr: {xs: 2, sm: 4},
            pl: {xs: 2, sm: 4},
          }}
        >
          <form onSubmit={formik.handleSubmit}
sx={{ width: '100%' }}>
            <Box sx={{ my: 3, width: '100%' }}>
              <Typography color="textPrimary"
variant="h4">
                Sign in
              </Typography>
            </Box>
            <TextFieldWrapper
              formik={formik}
              name="email"
              label="Email"
              type="email"
              sx={{ width: '100%' }}
            />
            <TextFieldWrapper
              formik={formik}
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              inputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: '100%' }}
            />
            <Box my={3}
sx={{ width: '100%' }}>
              <NextLink href="/forgot-password">
                <Link
                  color="textSecondary"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer',
                    textAlign: 'right',
                    width: '100%',
                  }}
                >
                  Forgot password?
                </Link>
              </NextLink>
            </Box>
            <Box sx={{ py: 2, width: '100%' }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In Now
              </Button>
              {errorMessage && (
                <ErrorSnackbar errorMessage={errorMessage} />
              )}
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
              sx={{ width: '100%', textAlign: 'center', mt: 2 }}
            >
              Don&apos;t have an account?
              {' '}
              <NextLink href="/register">
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer',
                    ml: 1,
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '50%',
            background: 'linear-gradient(to bottom, #2D3748, #1E272C)',
            border: '1px solid #1E272C',
          }}
          >
          <BeeCard />
        </Box>
      </Box>
    </>
  );  
};

export default Login;
