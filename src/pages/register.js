import React, { useEffect } from 'react';
import Head from 'next/head';
import { useState } from 'react';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import { createValidationSchema } from '../components/register/register-validation-schema';
import ErrorSnackbar from '../components/general/error-msg';
import TextFieldWrapper from '../components/general/textfield-wrapper';
import CircularProgress from '@mui/material/CircularProgress';
import PhoneField from '../components/register/phone-field';
import { ResponsiveDialog } from '../components/register/confirmation-dialog';
import { CredentialDialog } from '../components/register/credentials-dialog';
import api from '../lib/axios';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openCredentials, setOpenCredentials] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [shop, setShop] = useState(null);

  const idTypes = [
    { value: 'CC', label: 'Cédula de ciudadanía' },
    { value: 'CE', label: 'Cédula de extranjería' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'TI', label: 'Tarjeta de identidad' },
    { value: 'NIT', label: 'Número de identificación tributaria (NIT)' },
  ];

  const roleTypes = [
    { value: 'admin', label: 'Admin' },
    { value: 'partner', label: 'Partner' },
  ]
  const router = useRouter(); 
  useEffect(() => {
    const params = new URLSearchParams(location.search); // Use window.location.search to get the URL parameters
    const encodedData = params.get('data');
  
    if (encodedData) {
      // Step 1: Decode the Base64 data
      const decodedData = atob(encodedData);
  
      // Step 2: Parse the decoded data as JSON
      const dataObject = JSON.parse(decodedData);
  
      // Step 3: Extract the required fields
      const { accessToken, appBridge } = dataObject;
      console.log(accessToken)
      console.log(appBridge)
      // Step 4: Store the extracted fields in session storage
      if (accessToken) {
        sessionStorage.setItem('accessToken', accessToken);
        setAccessToken(accessToken); // Assuming setAccessToken is a state setter for accessToken
      }
  
      if (appBridge) {
        sessionStorage.setItem('app-bridge-config', appBridge);
      }
  
      // Optionally log the parameters for debugging
      for (let [key, value] of params.entries()) {
        console.log(`${key}: ${value}`);
      }
    }
  }, [router.query]); // Depend on location.search to update if the URL changes
  
  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const { data } = await api.post('/api/v1/users/register', {values});

      if (data.success) {
        const companyId = data.user.company_id;
        const productId = 50;

        const productCheck = await api.get(`/api/v1/${companyId}/products/${productId}`, {
          params: {
            productQty: 10,
            isRegistration: true
          }
        });
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get('data');
  
        if (encodedData) {
          // Decode the Base64 data
          const decodedData = atob(encodedData);
          const dataObject = JSON.parse(decodedData);
  
          const { accessToken, appBridge } = dataObject;
          if (accessToken) {
            sessionStorage.setItem('accessToken', accessToken);
            setAccessToken(accessToken); // Assuming setAccessToken is a state setter for accessToken
          }
  
          if (appBridge) {
            sessionStorage.setItem('app-bridge-config', appBridge);
          }
        }
        if (productCheck.data.message === 'Product exists') {
          setCredentials(data.user);
          setOpenCredentials(true);
        } else {
          await api.post(`/api/v1/${companyId}/products/${productId}`, { productQty: 10, isRegistration: true});
          setCredentials(data.user);
          setOpenCredentials(true);
        }
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
    validationSchema: createValidationSchema(['fullName', 'company', 'identificationType', 'identificationNumber', 'phoneNumber', 'email', 'role', 'policy']),
    onSubmit,
    handleSubmit
  });

  return (
    <>
      <Head>
        <title>
          Register | Beet
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100vh',
          width: '100%',
          pr: { xs: 4, sm: 6 },
          pl: { xs: 4, sm: 6 },
        }}
      >
        <Container 
        maxWidth="sm"
        sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              marginBottom: { xs: '32px', sm: '48px' },
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
  label="Role"
  selectOptions={roleTypes} />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  ml: -1
                }}
              >
                <Checkbox
                  checked={formik.values.policy}
                  name="policy"
                  onChange={formik.handleChange}
                  data-testid="policy-checkbox"
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }}
                />
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ fontSize: 15 }}
                >
                  I have read the
                  {' '}
                  <NextLink
                    href="https://admin.beet.digital/legal"
                    passHref
                  >
                    <Link
                      color="primary"
                      underline="always"
                      variant="subtitle2"
                      target="_blank"
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
