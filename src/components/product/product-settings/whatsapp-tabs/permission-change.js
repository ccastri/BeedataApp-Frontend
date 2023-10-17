import React, { useState, useRef, useEffect } from 'react';
import { FbSignupFlow } from '../fb-signup-flow';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FacebookIcon from '@mui/icons-material/Facebook';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SuccessSnackbar from '../../../settings/settings-success-msg';
import ErrorSnackbar from '../../../settings/settings-error-msg';
import api from '../../../../lib/axios';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
    },
    width: '42%',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const PermissionChange = ({ rows, deleteRow }) => {
    const [open, setOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const columns = [
        { field: 'waba', headerName: 'Whatsapp Bussiness ID' },
        { field: 'phone', headerName: 'Phone Number' },
        { field: 'actions', headerName: 'Actions' },
    ];

    const handleClickOpen = () => () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setResponseMessage('');
        setErrorMessage('');
    };

    const handleDelete = async (row) => {
        try {
            setResponseMessage('');
            setErrorMessage('');

            if (row.status === 'Assigned') {
                setErrorMessage('You cannot delete an assigned phone number');
                return;
            };

            const token = localStorage.getItem('jwt');
            const response = await api.delete('/api/v1/whatsapp/business-account',
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { phoneId: row.phoneId },
                });
            if (response.data.success) {
                setResponseMessage(response.data.message);
                deleteRow(row.phoneId);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
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
            >
                Permissions
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll='paper'
                maxWidth='md'
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <DialogTitle id="scroll-dialog-title" sx={{ mb: 2 }}>
                        Manage Permissions
                    </DialogTitle>
                    <DialogContent dividers={scroll === 'paper'} sx={{ padding: '20px', textAlign: 'center' }}>
                        <DialogContentText
                            ref={descriptionElementRef}
                            tabIndex={-1}
                            sx={{ mb: 4, textAlign: 'left' }}
                        >
                            You can delete granted permissions to Beet at any time.
                            This is not required, but it is recommended if you no longer want Beet
                            to have access to certain information or resources.
                        </DialogContentText>
                        <TableContainer component={Paper} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Table sx={{ minWidth: 400, mb: 2 }}>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <StyledTableCell key={column.field}>
                                                {column.headerName}
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell>{row.wabaId}</StyledTableCell>
                                            <StyledTableCell>{row.phone}</StyledTableCell>
                                            <StyledTableCell>
                                                <IconButton
                                                    onClick={() => handleDelete(row)}
                                                >
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {responseMessage && (
                            <SuccessSnackbar responseMessage={responseMessage} />
                        )}
                        {errorMessage && (
                            <ErrorSnackbar errorMessage={errorMessage}
                                container={'dialog'} />
                        )}
                        <DialogTitle sx={{ mt: 6 }}>
                            Change META Permissions
                        </DialogTitle>
                        <DialogContentText
                            ref={descriptionElementRef}
                            tabIndex={-1}
                            sx={{ mb: 2, textAlign: 'left' }}
                        >
                            If you want to reset
                            the META permission, you can follow the Facebook flow by clicking the
                            "Permissions" button below and going through the signup process again.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <FbSignupFlow title={'Permissions'} />
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
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
};