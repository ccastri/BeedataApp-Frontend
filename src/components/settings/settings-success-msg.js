import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const SuccessSnackbar = ({responseMessage}) => {
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
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
    >
      <Alert severity='success' sx={{ width: '100%' }}>
        {responseMessage}
      </Alert>
    </Snackbar>
  );
}

export default SuccessSnackbar;