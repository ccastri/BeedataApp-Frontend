import React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import RegisterSchema from '../components/register/register-validation-schema';
import ErrorSnackbar from '../components/settings/settings-error-msg';
import TextFieldWrapper from '../components/general/textfield-wrapper';
import CircularProgress from '@mui/material/CircularProgress';
import PhoneField from '../components/register/phone-field';
import { ResponsiveDialog } from '../components/register/confirmation-dialog';
import { CredentialDialog } from '../components/register/credentials-dialog';
import api from '../lib/axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';


const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openCredentials, setOpenCredentials] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const idTypes = [
    { value: 'CC', label: 'Cédula de ciudadanía' },
    { value: 'CE', label: 'Cédula de extranjería' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'TI', label: 'Tarjeta de identidad' },
    { value: 'NIT', label: 'Número de identificación tributaria (NIT)' },
  ];

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const { data } = await api.post('/api/register', values);

      // If data success, display credentials and purchase free product
      if (data.success) {

        const registrationProduct = {
          productId: 285,
          companyId: data.user.company_id
        };
        await api.post('/api/purchase-product', registrationProduct);
        setCredentials(data.user);
        setOpenCredentials(true);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);

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
        <Container 
        maxWidth="sm"
        sx={{ position: "relative", zIndex: 1 }}
        >
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
          >       
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
            <CircularProgress
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                visibility: loading ? 'visible' : 'hidden'
              }}
            />
          </Box>
          {openCredentials && credentials && (
          <CredentialDialog
            user={credentials}
            openCredentials={true}
            onClose={() => {
              setOpenCredentials(false);
            }}
          />
        )}
        </Container>
      </Box>
    </>
  );
};

export default Register;
