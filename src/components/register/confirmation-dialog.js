import React from 'react';
import { useState } from 'react';
import { 
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Typography
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export const ResponsiveDialog = ({formikValues, onSubmit}) => {

    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                color="primary"
                fullWidth
                size="large"
                variant="contained"
                onClick={handleClickOpen}
            >
                Sign Up Now
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Confirm Your Information"}
                </DialogTitle>
                <Divider />
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 5
                    }}
                >
                    <DialogContentText>
                        <Typography sx={{ width: '100%', marginBottom: 2 }}>
                            <span style={{fontWeight: 'bold'}}>First Name: </span> {formikValues.fullName}
                        </Typography>
                        <Typography sx={{ width: '100%', marginBottom: 2 }}>
                            <span style={{fontWeight: 'bold'}}>Company Name: </span> {formikValues.company}
                        </Typography>
                        <Typography sx={{ width: '100%', marginBottom: 2 }}>
                            <span style={{fontWeight: 'bold'}}>{formikValues.identificationType}: </span> {formikValues.identificationNumber}
                        </Typography>
                        <Typography sx={{ width: '100%', marginBottom: 2 }}>
                            <span style={{fontWeight: 'bold'}}>Phone Number: </span> {formikValues.phoneNumber}
                        </Typography>
                        <Typography sx={{ width: '100%', marginBottom: 2 }}>
                            <span style={{fontWeight: 'bold'}}>Email: </span> {formikValues.email}
                        </Typography>
                        <Typography sx={{ width: '100%', marginBottom: 2 }}>
                            <span style={{fontWeight: 'bold'}}>Role: </span> {formikValues.role}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    margin: '0 1rem 0'
                }}>
                    <Button
                        color="primary"
                        autoFocus
                        onClick={handleClose}
                        fullWidth
                        variant="contained"
                    >
                        Edit
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            onSubmit();
                            handleClose();
                        }}
                        fullWidth
                        autoFocus
                        variant="contained"
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
