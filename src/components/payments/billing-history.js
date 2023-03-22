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
          setData(response.data.billingHistory);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, []);
  

  return (
    <Box sx={{ mt: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
            {title}
        </Typography>
        <Card sx={{ marginTop: 2 }}>
            <CardContent>
              {data.length === 0 ? (
                <Typography>No billing history found</Typography>
              ) : (
                <TableContainer>
                  <Table>
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
