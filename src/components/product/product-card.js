import React, { useState, useEffect, useRef } from 'react';
import { SocialSettings } from './product-settings/social';
import { ProductDialog } from './product-dialog';  
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


const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.4)',
};

const calculateExpirationDate = (purchaseDate, renewalTime, renewalUnit) => {
  let expirationDate = new Date(purchaseDate);
  switch (renewalUnit) {
    case 'days':
      expirationDate.setDate(expirationDate.getDate() + renewalTime);
      break;
    case 'month':
      expirationDate.setMonth(expirationDate.getMonth() + renewalTime);
      break;
    case 'year':
      expirationDate.setFullYear(expirationDate.getFullYear() + renewalTime);
      break;
    default:
      break;
  }
  return expirationDate;
}

/**
 * ProductCard component that displays Beet's available products.
 * 
 * Dependencies: useState, useEffect, useRef, getUserRole, WpConfigAccountDialog,
 *              FbSignupFlow, SocialAgentSelection, ProductDialog, ProductActivation,
 *             PropTypes, Avatar, Box, Card, CardContent, CardActions, Divider,
 *            Typography, CircularProgress, api.
 * 
 * @param {Object} props Component props
 * 
 * @returns {JSX.Element} JSX.Element
 * 
 * Usage: Used to display Beet's available products.
 */
export const ProductCard = ({ product, purchaseDetails, beetDetails, isActive, ...rest }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const isActiveRef = useRef(isActive);

  const beetDetailsT = beetDetails ? beetDetails.replace(/^{"|"}$/g, '').replace(/\\"/g, '"') : '';
  const parseBeetDetails = beetDetailsT ? JSON.parse(beetDetailsT) : '';

  const productQuantity = parseBeetDetails ? parseBeetDetails.products.find(item => item.name === product.name)?.quantity : '';
  const productUnitType = parseBeetDetails ? parseBeetDetails.products.find(item => item.name === product.name)?.unit_type : '';

  const renewalTime = purchaseDetails ? Number(purchaseDetails.beet_renewal_time) : 0;
  const renewalUnit = purchaseDetails ? purchaseDetails.beet_renewal_exp_unit : '';
  const expirationTime = purchaseDetails ? Number(purchaseDetails.beet_expiration_time) : 0;

  let renewalString = '';
  if (renewalTime == 1) {
    renewalString = `${renewalUnit}`;
  } else {
    renewalString = `${renewalTime.toString().replace('.00', '')} ${renewalUnit}`;
  }

  const purchaseDate = purchaseDetails ? new Date(purchaseDetails.create_date) : null;
  const expirationDate = purchaseDate ? calculateExpirationDate(purchaseDate, expirationTime, renewalUnit) : '';

  useEffect(() => {
    const currentDate = new Date();
    isActiveRef.current = (currentDate < expirationDate);
  }, [expirationDate]);

  const token = localStorage.getItem('jwt');

  // Get company info to check if messaging account (whatsapp or others) is configured
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/companies/company', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data && response.data.company) {
          const company = response.data.company;

          if (company.facebook_token) {
            setIsConfigured(true);
          }
        }

      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
            filter: 'none',
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
            filter: !isActiveRef.current ? 'grayscale(100%)' : 'none',
          }}
        >
          <Typography
            align="center"
            color="textPrimary"
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
            {(isActiveRef.current && product.id != 1) ? `Available: ${productQuantity} ${productUnitType} / ${renewalString}` : (!isActiveRef.current && product.id != 1) ? "Not available" : ''}
          </Typography>
        </Box>
        {isActiveRef.current && (
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
                mb: 0,
                mt: 3,
                borderRadius: '6px',
                textAlign: 'center',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
                backgroundColor: '#EFEFEF',
                p: 2,
              }}
            >
              <Typography
                align="center"
                color="#333333"
                variant="subtitle2"
              >
                Expires on: {expirationDate.toLocaleString('es-CO', { year: 'numeric', month: 'numeric', day: 'numeric' })}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <CardActions>
        <SocialSettings/>
      </CardActions>
    </Card>
  );
};


ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};
