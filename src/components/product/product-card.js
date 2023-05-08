import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { baseProducts } from '../../data/base_products';
import { User as UserIcon } from '../../icons/user';

export const ProductCard = ({ product, ...rest }) => {
  // Find the matching base product for this product's name
  const matchedProduct = baseProducts.find((baseProduct) => product.name.includes(baseProduct.name));

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
          color= "textPrimary"
          variant="body1"
        >
          {matchedProduct.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
      </Box>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
