import React from 'react';
import { WhatsappSettings } from './product-settings/whatsapp';
import { ProductDialog } from './product-dialog';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';



/**
 * ProductCard component that displays Beet's available products.
 * 
 * Dependencies: Avatar, Box, Card, CardContent, CardActions, Divider, Typography,
 *              SocialSettings, WhatsappSettings, LakeSettings, ProductDialog.
 * 
 * @param {Object} props Component props
 * 
 * @returns {JSX.Element} JSX.Element
 * 
 * Usage: Used to display Beet's available products.
 */
export const ProductCard = (props) => {
  const { product, wabas, updateWabas, deleteRow, isConsumption, credit, accessToken, responseMessage, errorMessage, updateCompanyConsumption, clearMessages } = props;
  
  const getAvailableQuantity = (product) => {
    const unitTypeMap = {
      'messages': `${product.msg_qty} messages / ${product.renewal_exp_unit}`,
      'rows': `${product.db_rows_qty} rows ${product.renewal_exp_unit ? '/ ' + product.renewal_exp_unit : ''}`,
      'agents': `${product.agents_qty} agents`,
    };

    return unitTypeMap[product.unitType];
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.4)'
      }}
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
            data-testid="product-avatar"
            alt="Product"
            src={product.image}
            sx={{ height: 100, width: 100 }}
          />
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            filter: product.isActive ? 'grayscale(100%)' : 'none',
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
            {(product.isActive && product.id !== 1) ? `Available: ${getAvailableQuantity(product)}` : 
              (!product.isActive && product.id !== 1) ? "Not available" : (product.isActive && product.id === 1) ? "Available" : "Not available"}
          </Typography>
          {product.isActive && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '6px',
                textAlign: 'center',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
                backgroundColor: '#EFEFEF',
                p: 2,
                mr: 4,
                ml: 4,
                mt: 2,
              }}
            >
              <Typography
                color="#333333"
                variant="subtitle2"
              >
                {parseInt(product.product_id, 10) === 4 ? 'Depends on Credit' : `Expires on: ${new Date(product.expiration_date)
                  .toLocaleString('es-CO', { year: 'numeric', month: 'numeric', day: 'numeric' })}`}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box>
            {(product.id === 2 || product.id === 1) && (<WhatsappSettings
              wabas={wabas}
              deleteRow={deleteRow}
              productId={product.id}
              accessToken={accessToken}
              isConsumption={isConsumption}
              credit={credit}
              responseMessage={responseMessage}
              errorMessage={errorMessage}
              updateCompanyConsumption={updateCompanyConsumption}
              updateWabas={updateWabas}
              clearMessages={clearMessages}
            />)}
          </Box>
          <Box>
            {(product.id !== 1) && (<ProductDialog name={product.name}
              image={product.image}
              isConsumption={isConsumption}
              updateCompanyConsumption={updateCompanyConsumption} />)}
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};


ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  wabas: PropTypes.array.isRequired,
  updateWabas: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired,
  isConsumption: PropTypes.bool.isRequired,
  credit: PropTypes.number.isRequired,
  accessToken: PropTypes.bool.isRequired,
  responseMessage: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  updateCompanyConsumption: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
};
