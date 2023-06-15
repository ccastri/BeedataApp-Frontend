import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import SuccessSnackbar from '../settings/settings-success-msg';
import ErrorSnackbar from '../settings/settings-error-msg';
import useMediaQuery from '@mui/material/useMediaQuery';
import api from '../../lib/axios';
import { useFormik } from 'formik';

const StyledCard = styled(Card)(({ theme }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return {
    maxWidth: isSmallScreen ? '90vw' : '60vw',
    margin: 'auto',
    borderRadius: 12,
    padding: 12,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
  };
});

const StyledCardMedia = styled(CardMedia)(({ theme }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return {
    borderRadius: 6,
    width: isSmallScreen ? 150 : 200,
    height: isSmallScreen ? 150 : 200,
  };
});

export const ProductDialog = (props) => {
  const { name, image } = props;
  const [open, setOpen] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setProductDescription('');
    setProductPrice('');
    setErrorMessage('');
    setResponseMessage('');
    formik.resetForm(); // Reset form values
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await api.post('/api/v1/products/beet-products', {
          beetProduct: name,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.data && response.data.productSelection) {
          setProductOptions(response.data.productSelection);
        } else {
          console.error('Invalid response:', response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [name]);

  const productTypes = productOptions.map((product) => ({
    value: product.product_id,
    label: product.name
  }));

  const onSubmit = async (values) => {
    try {
      const token = localStorage.getItem('jwt');

      // Get Company credit
      const creditResponse = await api.get('/api/v1/companies/company', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if credit is enough to purchase product
      if (creditResponse && creditResponse.data && creditResponse.data.company) {
        const companyCredit = Number(creditResponse.data.company.credit);
        if (companyCredit < productPrice) {
          setErrorMessage('Not enough credit to purchase product');
          return;
        }
      }

      const purchaseDetails = {
        productId: values.product,
        productQuantity: 1,
        productPrice: productPrice,
      };
      
      const response = await api.post('/api/v1/products/purchase-product', purchaseDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data && response.data.purchase) {
        setResponseMessage(response.data.message);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      product: '',
    },
    onSubmit
  });

  const handleChange = (event) => {
    formik.handleChange(event);
    const selectedProduct = productOptions.find((product) => product.product_id === event.target.value);
    if (selectedProduct) {
      setProductDescription(selectedProduct.description);
      setProductPrice(selectedProduct.price);
    }
    setSelectedProduct(event.target.value);
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        fullWidth
        color="secondary"
        sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)'}}
      >
        Purchase
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: isSmallScreen ? '90vw' : isMediumScreen ? '60vw' : '40vw',
            height: isSmallScreen ? '70vh' : isMediumScreen ? '75vh' : '60vh',
            overflow: 'hidden',
          },

        }}
      >
        <DialogContent>
          <StyledCard>
            <Grid container
spacing={2}>
              <Grid item
xs={5}>
                <StyledCardMedia image={image} />
              </Grid>
              <Grid item
xs={7}>
                <CardContent>
                  <Typography gutterBottom
variant="h4"
component="div">
                    {name}
                  </Typography>
                  {selectedProduct && (
                    <>
                      <Typography variant="subtitle2"
color="text.secondary">
                        {productDescription}
                      </Typography>
                      {productPrice && (
                        <Typography
                          gutterBottom
                          variant="h5"
                          sx={{ mt: 2, mb: -1 }}
                        >
                          Price: {productPrice} USD
                        </Typography>
                      )}
                    </>
                  )}
                </CardContent>
              </Grid>
            </Grid>
          </StyledCard>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DialogActions>
            <Box sx={{ 
                minWidth: isSmallScreen ? '40vw' : isMediumScreen ? '35vw' : '25vw',
                maxWidth: isSmallScreen ? '60vw' : isMediumScreen ? '36vw' : '26vw',
                minHeight: isSmallScreen ? '40vh' : isMediumScreen ? '35vh' : '25vh',
                maxHeight: isSmallScreen ? '30vh' : isMediumScreen ? '35vh' : '35vh'
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  id="product"
                  name="product"
                  label="Choose Product"
                  select
                  fullWidth
                  value={formik.values.product}
                  onChange={handleChange}
                  error={formik.touched.product && Boolean(formik.errors.product)}
                  helperText={formik.touched.product && formik.errors.product}
                >
                  {productTypes.map((option) => (
                    <MenuItem key={option.value}
value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  fullWidth
                  sx={{ mb: 1, mt: 1, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="secondary"
                  sx={{ mb: 2, mt: 1, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                >
                  Purchase
                </Button>
              </form>
              {responseMessage && (
                  <SuccessSnackbar responseMessage={responseMessage}
container={'dialog'} />
              )}
              {errorMessage && (
                  <ErrorSnackbar errorMessage={errorMessage}
container={'dialog'} />
              )}
            </Box>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};
