import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import SuccessSnackbar from '../settings/settings-success-msg';
import ErrorSnackbar from '../settings/settings-error-msg';
import useMediaQuery from '@mui/material/useMediaQuery';
import api from '../../lib/axios';


const StyledCard = styled(Card)(({ theme }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return {
    maxWidth: isSmallScreen ? '90vw' : '50vw',
    margin: 'auto',
    marginBottom: '2em',
    borderRadius: 12,
    padding: 12,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
  };
});

const StyledCardMedia = styled(CardMedia)(({ theme }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return {
    borderRadius: 8,
    width: isSmallScreen ? 150 : 200,
    height: isSmallScreen ? 150 : 200,
    margin: 'auto',
  };
});

/**
 * ProductDialog component that displays product information for purchase.
 * 
 * Dependencies: useState, useEffect, styled, Box, Card, CardMedia, CardContent,
 *              Typography, Dialog, DialogContent, DialogActions, Grid, Button,
 *             TextField, MenuItem, SuccessSnackbar, ErrorSnackbar, useMediaQuery,
 *             api, useFormik.
 * Usage: Used to display product information for purchase.
 */
export const ProductDialog = ({ name, image }) => {
  const [open, setOpen] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await api.get('/api/v1/products/beet-products', {
          headers: { Authorization: `Bearer ${token}` },
          params: { beetProduct: name },
        });
        if (response?.data?.productSelection) {
          setProductOptions(response.data.productSelection);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [name]);

  const formik = useFormik({
    initialValues: { product: '' },
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('jwt');
        const creditResponse = await api.get('/api/v1/companies/company', { headers: { Authorization: `Bearer ${token}` } });
        const companyCredit = Number(creditResponse?.data?.company?.credit);
        if (companyCredit < productPrice) {
          setErrorMessage('Not enough credit to purchase product');
          return;
        }
        const purchaseDetails = { productId: values.product, productQuantity: 1, productPrice };
        const response = await api.post('/api/v1/products/purchase-product', purchaseDetails, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.purchase) {
          setResponseMessage(response.data.message);
          setTimeout(() => { window.location.reload(); }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    }
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
      <IconButton
        onClick={() => setOpen(true)}
        sx={{ ml: 4, mr: 4, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)', color: '#111827', borderColor: '#111827' }}
        data-testid="purchase-button"
      >
        <LocalGroceryStoreIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          formik.resetForm();
          setSelectedProduct(null);
        }}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => {
              setOpen(false);
              formik.resetForm();
              setSelectedProduct(null);
            }}
            aria-label="close-product-dialog"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Grid container  >
          <Grid item xs={12} sm={6}>
            <DialogContent>
              <StyledCard>
                <Grid container spacing={2} display="flex" justifyContent="center" alignItems="center">
                  <Grid item display="flex" justifyContent="center" alignItems="center">
                    <StyledCardMedia image={image} />
                  </Grid>
                  <Grid item
                    xs={9}>
                    <CardContent>
                      <Typography gutterBottom
                        variant="h4"
                        component="div">
                        {name}
                      </Typography>
                      {selectedProduct ? (
                        <>
                          <Typography variant="subtitle2" color="text.secondary">
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
                      ) : (
                        <Typography gutterBottom variant="h7" color="text.secondary">
                          Select a product to see description
                        </Typography>
                      )}
                    </CardContent>
                  </Grid>
                </Grid>
              </StyledCard>
            </DialogContent>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <DialogActions>
                <Box sx={{
                  padding: '1em',
                  minWidth: '400px'
                }}>
                  <form onSubmit={formik.handleSubmit}>
                    <TextField
                      id="product"
                      name="product"
                      label="Choose Product"
                      select
                      value={formik.values.product}
                      onChange={handleChange}
                      error={formik.touched.product && Boolean(formik.errors.product)}
                      helperText={formik.touched.product && formik.errors.product}
                      sx={{ width: '100%' }}
                    >
                      {productOptions.map((option, index) => (
                        <MenuItem key={index}
                          value={option.product_id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        mb: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        endIcon={<LocalGroceryStoreIcon />}
                        sx={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)', width: '50%' }}
                      >
                        Purchase
                      </Button>
                    </Box>
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
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};
