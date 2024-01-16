import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
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
  const { children, onClose, avatar, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }}
{...other}>
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        {avatar}
        <Typography
          sx={{ ml: 2 }}
          variant="h5"
        >
          {children}
        </Typography>
      </Box>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={() => onClose(null, 'closeButton')}
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
  avatar: PropTypes.element.isRequired,
};

export function CredentialDialog(props) {
  const { user, openCredentials, onClose } = props;
  const router = useRouter();

  const handleOnClick = () => {
    router.push('/');
  };

  const handleClose = (event, reason) => {
    if (reason === 'closeButton') {
      onClose();
    }
  };

  const avatar = (
    <Avatar src={'/static/beet_nb.svg'} />
  );

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openCredentials}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          sx={{ ml: 2, mr: 2, p: 2, fontSize: '1.9rem' }}
          avatar={avatar}
        >
          Thank you for registering with us!
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            The following credentials will be prompt to you only once.
            Please save them in a safe place.
            If you lose them, please contact the Beet team for assistance.
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
            <span style={{fontWeight: 'bold'}}>Password: </span> {user.display_pwd}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
          autoFocus
          onClick={handleOnClick}
          variant="outlined"
          sx={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
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