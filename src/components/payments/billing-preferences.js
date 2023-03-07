import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { axiosBase } from '../../lib/axios';

export const BillingPreferences = ({ title }) => {
  const [billingAddress, setBillingAddress] = useState('Calle 40 sur # 25 - 42');
  const [location, setLocation] = useState('Envigado, Antioquia, Colombia');
  const [email, setEmail] = useState('info@company.com');

  // useEffect(() => {
  //   const token = localStorage.getItem('jwt');

  //   const fetchBillingInfo = async () => {
  //     try {
  //       const response = await axiosBase.get('/api/billing-info', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         }
  //       });
  //       const { billingAddress, location, email } = response.data;
  //       setBillingAddress(billingAddress);
  //       setLocation(location);
  //       setEmail(email);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  
  //   fetchBillingInfo();
  // }, []);
  

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {title}
      </Typography>
      <Card sx={{ marginTop: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" component="h4" gutterBottom>
                Billing Address
              </Typography>
              <Typography variant="body1" gutterBottom>
                {billingAddress}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" component="h4" gutterBottom>
                Location
              </Typography>
              <Typography variant="body1" gutterBottom>
                {location}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" component="h4" gutterBottom>
                Billing Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
