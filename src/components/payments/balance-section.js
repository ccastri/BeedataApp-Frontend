import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { CreditForm } from './credit-dialog';
import { Wompi } from './wompi';

export const BalanceSection = ({ title }) => {
  const [balance, setBalance] = useState(0);
  const [isCreditFormOpen, setIsCreditFormOpen] = useState(false);

  const handleClick = () => {
    setIsCreditFormOpen(true);
  };

  const handleClose = () => {
    setIsCreditFormOpen(false);
    // reset the form
  };

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
        <CardActions>
          <Box sx={{ width: '100%' }}>
            <CreditForm />
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};
