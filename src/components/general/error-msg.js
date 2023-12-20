import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const ErrorSnackbar = ({errorMessage, variant, anchorOrigin, sx}) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={anchorOrigin ? anchorOrigin :
        { vertical: 'top', horizontal: 'left' }
      }
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert 
        severity='error'
        variant={variant ? variant : 'standard'}
        sx={{
          width: '100%',
          ...sx
        }}
      >
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}

export default ErrorSnackbar;