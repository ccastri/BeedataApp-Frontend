import React, { useEffect } from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import { FbSignupFlow } from './fb-signup-flow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import TextFieldWrapper from '../general/textfield-wrapper';
import api from '../../lib/axios';


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
    <DialogTitle sx={{ ml: 2, mr: 2, p: 2 }}
      {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 4,
            top: 12,
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

/**
 * This component should allow user add more whatsapp business accounts,
 * update current system access token and have the facebook flow available if 
 * access to new apps is needed.
 * 
 */
export const WpConfigAccountDialog = () => {

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [wabas, setWabas] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  // Manage token visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const token = localStorage.getItem('jwt');

  // Update the user's company access token or add a new waba ID with its phone number ID
  const onSubmit = async (values) => {
    if (values.systemUserAccessToken !== '' && values.systemUserAccessToken !== formik.values.systemUserAccessToken) {
      try {
        await api.post('/api/v1/companies/update-company', { systemUserAccessToken: values.systemUserAccessToken }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (values.whatsappBusinessAccountID !== '' && values.phoneNumberID !== '') {
      try {
        await api.post('/api/v1/whatsapp/wabas', { wabaID: values.whatsappBusinessAccountID, phoneNumberID: values.phoneNumberID }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      } catch (err) {
        console.error(err);
      }
    }

    // Reload the page
    window.location.reload();
  };
  
  const formik = useFormik({
    initialValues: {
      systemUserAccessToken: '',
      whatsappBusinessAccountID: '',
      phoneNumberID: '',
    },
    validationSchema: Yup.object({
      systemUserAccessToken: Yup
        .string(),
      whatsappBusinessAccountID: Yup
        .string(),
      phoneNumberID: Yup
        .string()
    }),
    onSubmit,
  });

  // Get the current user's company access token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/companies/company', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data && response.data.company) {
          const company = response.data.company;

          // Check if access token field is not empty
          if (company.access_token) {
            formik.setFieldValue('systemUserAccessToken', company.access_token);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [token, formik]);

  // Get user's current company waba IDs and phone numbers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/whatsapp/wabas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.data && response.data.wabas) {
          setWabas(response.data.wabas)
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [token]);

  const handleDelete = async (wabaID, phoneNumberID) => {
    try {
      const response = await api.delete('/api/v1/whatsapp/wabas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          wabaID: wabaID,
          phoneNumberID: phoneNumberID
        }
      });
      console.log(response)
      // Remove the row from the grid
      setWabas(prevWabas => prevWabas.filter(waba => waba.waba_id !== wabaID));

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        fullWidth
        sx={{ ml: 4, mr: 4, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
      >
        Configure Account
      </Button>
      <BootstrapDialog onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        <BootstrapDialogTitle
          sx={{ p: 2, fontSize: '1.6rem', backgroundColor: '#111827', color: '#FFFFFF' }}
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Configure WhatsApp Business Account
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography
            sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
            variant="subtitle2"
          >
            System User Access Token
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
            sx={{ ml: 1, mb: 2 }}
          >
            Token generated by the Facebook Login for Business flow with allowed permissions.
          </Typography>
          <TextFieldWrapper
            formik={formik}
            name="systemUserAccessToken"
            label="System User Access Token"
            type={showPassword ? 'text' : 'password'}
            autoComplete="off"
            inputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: '100%' }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
              mr: 0,
              ml: 'auto',
            }}
          >
            <Button
              autoFocus
              onClick={formik.handleSubmit}
              variant="outlined"
              sx={{ ml: 2, mr: 2, mb: 2, mt: 1, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
            >
              Save
            </Button>
          </Box>
          <Typography
            sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
            variant="subtitle2"
          >
            WhatsApp Business Account Information
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
            sx={{ ml: 1, mb: 2 }}
          >
            Add or remove WhatsApp Business Accounts (WABAs) used by bots.
          </Typography>
          <Box sx={{ mt: 2 }}>
            {wabas.length === 0 ? (
              <Typography
                align="center"
                color="textSecondary"
                sx={{ ml: 1, mb: 2, fontSize: '1.2rem' }}
                variant="subtitle2"
              >
                Currently there are no WhatsApp Business Accounts added
              </Typography>
            ) : (
              wabas.map((waba, index) => (
                <Grid
                  key={index}
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Grid item
                    xs={6}>
                    <Typography
                      color="textSecondary"
                      sx={{ ml: 2 }}
                    >
                      {waba.waba_id}
                    </Typography>
                  </Grid>
                  <Grid item
                    xs={5}>
                    <Typography
                      color="textSecondary"
                    >
                      {waba.phone_id}
                    </Typography>
                  </Grid>
                  <Grid item
                    xs={1}>
                    <IconButton
                      aria-label="delete"
                      sx={{ ml: -2 }}
                      onClick={() => handleDelete(waba.waba_id, waba.phone_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            )}
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Grid item
                xs={6}>
                <TextFieldWrapper
                  formik={formik}
                  label="WhatsApp Business Account ID"
                  name="whatsappBusinessAccountID"
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item
                xs={6}>
                <TextFieldWrapper
                  formik={formik}
                  label="Phone Number ID"
                  name="phoneNumberID"
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2,
                mr: 0,
                ml: 'auto',
              }}
            >
              <Button
                onClick={formik.handleSubmit}
                autoFocus
                variant="outlined"
                sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
              >
                Add
              </Button>
            </Box>
          </Box>
          <Typography
            sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
            variant="subtitle2"
          >
            Permissions
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
            sx={{ ml: 1, mb: 2 }}
          >
            Change the permissions granted to Beet on Facebook.
            This will generate a new system user token automatically.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
              mr: 0,
              ml: 'auto',
            }}
          >
            <FbSignupFlow title={'Add Permissions'} />
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

