import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
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
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setSelectedButton(null);
    };

    const open = Boolean(anchorEl);

    const handleDisconnect = async (event, phoneId) => {
        event.stopPropagation();
        setSelectedButton(event.currentTarget);
        try {
            const token = localStorage.getItem('jwt');
            const response = await api.put('/api/v1/whatsapp/business-account',
                {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { phoneNumberId: phoneId, departmentId: null }
                });
            if (response.data.success) {
                setResponseMessage(response.data.message);
                updateRowStatus(phoneId)
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
                                    <IconButton aria-label="disconnect"
                                        onMouseEnter={handlePopoverOpen}
                                        onMouseLeave={handlePopoverClose}
                                        onClick={(event) => handleDisconnect(event, row.phoneId)}
                                    >
                                        <LinkOffIcon />
                                    </IconButton>
                                )}
                                <Popover
                                    id="mouse-over-popover"
                                    sx={{
                                        pointerEvents: 'none',
                                    }}
                                    open={open && selectedButton === event.currentTarget}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    onClose={handlePopoverClose}
                                    disableRestoreFocus
                                >
                                    <Typography sx={{ p: 1 }}>
                                        Disconnect
                                    </Typography>
                                </Popover>
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