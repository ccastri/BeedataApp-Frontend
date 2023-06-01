import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../lib/axios';
import { WpConfigAccountDialog } from './config-account-dialog';
import { ProductDialog } from './product-dialog';

export const ProductCard = ({product, isActive, ...rest }) => {
    const [isConfigured, setIsConfigured] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('jwt');
    
    const cardStyle = {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.4)',
    };

    // Get company info to check if whatsapp account is configured
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await api.get('/api/company', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (response && response.data && response.data.company) {
            const company = response.data.company;

            // Check is Waba and access token fields are not empty
            if (company.waba && company.access_token) {
              setIsConfigured(true);
            }
          }
          
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      }
      fetchData();
    }, []);

    // Retrieve user role from JWT token
    const getUserRole = () => {
      if (token) {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return payload.userRole;
      }
      return '';
    };

  let expiryDate = '';
  let availability = '';

  // Get product details if there are any
  if (product.display_name && product.create_date) {
    const productDetails = product.display_name.match(/\((.*?)\)/)[1].split(', ');
    // Get product availability units
    availability = productDetails[1] === 'Gratis' ? 'Free' : Number(productDetails[1]);

    // Get product expiry date
    const createDate = new Date(product.create_date);
    const [duration, unit] = productDetails[0].split(' ');
    expiryDate = new Date(createDate);
  
    if (unit === 'meses') {
      expiryDate.setMonth(expiryDate.getMonth() + parseInt(duration));
    } else if (unit === 'dias' || unit === 'día') {
      expiryDate.setDate(expiryDate.getDate() + parseInt(duration));
    } else if (unit === 'año') {
      expiryDate.setFullYear(expiryDate.getFullYear() + parseInt(duration));
    }
  }
    // Check if expiry date has passed
    const currentDate = new Date();
    console.log(currentDate);
    console.log("This is expiry: ", expiryDate);
    console.log(currentDate > expiryDate);

    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', // center contents vertically
            height: '100%',
            pb: 3
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Card
        sx={cardStyle}
        {...rest}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pb: 3,
              filter: !isActive ? 'grayscale(100%)' : 'none',
            }}
          >
            <Avatar
              alt="Product"
              src={product.image}
              sx={{ height: 100, width: 100 }}
            />
          </Box>
          <Box
            sx={{
              textAlign: 'center',
              filter: !isActive ? 'grayscale(100%)' : 'none',
            }}
          >
            <Typography
              align="center"
              color= "textPrimary"
              gutterBottom
              variant="h5"
            >
              {product.name}
            </Typography>
            <Typography
              align="center"
              color="textSecondary"
              variant="subtitle1"
            >
              {isActive ? `Available: ${availability} / ${product.unitType}` : "Not available"}
            </Typography>
          </Box>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <CardActions>
          {getUserRole() === 'admin' && product.id === 1 && !isConfigured && (
            <WpConfigAccountDialog />
          )}
          {getUserRole() === 'admin' && !isActive && (
            <ProductDialog 
              image={product.image}
              name={product.name}
              description={product.description}
            />
          )}
          {isActive && (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                mr: 2,
                ml: 2,
                mb: 2,
                mt: 1,
                textAlign: 'center',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
                backgroundColor: '#F7F7F7',
                p: 2,
              }}
            >
              <Typography 
                align="center"
                color="#D21312"
                variant="subtitle2"
              >
                Expires on: {expiryDate.toLocaleDateString('es-CO', { day: "2-digit", month: "2-digit", year: "2-digit" })}
              </Typography>
            </Box>
          </Box>
        )}
        </CardActions>
      </Card>
    );
};


ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};
