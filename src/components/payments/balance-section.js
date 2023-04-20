import React from 'react';
import { 
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Popover,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../lib/axios';


export const BalanceSection = ({title}) => {

    const [balance, setBalance] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    // const handleAddMoney = () => {
    //     // Redirect to page for adding money to balance
    // };

    // Temporary code until handle money is ready
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
      const token = localStorage.getItem('jwt');

      const fetchBalance = async () => {
      try {
        const response = await api.get('/api/current-balance', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const currentBalance = response.data.currentBalance;
      setBalance(currentBalance);

    } catch (error) {
        console.log(error);
      }
    };
  
    fetchBalance();
    }, []);

    return (
        <Box sx={{ mb: 3 }}>
        <Typography variant="h4"
component="h2"
gutterBottom>
          {title}
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h5"
component="h2"
gutterBottom>
              Current Balance
            </Typography>
            <Typography variant="h4"
component="div"
sx={{ mb: 2 }}>
              USD$ {balance}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions>
            <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                fullWidth
                variant="text"
                onClick={handleClick}
                style={{ fontSize: '1rem' }}
              >
                Add Credit
              </Button>
              <Box sx={{ position: 'relative' }}>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      p: 2,
                      bgcolor: 'rgba(234, 84, 85, 0.8)',
                    }
                  }}
                >
                  <Typography> This function is currently unavailable </Typography>
                </Popover>
              </Box>
          </CardActions>
        </Card>
      </Box>
    );
}