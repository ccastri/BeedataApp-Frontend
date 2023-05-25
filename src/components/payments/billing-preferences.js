import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../lib/axios';


export const BillingPreferences = ({ title }) => {
  const [billingAddress, setBillingAddress] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    const fetchBillingInfo = async () => {
      try {
        const userResponse = await api.get('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const companyResponse = await api.get('/api/company', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { city, country } = userResponse.data.user;
        const { billing_address, billing_email } = companyResponse.data.company;

        setBillingAddress(billing_address);
        setLocation(`${city}, ${country}`);
        setEmail(billing_email);

      } catch (error) {
        console.log(error);
      }
    };

    fetchBillingInfo();
  }, []);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4"
component="h2"
gutterBottom>
        {title}
      </Typography>
      <Card sx={{ marginTop: 2 }}>
        <CardContent>
          <Grid container
spacing={2}>
            <Grid item
xs={12}
sm={6}>
              <Typography variant="subtitle1"
component="h4"
gutterBottom>
                Billing Address
              </Typography>
              <Typography variant="body1"
gutterBottom>
                {billingAddress}
              </Typography>
            </Grid>
            <Grid item
xs={12}
sm={6}>
              <Typography variant="subtitle1"
component="h4"
gutterBottom>
                Location
              </Typography>
              <Typography variant="body1"
gutterBottom>
                {location}
              </Typography>
            </Grid>
            <Grid item
xs={12}
sm={6}>
              <Typography variant="subtitle1"
component="h4"
gutterBottom>
                Billing Email
              </Typography>
              <Typography variant="body1"
gutterBottom>
                {email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
