import React, { useState, useEffect, useContext } from 'react';
import { CompanyContext } from '../../contexts/company';
import { AuthContext } from '../../contexts/auth';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import api from '../../lib/axios';

export const PurchaseSummary = ({ title }) => {
    
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const { companyId } = useContext(CompanyContext);
    const { token } = useContext(AuthContext);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await api.get(`/api/v1/${companyId}/payments/tools`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.toolsHistory) {
            setData(response.data.toolsHistory);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, [companyId, token]);

    const handleChangePage = (_, newPage) => {
      setCurrentPage(newPage);
    }

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
                  <Typography>No tools history found</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Product</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Total Price</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.slice(currentPage * 5, (currentPage + 1) * 5).reverse().map((item, index) => (
                          <TableRow key={`${item.order_id}-${index}`}>
                            <TableCell>{item.create_date.split(' ')[0]}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.product_qty}</TableCell>
                            <TableCell>{item.price_total} USD</TableCell>
                            <TableCell>{item.state}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      rowsPerPageOptions={[5]}
                      count={data.length}
                      rowsPerPage={5}
                      page={currentPage}
                      onPageChange={handleChangePage}
                      sx={{ mb: -1 }}
                    />
                  </TableContainer>
                )}
              </CardContent>
          </Card>
      </Box>
    );
};
