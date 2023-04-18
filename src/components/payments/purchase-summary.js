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
import api from '../../lib/axios';

export const PurchaseSummary = ({ title }) => {
    
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('jwt');
          const response = await api.get('/api/purchase-history', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.purchaseHistory) {
            setData(response.data.purchaseHistory);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, []);



  return (
    <Box sx={{ mt: 3 }}>
        <Typography variant="h4"
component="h2"
gutterBottom>
            {title}
        </Typography>
        <Card sx={{ marginTop: 2 }}>
            <CardContent>
              {data.length === 0 ? (
                <Typography>No purchase history found</Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Total Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((item) => (
                        <TableRow key={item.order_id}>
                          <TableCell>{item.create_date}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.product_qty}</TableCell>
                          <TableCell>{item.price_total}</TableCell>
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
