import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import api from '../../lib/axios';

export const BalanceSection = ({ title }) => {
  const [balance, setBalance] = useState(0);

  // Retrieve balance from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await api.get('/api/company', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.data && response.data.company) {
          setBalance(response.data.company.credit);          
        } else {
          console.error('Invalid response:', response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {title}
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Current Balance
          </Typography>
          <Typography variant="h4" component="div" sx={{ mb: 2 }}>
            USD$ {balance}
          </Typography>
        </CardContent>
        <Divider />
          <CardActions sx={{ mt: 1, mb: 1 }}>
            <Button 
              variant="contained"
              fullWidth
              color="primary"
              sx={{ 
                fontSize: 16, 
                fontWeight: 'bold',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
                ml: 2,
                mr: 2,
              }}
            >
              Add Credit
            </Button>
          </CardActions>
      </Card>
    </Box>
  );
};
