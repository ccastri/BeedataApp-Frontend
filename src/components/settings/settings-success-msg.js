import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const SuccessSnackbar = ({ responseMessage, variant, anchorOrigin, sx }) => {
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
        { vertical: 'top', horizontal: 'center' }
      }
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert severity='success'
        variant={variant ? variant : 'standard'}
        sx={{
          width: '100%',
          ...sx
        }}
      >
        {responseMessage}
      </Alert>
    </Snackbar>
  );
}

export default SuccessSnackbar;