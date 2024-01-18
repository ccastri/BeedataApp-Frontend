import React, { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { CompanyContext } from '../../../../contexts/company';
import { AuthContext } from '../../../../contexts/auth';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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

export const PhonesTable = ({ rows, updateWabas }) => {
    const { companyId } = useContext(CompanyContext);
    const { token } = useContext(AuthContext);

    const columns = [
        { field: 'waba', headerName: 'Whatsapp Bussiness ID' },
        { field: 'phone', headerName: 'Phone Number' },
        { field: 'status', headerName: 'Status' },
        { field: 'action', headerName: 'Action' }
    ];

    const handleConnection = async (row) => {
            try {
                const response = await api.post(`/api/v1/${companyId}/chatwoot/inbox`, { data: row }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    updateWabas(row.phoneId, response.data.inboxId);
                }
            } catch (error) {
                console.error(error);
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
                                <Button
                                    variant='outlined'
                                    color='primary'
                                    sx={{ mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                                    onClick={() => handleConnection(row)}
                                    disabled={row.status === 'Assigned'}
                                >
                                    Connect
                                </Button>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

PhonesTable.propTypes = {
    rows: PropTypes.array.isRequired,
    updateWabas: PropTypes.func.isRequired,
};