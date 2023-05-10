import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { baseProducts } from '../../data/base_products';

/**
 * Component that displays a product card.
 * 
 * @param {object} product - The product object to display.
 * @param {object} rest - The rest of the props passed to the component.
 * 
 * @returns {JSX.Element} - The component JSX.
 * 
 */
export const ProductCard = ({ product, ...rest }) => {
  // Find the matching base product for this product's name
  const matchedProduct = baseProducts.find((baseProduct) => product.name.includes(baseProduct.name));

  const rawProductDetails = product.name_short.replace("(copia)", "");
  const productDetails = rawProductDetails.match(/\((.*?)\)/g)[0].replace(/\(|\)/g,'').split(',');

  // Calculate product expiration date and amount available
  let expiryDate = '';
  let amountAvailable = '';
  const createDate = new Date(product.create_date);
  const duration = parseInt(productDetails[0].replace(/\D/g,''));
  const durationUnit = productDetails[0].match(/[a-zA-Z]+/)[0].toLowerCase();

  if (durationUnit === 'meses') {
    expiryDate = new Date(createDate.setMonth(createDate.getMonth() + duration));
    amountAvailable = productDetails[1].trim();
  }  else if (unit === 'año') {
    expiryDate = new Date(createDate.setFullYear(createDate.getFullYear() + duration));
    amountAvailable = productDetails[1].trim();
  }

  // Handle Whatsapp busiines account configuration
  const handleConfigureAccount = () => {};

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      {...rest}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
          <Avatar
            alt="Product"
            src={matchedProduct.image}
            sx={{ height: 100, width: 100 }}
          />
        </Box>
        <Typography
          align="center"
          color= "textPrimary"
          gutterBottom
          variant="h5"
        >
          {matchedProduct.name}
        </Typography>
        <Typography
          align="center"
          color= "textSecondary"
          variant="subtitle1"
        >
          Available: {amountAvailable} messages / month
        </Typography>
        <Typography
          align="center"
          color= "textPrimary"
          variant="body1"
          sx={{ pt: 2 }}
        >
          {matchedProduct.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{p: 2, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <Typography
          align="left"
          color= "red"
          variant="subtitle2"
          sx={{  }}
        >
          Expires on: {expiryDate.toLocaleDateString('es-CO')}
        </Typography>
        {matchedProduct.name === 'Beet / WhatsApp' && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleConfigureAccount}
          >
            Configure Account
          </Button>
        )}
      </Box>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
