import React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import TextFieldWrapper from '../general/textfield-wrapper';
import SuccessSnackbar from '../settings/settings-success-msg';
import api from '../../lib/axios';

const description = (
  <>
    To use our bots, you need to configure a WhatsApp Business Account. If you don&apos;t know how, you can follow{' '}
    <Link href="https://www.facebook.com/business/help/2087193751603668?id=2129163877102343"
      target="_blank"
      rel="noopener">
      this guide
    </Link>
    . We also need you to generate a system user token. If you don&apos;t know how, you can follow{' '}
    <Link href="https://www.facebook.com/business/help/503306463479099?id=2190812977867143&ref=search_new_1"
      target="_blank"
      rel="noopener">
      this guide
    </Link>
    .
  </>
);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }}
{...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export const WpConfigAccountDialog = () => {
  const [open, setOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (values) => {
    try {
      const token = localStorage.getItem('jwt');

      const wpAccountDetails = {
        waba_id: values.accountId,
        access_token: values.accessToken,
      };
      const response = await api.post('/api/v1/companies/update-company', wpAccountDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data && response.data.company) {
        setResponseMessage(response.data.message);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const formik = useFormik({
    initialValues: {
      accountId: '',
      accessToken: '',
    },
    validationSchema: Yup.object({
      accountId: Yup
        .string()
        .required('Required'),
      accessToken: Yup
        .string()
        .required('Required'),
    }),
    onSubmit
  });

  return (
    <>
      <Button 
        variant="contained"
        onClick={handleClickOpen}
        fullWidth
        sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
        >
        Configure Account
      </Button>
      <BootstrapDialog onClose={handleClose}
aria-labelledby="customized-dialog-title"
open={open}>
        <BootstrapDialogTitle
          sx={{ p: 2, fontSize: '1.6rem', backgroundColor: '#111827', color: '#FFFFFF' }}
          id="customized-dialog-title"
onClose={handleClose}
        >
          Configure WhatsApp Business Account
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1"
sx={{ mb: 2 }}>
            {description}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextFieldWrapper
              formik={formik}
              label="Account ID"
              name="accountId"
            />
            <TextFieldWrapper
              formik={formik}
              label="Access Token"
              name="accessToken"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button 
            autoFocus
            variant="outlined"
            onClick={formik.handleSubmit}
            sx={{ ml: 2, mr: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
          >
            Save Settings
          </Button>
          {responseMessage && (
            <SuccessSnackbar responseMessage={responseMessage} />
          )}
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

