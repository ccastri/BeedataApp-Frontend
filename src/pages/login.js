import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { axiosBase } from '../lib/axios'
import NextLink from 'next/link';
import Router from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ErrorSnackbar from '../components/settings/settings-error-msg';
import TextFieldWrapper from '../components/settings/settings-textfield-wrapper';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {

  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Manage password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Manage Google login

  // const handleGoogleClick = () => {
  //   formik.setValues({...formik.values, registeredWith: "google"});
  //   signIn('google', { callbackUrl: '/dashboard' });
  // }

  // Email login submit
  const onSubmit = async (values) => {
    try {

      const { data } = await axiosBase.post("/api/login", values);
      
      if (data.success) {
        const token = data.token;
        
        // Set the JWT in local storage
        localStorage.setItem('jwt', token);

        Router
          .push("/dashboard").catch(console.error);
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
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Back
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Sign in
              </Typography>
            </Box>
            {/* <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button
                  color="error"
                  fullWidth
                  onClick={handleGoogleClick}
                  size="large"
                  startIcon={<GoogleIcon />}
                  variant="contained"
                >
                  Login with Google
                </Button>
              </Grid>
            </Grid> */}
            {/* <Box
              sx={{
                pb: 1,
                pt: 3
              }}
            >
              <Typography
                align="center"
                color="textSecondary"
                variant="body1"
              >
                or login with email address
              </Typography>
            </Box> */}
            <TextFieldWrapper formik={formik} name="email" label="Email Address" type="email" />
            <TextFieldWrapper formik={formik} name="password" label="Password" type={showPassword ? "text" : "password"} inputProps={{
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
              )
            }} 
            />
            <Box my={3}>
              <NextLink href="/forgot-password">
                <Link
                  color="textSecondary"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Forgot password?
                </Link>
              </NextLink>
            </Box>
            <Box sx={{ py: 2 }}>
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
            >
              Don&apos;t have an account?
              {' '}
              <NextLink
                href="/register"
              >
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
