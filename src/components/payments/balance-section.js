import { Box, Card, CardContent, Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { socket } from '../websocket';
import { IOSSwitch } from './switch'


export const BalanceSection = ({title}) => {
    const [balance, setBalance] = useState(300);
    const [isAlertEnabled, setIsAlertEnabled] = useState(false);
    const [isRechargeEnabled, setIsRechargeEnabled] = useState(false);

    useEffect(() => {
      if (socket !== undefined) {
        socket.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);
        });
      }
    }, [socket]);
    
    // useEffect(() => {
    //   socket.addEventListener('message', (event) => {
    //     const data = JSON.parse(event.data);
    //     const token = localStorage.getItem('jwt');
    //     // Parse token to extract userId
    //     const userData = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    //     if (data.userId === userData.userId) {
    //       setBalance(data.balance);
    //     }
    //   }); 
    // }, []);

    const handleAddMoney = () => {
        // Redirect to page for adding money to balance
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
              USD${balance}
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
                  onChange={(event) => setIsAlertEnabled(event.target.checked)}
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
      </Box>
    );
}