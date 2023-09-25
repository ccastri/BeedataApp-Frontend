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
import useMediaQuery from '@mui/material/useMediaQuery';
import api from '../../lib/axios';
import SuccessSnackbar from '../settings/settings-success-msg';
import ErrorSnackbar from '../settings/settings-error-msg';


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

/** 
 * 
 * ProductActivation component that displays Beet's available products for activation.
 * 
 * Dependencies: useState, useEffect, useMediaQuery, api, SuccessSnackbar, ErrorSnackbar,
 *              styled, Box, Card, CardMedia, CardContent, Typography, Dialog, DialogContent,
 *             DialogActions, Grid, Button.
 * 
 * @param {Object} props Component props
 * 
 * @returns {JSX.Element} JSX.Element
 * 
 * Usage: Used to display Beet's available products for activation.
*/
export const ProductActivation = (props) => {
  const { name, image, description } = props;
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('jwt');

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setResponseMessage('');
    setErrorMessage('');
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/companies/company', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.company.credit_msg_consumption) {
          setIsActive(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token]);

  const updateCompanyConsumption = async (newStatus) => {
    try {
      const updateInfo = newStatus ? Date.now() : null;
      const updatedCompany = await api.put('/api/v1/companies/update-company', { creditMsgConsumption: updateInfo }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (updatedCompany.status === 200) {
        setIsActive(newStatus);
        setResponseMessage(isActive ? 'Product deactivated' : 'Product activated');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    try {
      const response = await api.get('/api/v1/companies/company', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const companyCredit = response.data.company.credit;

      if (companyCredit === 0) {
        setErrorMessage('Insufficient credit');
      } else {
        if (isActive) {
          updateCompanyConsumption (false);
        } else {
          updateCompanyConsumption (true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        fullWidth
        color="secondary"
        sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
      >
        {isActive ? 'Deactivate' : 'Activate'}
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
                  <Typography variant="subtitle2"
                    color="text.secondary">
                    {description}
                  </Typography>
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
              minHeight: isSmallScreen ? '40vh' : isMediumScreen ? '35vh' : '20vh',
              maxHeight: isSmallScreen ? '30vh' : isMediumScreen ? '35vh' : '25vh'
            }}
            >
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
                onClick={onSubmit}
                fullWidth
                color="secondary"
                sx={{ mb: 2, mt: 1, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
              >
                {isActive ? 'Deactivate' : 'Activate'}
              </Button>
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
