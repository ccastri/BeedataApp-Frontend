import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField, 
  Typography
} from '@mui/material';
import SuccessSnackbar from '../settings/settings-success-msg';
import api from '../../lib/axios';

export const AccountProfileDetails = (props) => {
  const [responseMessage, setResponseMessage] = useState('');
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    billingEmail: '',
    billingAddress: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwt');
      const response = await api.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data) {
        const { name, last_name, email, phone, country, city, billing_email, billing_address } = response.data.user;
  
        setFormValues({
          firstName: name || '',
          lastName: last_name || '',
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
      const token = localStorage.getItem('jwt');
      const response = await axios.post('/api/update-user', formValues, {
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
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={formValues.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item
md={6}
xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={formValues.lastName}
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
                type="number"
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
            <Grid item
xs={12}>
              <Divider />
            </Grid>
            <Grid item
xs={12}>
              <Typography variant="h6"
gutterBottom>
                Billing Information
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
          </Grid>
        </CardContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSaveDetails}
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
              
