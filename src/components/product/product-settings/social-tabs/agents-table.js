import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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


export const AgentsTable = ({ rows, onDeleteRow }) => {
    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'role', headerName: 'Role', width: 50 },
        { field: 'department', headerName: 'Department', width: 100 },
        { field: 'delete', headerName: 'Actions', width: 5 },
    ];
    
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400, mb: 3 }}
aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <StyledTableCell key={column.field}
width={column.width}>
                                {column.headerName}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell>{row.name}</StyledTableCell>
                            <StyledTableCell>{row.role}</StyledTableCell>
                            <StyledTableCell>{row.department}</StyledTableCell>
                            <StyledTableCell>
                                <IconButton aria-label="delete"
onClick={() => onDeleteRow(row)}>
                                    <DeleteIcon />
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

AgentsTable.propTypes = {
    rows: PropTypes.array.isRequired,
    onDeleteRow: PropTypes.func.isRequired,
};