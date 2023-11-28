import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
    { field: 'idType', headerName: 'ID Type', width: 130 },
    { field: 'idNumber', headerName: 'ID Number', width: 160 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'role', headerName: 'Role', width: 130 },
    { field: 'status', headerName: 'Status', width: 200 }
];

export const UsersTable = ({ users, deleteUsers }) => {
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    const handleDelete = () => {
        if (rowSelectionModel.length > 0) {
            setOpenDialog(true);
        }
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = () => {
        deleteUsers(rowSelectionModel);
        setOpenDialog(false);
    };

    const rows = users.map((user) => ({
        id: user.id,
        idType: user.identification_type,
        idNumber: user.identification_number,
        name: user.name,
        role: user.role,
        status: 'Active',
    }));

    return (
        <>
            <Card>
                <CardHeader
                    subheader="Manage the users"
                    title="Users"
                    action={
                        <IconButton
                            onClick={handleDelete}
                        >
                            <Badge badgeContent={rowSelectionModel.length} color="error">
                                <DeleteIcon />
                            </Badge>
                        </IconButton>
                    }
                />
                <CardContent>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        onRowSelectionModelChange={(newSelection) => {
                            setRowSelectionModel(newSelection);
                        }}
                        rowSelectionModel={rowSelectionModel}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection={true}
                    />
                </CardContent>
                <Dialog
                    open={openDialog}
                    onClose={handleClose}
                >
                    <DialogTitle
                        id="alert-dialog-title"
                    >
                        Are You Sure?
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <DialogContentText>
                            Deleting a user will remove all user data and cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{ mb: 2, mr: 2, display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleConfirmDelete}
                                autoFocus
                                sx={{ mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </DialogActions>
                </Dialog>
            </Card>
        </>
    );
}