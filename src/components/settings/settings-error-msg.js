import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const ErrorSnackbar = ({errorMessage}) => {
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
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
    >
      <Alert severity='error' sx={{ width: '100%', backgroundColor: 'rgba(76, 175, 80, 0.3)' }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}

export default ErrorSnackbar;