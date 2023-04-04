import React from 'react';
import { useState, useEffect } from 'react';
import { 
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow } from '@mui/material';
import axios from 'axios';


export const BillingHistory = ({ title }) => {
    
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('jwt');
          const response = await axios.get('/api/billing-history', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response && response.data && response.data.billingHistory) {
            setData(response.data.billingHistory);
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
    <Box sx={{ mt: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom data-testid="billing-history-title">
            {title}
        </Typography>
        <Card sx={{ marginTop: 2 }}>
            <CardContent>
              {data.length === 0 ? (
                <Typography>No billing history found</Typography>
              ) : (
                <TableContainer>
                  <Table data-testid="billing-history-table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.created_at}</TableCell>
                          <TableCell>{item.payment_method}</TableCell>
                          <TableCell>{item.sandbox_status}</TableCell>
                          <TableCell>{item.usd}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
        </Card>
    </Box>
  );
};
