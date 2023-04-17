import React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import NextLink from 'next/link';
import Router from 'next/router';
import { useFormik } from 'formik';
import RegisterSchema from '../utils/register-validation-schema';
import ErrorSnackbar from '../components/settings/settings-error-msg';
import TextFieldWrapper from '../components/settings/settings-textfield-wrapper';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Typography,
  Select
} from '@mui/material';


const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Manage password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const onSubmit = async (values) => {
    try {
      const { data } = await axios.post('/api/register', values);

      if (data.success) {
        Router
          .push('/').catch(console.error);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setErrorMessage(err.response.data.message);
      } else {
        console.error(err);
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      company: '',
      role: '',
      password: '',
      confirmPassword: '',
      policy: false
    },
    validationSchema: RegisterSchema,
    onSubmit
  });

  return (
    <>
      <Head>
        <title>
          Register | Beedata
        </title>
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
                Create a new account
              </Typography>
            </Box>
            <TextFieldWrapper formik={formik}
name="firstName"
label="First Name" />
            <TextFieldWrapper formik={formik}
name="lastName"
label="Last Name" />
            <TextFieldWrapper formik={formik}
name="company"
label="Company" />
            <FormControl fullWidth
sx={{ my: 2 }}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextFieldWrapper formik={formik}
name="email"
label="Email Address"
type="email" />
            <TextFieldWrapper formik={formik}
name="password"
label="Password"
type={showPassword ? "text" : "password"}
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
              )
            }}
            />
            <TextFieldWrapper formik={formik}
name="confirmPassword"
label="Confirm Password"
type={showConfirmPassword ? "text" : "password"}
inputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword  ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }} 
            />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                ml: -1
              }}
            >
              <Checkbox
                checked={formik.values.policy}
                name="policy"
                onChange={formik.handleChange}
                data-testid="policy-checkbox"
              />
              <Typography
                color="textSecondary"
                variant="body2"
              >
                I have read the
                {' '}
                <NextLink
                  href="#"
                  passHref
                >
                  <Link
                    color="primary"
                    underline="always"
                    variant="subtitle2"
                  >
                    Terms and Conditions
                  </Link>
                </NextLink>
              </Typography>
            </Box>
            {Boolean(formik.touched.policy && formik.errors.policy) && (
              <FormHelperText error>
                {formik.errors.policy}
              </FormHelperText>
            )}
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign Up Now
              </Button>
              { errorMessage && (
                <ErrorSnackbar errorMessage={errorMessage}/>
              )
              }
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Have an account?
              {' '}
              <NextLink
                href="/"
                passHref
              >
                <Link
                  variant="subtitle2"
                  underline="hover"
                >
                  Sign In
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
