import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { WpConfigAccountDialog } from './config-account-dialog';

export const ProductCard = ({product, isActive, ...rest }) => {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.4)',
  };
  
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
            color= "textSecondary"
            variant="subtitle1"
          >
            Available:
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <CardActions>
        {product.id === 1 && isActive && (
          <WpConfigAccountDialog />
        )}
        {!isActive && (
          <Button 
            variant="contained"
            fullWidth
            color="secondary"
            sx={{ ml: 2, mr: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)', fontWeight: 'bold' }}
          >
            Purchase
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};
