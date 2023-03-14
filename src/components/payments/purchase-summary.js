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

export const PurchaseSummary = ({ title }) => {
//   const [data, setData] = useState([]);

  const data = [
    {
        id: 1,
        product: 'Beeflow',
        cost: '$480.00'
    },
    {
        id: 3,
        product: 'Lake',
        cost: '$300.00'
    },
    {
        id: 2,
        product: 'Beesocial',
        cost: '$20.00'
    },
    {
        id: 4,
        product: 'Lake',
        cost: '$300.00'
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
                <TableHead>
                    <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Cost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                    <TableRow key={item.product}>
                        <TableCell component="th" scope="row">
                        {item.product}
                        </TableCell>
                        <TableCell align="right">{item.cost}</TableCell>
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
