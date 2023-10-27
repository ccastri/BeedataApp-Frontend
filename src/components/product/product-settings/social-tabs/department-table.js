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
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


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

export const DepartmentsTable = ({ departmentRows, handleDisconnect }) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const columns = [
        { field: 'department', headerName: 'Department' },
        { field: 'phone', headerName: 'Phone Number' },
        { field: 'status', headerName: 'Status' },
        { field: 'disconnect', headerName: 'Actions' },
    ];

    const handleClickOpen = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
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
                    {departmentRows.map((row, index) => (
                        <StyledTableRow key={`${row.id}-${index}`}>
                            <StyledTableCell>{row.department}</StyledTableCell>
                            <StyledTableCell>{row.phone}</StyledTableCell>
                            <StyledTableCell>{row.status}</StyledTableCell>
                            <StyledTableCell>
                                {row.status === 'Connected' && (
                                    <>
                                        <Tooltip title="Disconnect">
                                            <IconButton aria-label={`disconnect-button-${row.id}`}
                                                onClick={handleClickOpen}
                                            >
                                                <LinkOffIcon />
                                            </IconButton>
                                        </Tooltip>
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
                                                    Disconnecting the chatbot department from this phone number will temporarily disable messaging with the chatbot.
                                                    You can always reconnect by assigning a phone number to a Social department.
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
                                                        data-testid={`disconnect-button-${row.id}`}
                                                        onClick={() => handleDisconnect(row.phoneId, row.phone, row.department, row.departmentId)}
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
        </TableContainer>
    );
};

DepartmentsTable.propTypes = {
    departmentRows: PropTypes.array.isRequired,
    handleDisconnect: PropTypes.func.isRequired,
};
