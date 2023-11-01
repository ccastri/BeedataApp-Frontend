import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import api from '../../../../lib/axios';

/** 
 * 
 * ProductActivation component that displays Beet's available products for activation.
 * 
 * Dependencies: useState, api, Box, Button, Dialog, DialogContent, DialogContentText,
 *             DialogActions, DialogTitle, Typography.
 * 
 * @param {Object} props Component props
 * 
 * @returns {JSX.Element} JSX.Element
 * 
 * Usage: Used to display Beet's available products for activation.
*/
export const ProductActivation = ({ isConsumption, credit, updateCompanyConsumption, purchaseConsumptionProduct }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setPurchaseExpired = async () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 1);
    try {
      const token = localStorage.getItem('jwt');
      const updatedCompanyResponse = await api.put('/api/v1/purchases/active', { expirationDate: expirationDate, isConsumption: isConsumption }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(updatedCompanyResponse);
    } catch (error) {
      console.log(error);
    }

  };


  const onSubmit = async () => {
    try {
      if (isConsumption) {
        setPurchaseExpired();
        updateCompanyConsumption(false);
      } else if (credit > 0 && !isConsumption){
        updateCompanyConsumption(true);
        purchaseConsumptionProduct();
      }

    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        aria-label='submit-activation'
        variant="contained"
        color="primary"
        sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
        disabled={credit <= 0}
      >
        {isConsumption ? 'Deactivate' : 'Activate'}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"WARNING!"}
        </DialogTitle>
        <DialogContent sx={{ mb: -2 }}>
          <DialogContentText>
            {isConsumption ? 'Deactivating this product will disable all chatbot messaging.' : 'Activating this product will enable chatbot messaging by consuming '}
            {!isConsumption && <Typography component="span"
fontWeight="bold">CREDIT.</Typography>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box sx={{ mt: 2, mb: 2, mr: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              aria-label='submit'
              onClick={onSubmit}
              autoFocus
              sx={{ mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
            >
              {isConsumption ? 'Deactivate' : 'Activate'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

ProductActivation.propTypes = {
  isConsumption: PropTypes.bool.isRequired,
  credit: PropTypes.number.isRequired,
  updateCompanyConsumption: PropTypes.func.isRequired,
  purchaseConsumptionProduct: PropTypes.func.isRequired,
};