import React, { useState, useEffect, useContext } from 'react';
import CompanyContext from '../../contexts/company-context';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import api from '../../lib/axios';


export const CreditHistory = ({ title }) => {
    
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const { companyId } = useContext(CompanyContext);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = Cookies.get('jwt')
          const response = await api.get(`/api/v1/${companyId}/payments/credit`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response && response.data && response.data.creditHistory) {
            setData(response.data.creditHistory);
          } else {
            console.error('Invalid response:', response);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, [companyId]);

    const handleChangePage = (_, newPage) => {
      setCurrentPage(newPage);
    }
  
    return (
      <Box sx={{ mt: 3 }}>
          <Typography variant="h4"
  component="h2"
  gutterBottom
  data-testid="credit-history-title">
              {title}
          </Typography>
          <Card sx={{ marginTop: 2 }}>
              <CardContent>
                {data.length === 0 ? (
                  <Typography>No credit history found</Typography>
                ) : (
                  <TableContainer>
                    <Table data-testid="credit-history-table">
                      <TableHead>
                      <TableRow>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Product</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.slice(currentPage * 5, (currentPage + 1) * 5).reverse().map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.create_date.split(' ')[0]}</TableCell>
                            <TableCell>{item.display_name}</TableCell>
                            <TableCell>{item.state}</TableCell>
                            <TableCell>{item.price_total} USD</TableCell>
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
