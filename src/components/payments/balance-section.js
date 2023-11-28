import React, { useState, useEffect, useContext } from 'react';
import CompanyContext from '../../contexts/company-context';
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

/** 
 * Balance section component
 * 
 * @param {string} props.title - a string that specifies the title of the balance section
 * 
 * @returns {JSX.Element} - a JSX.Element representing the balance section component
 * 
*/
export const BalanceSection = ({ title }) => {
  const [balance, setBalance] = useState(0);
  const { companyId } = useContext(CompanyContext);

  const updateCredit = (value) => {
    setBalance((prevBalance) => (parseFloat(prevBalance) + parseFloat(value)).toFixed(2));
  };

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
  }, [companyId]);

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
        {(getUserRole() === 'admin' || getUserRole() === 'superadmin') && (
          <>
            <Divider />
            <CardActions sx={{ mt: 1, mb: 1 }}>
              <CreditDialog productId={50} updateCredit={updateCredit}/>
            </CardActions>
          </>
        )}
      </Card>
    </Box>
  );
};
