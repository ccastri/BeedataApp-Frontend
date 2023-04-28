import React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import NextLink from 'next/link';
import Router from 'next/router';
import { useFormik } from 'formik';
import RegisterSchema from '../utils/register-validation-schema';
import ErrorSnackbar from '../components/settings/settings-error-msg';
import TextFieldWrapper from '../components/general/textfield-wrapper';
import PhoneField from '../components/general/phone-field';
import { ResponsiveDialog } from '../components/register/confirmation-dialog';
import api from '../lib/axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  Typography
} from '@mui/material';


const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const idTypes = [
    { value: 'CC', label: 'Cédula de ciudadanía' },
    { value: 'CE', label: 'Cédula de extranjería' },
    { value: 'TI', label: 'Tarjeta de identidad' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'NIT', label: 'Número de identificación tributaria (NIT)' },
  ];

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/api/register', values);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formik.isValid) {
      onSubmit(formik.values);
    }
  }

  const formik = useFormik({
    initialValues: {
      fullName: '',
      company: '',
      identificationType: '',
      identificationNumber: '',
      phoneNumber: '',
      email: '',
      role: '',
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
name="fullName"
label="Full Name" />
            <TextFieldWrapper formik={formik}
name="company"
label="Company" />
            <TextFieldWrapper formik={formik}
name="identificationType"
label="Identification Type"
selectOptions={idTypes} />
            <TextFieldWrapper formik={formik}
name="identificationNumber"
label="Identification Number" />
            <PhoneField formik={formik}
name="phoneNumber"
label="Phone Number"
/>
            <TextFieldWrapper formik={formik}
name="email"
label="Email Address"
type="email" />
            <TextFieldWrapper formik={formik}
name="role"
label="Role" />
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
              {formik.isValid && (
                <ResponsiveDialog 
                  formikValues={formik.values}
                  onSubmit={formik.handleSubmit}
                />
              )}
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
