import React, { useState, useRef, useEffect } from 'react';
import { FbSignupFlow2 } from '../fb-signup-flow2';
import { PhoneDeleteTable } from './phones-table-deletion';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import FacebookIcon from '@mui/icons-material/Facebook';
import CloseIcon from '@mui/icons-material/Close';



export const PermissionChange = ({ rows, deleteRow }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <>
            <Button
                autoFocus
                variant="contained"
                sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                endIcon={<FacebookIcon />}
                onClick={handleClickOpen()}
                data-testid="change-permissions-button"
            >
                Connect Phone Number
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll='paper'
                maxWidth='md'
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DialogTitle
                        id="scroll-dialog-title"
                        sx={{ mb: -1, mt: 2, textAlign: 'left' }}
                    >
                        Remove Permissions
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 6,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent dividers={scroll === 'paper'}
                    sx={{ padding: '15px', textAlign: 'center' }}>
                    <DialogContentText
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        sx={{ mb: 2, ml: 1, textAlign: 'left' }}
                    >
                        You can remove granted permissions to Beet at any time.
                        This is not required, but it is recommended if you no longer want Beet
                        to have access to certain information or resources.
                    </DialogContentText>
                    <Stack direction="column"
sx={{ width: '100%', mb: 2 }}>
                        <Alert severity="info"
sx={{ width: '100%', mb: 2 }}>
                            <strong>Important:</strong> Assigned phone numbers will not be deleted.
                        </Alert>
                        <PhoneDeleteTable rows={rows}
deleteRow={deleteRow} />
                    </Stack>
                    <DialogTitle sx={{ ml: -2, mb: 1, mt: 2, textAlign: 'left' }}>
                        Change META Permissions
                    </DialogTitle>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <DialogContentText
                            ref={descriptionElementRef}
                            tabIndex={-1}
                            sx={{ mb: 2, ml: 1, textAlign: 'left' }}
                        >
                            If you want to reset
                            the META permission, you can follow the Facebook flow by clicking the
                            &ldquo;Permissions&rdquo; button below and going through the signup process again.
                        </DialogContentText>
                    </Box>
                </DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <DialogActions sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <FbSignupFlow2 title={'Connect Phone Number'} />
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                sx={{ ml: 2, mr: 2, mt: 2, mb: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
};

PermissionChange.propTypes = {
    rows: PropTypes.array.isRequired,
    deleteRow: PropTypes.func.isRequired,
};