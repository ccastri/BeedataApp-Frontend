import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SuccessSnackbar from '../../../settings/settings-success-msg';
import ErrorSnackbar from '../../../settings/settings-error-msg';
import api from '../../../../lib/axios';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
    },
    width: '33.33%',
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

export const PhonesTable = ({ columns, rows, updateRowStatus }) => {
    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setPopoverOpen(true);
    };

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    };

    const handleClickOpen = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleDisconnect = async (phoneId) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await api.put('/api/v1/whatsapp/business-account',
                {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { phoneNumberId: phoneId, departmentId: null }
                });
            if (response.data.success) {
                setResponseMessage(response.data.message);
                updateRowStatus(phoneId);
                handleClose();
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400, mb: 2 }}
                aria-label="customized table">
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
                            <StyledTableCell>{row.status}</StyledTableCell>
                            <StyledTableCell>
                                {row.status === 'Assigned' && (
                                    <>
                                        <IconButton aria-label="disconnect"
                                            onClick={handleClickOpen}
                                            onMouseEnter={handlePopoverOpen}
                                            onMouseLeave={handlePopoverClose}
                                        >
                                            <LinkOffIcon />
                                        </IconButton>
                                        <Popover
                                            id="mouse-over-popover"
                                            sx={{
                                                pointerEvents: 'none',
                                            }}
                                            open={popoverOpen}
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                                vertical: 'center',
                                                horizontal: 'center',
                                            }}
                                            transformOrigin={{
                                                vertical: 'center',
                                                horizontal: 'center',
                                            }}
                                            onClose={handlePopoverClose}
                                            disableRestoreFocus
                                        >
                                            <Typography sx={{ p: 1 }}>Disconnect</Typography>
                                        </Popover>
                                        <Dialog
                                            open={dialogOpen}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                {"Are You Sure?"}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Disconnecting the chatbot from this phone number will temporarily disable messaging with the chatbot.
                                                    You can always reconnect by assigning another phone number to the chatbot Social department.
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Box sx={{ mt: 2, mb: 2, mr: 2, display: "flex", justifyContent: "flex-end" }}>
                                                    <Button
                                                        onClick={handleClose}
                                                        variant="outlined"
                                                        sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleDisconnect(row.phoneId)}
                                                        autoFocus
                                                        sx={{ mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                                                    >
                                                        Disconnect
                                                    </Button>
                                                </Box>
                                            </DialogActions>
                                        </Dialog>
                                    </>
                                )}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            {responseMessage && (
                <SuccessSnackbar responseMessage={responseMessage}
                    container={'dialog'} />
            )}
            {errorMessage && (
                <ErrorSnackbar errorMessage={errorMessage}
                    container={'dialog'} />
            )}
        </TableContainer>
    );
};

PhonesTable.propTypes = {
    rows: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
};