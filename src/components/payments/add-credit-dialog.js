import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
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
import TextFieldWrapper from '../general/textfield-wrapper';
import useMediaQuery from '@mui/material/useMediaQuery';
import api from '../../lib/axios';


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

export const CreditDialog = () => {
  const [open, setOpen] = useState(false);

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    formik.resetForm(); // Reset form values
    setOpen(false);
  };

  const onSubmit = async (values) => {
    try {
      const token = localStorage.getItem('jwt');

      const purchaseCredit = {
        productId: 50,
        productQuantity: values.amount,
      };

      const result = await api.post('/api/purchase-product', purchaseCredit, {
        headers: {
          Authorization: `Bearer ${token}`,
      }
      });

      if (result.data.success) {
        console.log(result.data.message);
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };


  const formik = useFormik({
    initialValues: {
      amount: '',
  },
    onSubmit
  });

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        fullWidth
        color="primary"
        sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
      >
        Add Credit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: isSmallScreen ? '90vw' : isMediumScreen ? '60vw' : '30vw',
            height: isSmallScreen ? '70vh' : isMediumScreen ? '60vh' : '45vh',
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
                <StyledCardMedia image='/static/beet_nb.svg' />
              </Grid>
              <Grid item
xs={7}>
                <CardContent>
                  <Typography gutterBottom
variant="h4"
component="div">
                    Credit
                  </Typography>
                  <Typography variant="body2"
color="text.secondary">
                    Add credit to your account. <b>Your credit will be invoiced at the end of the month</b>.
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </StyledCard>
        </DialogContent>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <DialogActions>
            <Box sx={{ maxWidth: '400px' }}>
              <form onSubmit={formik.handleSubmit}>
                <TextFieldWrapper
                  formik={formik}
                  name="amount"
                  label="Amount $USD"
                />
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  fullWidth
                  sx={{ mb: 1, mt: 1, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)'}}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="secondary"
                  sx={{ mb: 2, mt: 1, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)'}}
                >
                  Add Credit
                </Button>
              </form>
            </Box>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
