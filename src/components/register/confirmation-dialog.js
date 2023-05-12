import React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(4),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(3),
    },
}));

export const ResponsiveDialog = ({formikValues, onSubmit}) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
          <Button
            color="primary"
            fullWidth
            size="large"
            variant="contained"
            onClick={handleClickOpen}
          >
            Sign Up Now
          </Button>
          <BootstrapDialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="responsive-dialog-title">
              {"Confirm Your Information"}
            </DialogTitle>
            <Divider />
            <DialogContent dividers>
              <Typography sx={{ width: '100%', marginBottom: 2 }}>
                <span style={{fontWeight: 'bold'}}>Name: </span> {formikValues.fullName}
              </Typography>
              <Typography sx={{ width: '100%', marginBottom: 2 }}>
                <span style={{fontWeight: 'bold'}}>Company Name: </span> {formikValues.company}
              </Typography>
              <Typography sx={{ width: '100%', marginBottom: 2 }}>
                <span style={{fontWeight: 'bold'}}>{formikValues.identificationType}: </span> {formikValues.identificationNumber}
              </Typography>
              <Typography sx={{ width: '100%', marginBottom: 2 }}>
                <span style={{fontWeight: 'bold'}}>Phone Number: </span> {formikValues.phoneNumber}
              </Typography>
              <Typography sx={{ width: '100%', marginBottom: 2 }}>
                <span style={{fontWeight: 'bold'}}>Email: </span> {formikValues.email}
              </Typography>
              <Typography sx={{ width: '100%', marginBottom: 2 }}>
                <span style={{fontWeight: 'bold'}}>Role: </span> {formikValues.role}
              </Typography>
            </DialogContent>
            <DialogActions sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 2,
              margin: '0 1rem 0'
            }}>
              <Button
                color="primary"
                autoFocus
                onClick={handleClose}
                fullWidth
                variant="contained"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  onSubmit();
                  handleClose();
                }}
                fullWidth
                autoFocus
                variant="outlined"
              >
                Submit
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </div>
    );
}
