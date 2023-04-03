import React from 'react';
import { Box, Card, CardContent, Button, Typography, useControlled } from '@mui/material';
import { useState, useEffect } from 'react';
import { IOSSwitch } from './switch'
import WarningSnackbar from '../settings/settings-warning-msg';
import axios from 'axios';


export const BalanceSection = ({title}) => {

    const [balance, setBalance] = useState(0);
    const [isAlertEnabled, setIsAlertEnabled] = useState(null);
    const [isRechargeEnabled, setIsRechargeEnabled] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleAddMoney = () => {
        // Redirect to page for adding money to balance
      };

    const handleAlertChange = async (event) => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.post('/api/set-alert', {
          alert_switch: event.target.checked
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    const handleSwitchToggle = (event) => {
      setIsAlertEnabled(event.target.checked);
      handleAlertChange(event);
    }

    useEffect(() => {
      const getInitState = async () => {
        try {
          const token = localStorage.getItem('jwt');
          const response = await axios.get('/api/alert-state', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log(response.data.alertState[0].alert_switch);
          setIsAlertEnabled(response.data.alertState[0].alert_switch);
        } catch (error) {
          console.log(error);
          setIsAlertEnabled(false); // return a default value in case of an error
        }
      };
      getInitState();
    }, []);
    
    

    useEffect(() => {
      const token = localStorage.getItem('jwt');

      const fetchBalance = async () => {
      try {
        const response = await axios.get('/api/current-balance', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const currentBalance = response.data.currentBalance;
      if (response.data.refillAlert) {
        setAlertMessage(response.data.alertMessage);
      }

      setBalance(currentBalance);

    } catch (error) {
        console.log(error);
      }
    };
  
    fetchBalance();
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={handleAddMoney}>
              Add Credit
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                <Typography variant="body1" gutterBottom sx={{ marginRight: 2 }}>
                  Balance under 10 USD alert:
                </Typography>
                <IOSSwitch
                  checked={isAlertEnabled}
                  data-testid='alert-switch'
                  onChange={handleSwitchToggle}
                  sx={{ marginLeft: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                <Typography variant="body1" gutterBottom sx={{ marginRight: 2 }}>
                  Automatic Reload:
                </Typography>
                <IOSSwitch
                  checked={isRechargeEnabled}
                  onChange={(event) => setIsRechargeEnabled(event.target.checked)}
                />
              </Box>
            </Box>
          </Box>
          </CardContent>
        </Card>
        {isAlertEnabled && alertMessage && (
          <WarningSnackbar message={alertMessage} />
        )}
      </Box>
    );
}