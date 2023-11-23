import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import SuccessSnackbar from '../settings/settings-success-msg';
import api from '../../lib/axios';

export const AccountProfileDetails = (props) => {
  const [responseMessage, setResponseMessage] = useState('');
  const [formValues, setFormValues] = useState({
    fullName: '',
    identificationType: '',
    identificationNumber: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    billingEmail: '',
    billingAddress: ''
  });
  const { companyId } = useContext(CompanyContext);

  const idTypes = [
    { value: 'CC', label: 'Cédula de ciudadanía' },
    { value: 'CE', label: 'Cédula de extranjería' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'TI', label: 'Tarjeta de identidad' },
    { value: 'NIT', label: 'Número de identificación tributaria (NIT)' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('jwt');
      const userResponse = await api.get('/api/v1/users/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const companyResponse = await api.get(`/api/v1/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (userResponse.data && companyResponse.data) {
        const { name, identification_type, identification_number, role, email, phone, country, city } = userResponse.data.user;
        const { billing_email, billing_address } = companyResponse.data.company;

        setFormValues({
          fullName: name || '',
          identificationType: identification_type.toUpperCase() || '',
          identificationNumber: identification_number || '',
          role: role || '',
          email: email || '',
          phone: phone || '',
          country: country || '',
          city: city || '',
          billingEmail: billing_email || '',
          billingAddress: billing_address || ''
        });
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value
    });
  };

  const handleSaveDetails = async () => {
    try {
      const token = Cookies.get('jwt')

      const billingFields = {
        billingEmail: formValues.billingEmail,
        billingAddress: formValues.billingAddress,
      };

      await api.put(`/api/v1/companies/${companyId}`, billingFields, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // update remaining fields via /api/update-user
      const remainingFields = {
        fullName: formValues.fullName,
        identificationType: formValues.identificationType,
        identificationNumber: formValues.identificationNumber,
        email: formValues.email,
        phone: formValues.phone,
        country: formValues.country,
        city: formValues.city
      };

      const response = await api.post('/api/v1/users/update-user', remainingFields, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setResponseMessage(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid container
            spacing={3}>
            <Grid item
              xs={12}>
              <Typography variant="h6"
                gutterBottom>
                User Information
              </Typography>
            </Grid>
            <Grid item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                helperText="Please specify yur full name"
                label="Full name"
                name="fullName"
                onChange={handleChange}
                required
                value={formValues.fullName}
                variant="outlined"
              />
            </Grid>
            <Grid item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                label="Identification Type"
                name="identificationType"
                onChange={handleChange}
                required
                value={formValues.identificationType}
                variant="outlined"
                select={true}
                SelectProps={
                  {
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
                      },
                    }
                  }
                }
              >
                {idTypes.map(option => (
                  <MenuItem key={option.value}
value={option.value}>
                    {option.label}
                  </MenuItem>
                )) }
              </TextField>
            </Grid>
            <Grid item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                label="Identification Number"
                name="identificationNumber"
                onChange={handleChange}
                required
                value={formValues.identificationNumber}
                variant="outlined"
              />
            </Grid>
            <Grid item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={formValues.email}
                variant="outlined"
              />
            </Grid>
            <Grid item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                value={formValues.phone}
                variant="outlined"
              />
            </Grid>
            <Grid item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                onChange={handleChange}
                required
                value={formValues.country}
                variant="outlined"
              />
            </Grid>
            <Grid item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                label="City"
                name="city"
                onChange={handleChange}
                required
                value={formValues.city}
                variant="outlined"
              />
            </Grid>
            {formValues.role === 'admin' && (
              <>
                <Grid item
                  xs={12}>
                  <Divider />
                </Grid>
                <Grid item
                  xs={12}>
                  <Typography variant="h6"
                    gutterBottom>
                    Company Information
                  </Typography>
                </Grid>
                <Grid item
                  md={6}
                  xs={12}>
                  <TextField
                    fullWidth
                    label="Billing Email"
                    name="billingEmail"
                    onChange={handleChange}
                    required
                    value={formValues.billingEmail}
                    variant="outlined"
                  />
                </Grid>
                <Grid item
                  md={6}
                  xs={12}>
                  <TextField
                    fullWidth
                    label="Billing Address"
                    name="billingAddress"
                    onChange={handleChange}
                    required
                    value={formValues.billingAddress}
                    variant="outlined"
                  />
                </Grid>
              </>
            )
            }
          </Grid>
        </CardContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSaveDetails}
            sx={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
          >
            Save details
          </Button>
          {responseMessage && (
            <SuccessSnackbar responseMessage={responseMessage} />
          )}
        </Box>
      </Card>
    </form>
  );
};

