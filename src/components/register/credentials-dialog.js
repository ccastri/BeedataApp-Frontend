import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { decryptPwd } from '../../utils/decrypt-pwd';
import { useRouter } from 'next/router';

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

export function CredentialDialog(props) {
  const { user, openCredentials, onClose } = props;
  const router = useRouter();

  const handleOnClick = () => {
    router.push('/');
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openCredentials}
      >
        <BootstrapDialogTitle id="customized-dialog-title"
onClose={handleClose}>
          Thank you for registering with us!
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            The following credentials will be prompt to you only once.
            Please save them in a safe place.
            If you lose them, please contact the Beedata team for assistance.
          </Typography>
          <Typography sx={{ width: '100%', marginBottom: 2 }}
gutterBottom>
            <span style={{fontWeight: 'bold'}}>Your credentials are: </span>
          </Typography>
          <Typography sx={{ width: '100%', marginBottom: 2 }}
gutterBottom>
            <span style={{fontWeight: 'bold'}}>Email: </span> {user.email}
          </Typography>
          <Typography gutterBottom>
            <span style={{fontWeight: 'bold'}}>Password: </span> {decryptPwd(user.encrypted_pwd)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
          autoFocus
          onClick={handleOnClick}
          variant="outlined"
          >
            Sign in Now
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

CredentialDialog.propTypes = {
  user: PropTypes.object.isRequired,
  openCredentials: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}