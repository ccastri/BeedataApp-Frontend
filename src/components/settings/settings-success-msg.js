import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const SuccessSnackbar = ({responseMessage, container}) => {
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
      <Alert severity='success'
        sx={{
          width: '100%',
          backgroundColor: container === 'dialog'
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(76, 175, 80, 0.3)',
        }}
        >
        {responseMessage}
      </Alert>
    </Snackbar>
  );
}

export default SuccessSnackbar;