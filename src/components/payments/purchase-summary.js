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
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosBase.get('/api/user/purchases');
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
                <TableHead>
                    <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Cost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                    <TableRow key={item.id}>
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
