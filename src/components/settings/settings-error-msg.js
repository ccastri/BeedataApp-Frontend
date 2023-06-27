import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const ErrorSnackbar = ({errorMessage, container}) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
    >
      <Alert 
        severity='error'
        sx={{
          width: '100%',
          backgroundColor:  container === 'dialog'
          ? 'rgb(236, 205, 180, 0.9)' : 'rgba(244, 132, 132, 0.7)',
          color: 'rgb(0, 0, 0)',
          fontSize: '1.0rem',
        }}
      >
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}

export default ErrorSnackbar;