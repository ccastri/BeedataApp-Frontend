import React, { useState, useEffect, useContext } from 'react';
import CompanyContext from '../../contexts/company-context';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Cookies from 'js-cookie';
import api from '../../lib/axios';

/**
 * Dropdown component
 * 
 * @returns {JSX.Element} - a JSX.Element representing the dropdown list component
 * 
 */
export const DropDown = () => {
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const { companyId, setCompanyId } = useContext(CompanyContext);

  useEffect(() => {
    const token = Cookies.get('jwt');
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/companies', { headers: { Authorization: `Bearer ${token}` } });

        if (response.data.success) {
          const companies = response.data.companies.map(company => ({ 
            name: capitalizeFirstLetter(company.name),
            id: company.id 
          }));
          setCompanies(companies);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleCompanyClick = (company) => {
    setCompanyId(company.id);
    localStorage.setItem('companyId', company.id);
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


  return (
    <List
      sx={{ width: '100%', maxWidth: 360 }}
      component="nav"
    >
      <Button
        disableRipple
        onClick={handleClick}
        startIcon={<BusinessIcon />}
        sx={{
          justifyContent: 'flex-start',
          borderRadius: 1,
          fontWeight: 'fontWeightBold',
          px: 4,
          width: '100%',
          textTransform: 'none',
          textAlign: 'left',
          color: 'neutral.300',
          '&:hover': { backgroundColor: 'rgba(255,255,255, 0.08)' }
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          Companies
        </Box>
        {open ? <ExpandLess /> : <ExpandMore />}
      </Button>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ maxHeight: '200px', overflow: 'auto' }}>
          {companies.map((company) => (
            <Button
              key={company.id}
              onClick={() => handleCompanyClick(company)}
              sx={{
                justifyContent: 'flex-start',
                px: 7, width: '100%',
                borderRadius: 1,
                textTransform: 'none',
                textAlign: 'left',
                color: 'neutral.300',
                '&:hover': { backgroundColor: 'rgba(255,255,255, 0.08)' } }}
            >
              <Box sx={{ flexGrow: 1 }}>
                {company.name}
              </Box>
            </Button>
          ))}
        </List>
      </Collapse>
    </List>
  );
}