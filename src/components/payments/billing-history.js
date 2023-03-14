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
import { axiosBase } from '../../lib/axios';

export const BillingHistory = ({ title }) => {
//   const [data, setData] = useState([]);
  
  const data = [
    {
        id: 1,
        timestamp: '2022-01-01 10:00:00',
        paymentMethod: 'Credit Card',
        status: 'Paid',
        amount: '$50.00'
    },
    {
        id: 2,
        timestamp: '2022-01-05 14:30:00',
        paymentMethod: 'PayPal',
        status: 'Paid',
        amount: '$20.00'
    },
    {
        id: 3,
        timestamp: '2022-02-10 09:15:00',
        paymentMethod: 'Bank Transfer',
        status: 'Paid',
        amount: '$100.00'
    },
    {
        id: 4,
        timestamp: '2022-02-15 16:45:00',
        paymentMethod: 'Credit Card',
        status: 'Refunded',
        amount: '$30.00'
    },
    {
        id: 5,
        timestamp: '2022-03-01 11:20:00',
        paymentMethod: 'Credit Card',
        status: 'Paid',
        amount: '$75.00'
    }
  ];

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
