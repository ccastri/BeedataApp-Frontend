import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import api from '../../lib/axios';
import { CreditDialog } from './add-credit-dialog';
import { getUserRole } from '../../utils/get-user-data';


export const BalanceSection = ({ title }) => {
  const [balance, setBalance] = useState(0);
  const { companyId } = useContext(CompanyContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('jwt')
        const response = await api.get(`/api/v1/companies/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.data && response.data.company) {
          setBalance(parseFloat(response.data.company.credit).toFixed(2));          
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
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4"
component="h2"
gutterBottom>
        {title}
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h5"
component="h2"
gutterBottom>
            Current Balance
          </Typography>
          <Typography variant="h4"
component="div"
sx={{ mb: 2 }}>
            USD$ {balance}
          </Typography>
        </CardContent>
        {getUserRole() === 'admin' && (
          <>
            <Divider />
            <CardActions sx={{ mt: 1, mb: 1 }}>
              <CreditDialog />
            </CardActions>
          </>
        )}
      </Card>
    </Box>
  );
};
