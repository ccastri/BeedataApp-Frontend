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
        const response = await axios.get('/api/user/billing-history');
        setData(response.data);
      } catch (error) {
        console.log(error);
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
            <TableContainer>
                <Table>
                <TableHead sx={{ '& .MuiTableCell-root': { width: '25%' } }}>
                    <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell align="right">Payment Method</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                        {item.timestamp}
                        </TableCell>
                        <TableCell align="right">{item.paymentMethod}</TableCell>
                        <TableCell align="right">{item.status}</TableCell>
                        <TableCell align="right">{item.amount}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </CardContent>
        </Card>
    </Box>
  );
};
