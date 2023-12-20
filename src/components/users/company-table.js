import React, { useState, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Company', width: 200 },
    { field: 'contact-1', headerName: 'Contact 1', width: 170 },
    { field: 'email-1', headerName: 'Email', width: 200 },
    { field: 'contact-2', headerName: 'Contact 2', width: 170 },
    { field: 'email-2', headerName: 'Email', width: 200 },
];

export const CompanyTable = ({ partners, admins, deleteCompanies }) => {
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
        deleteCompanies(rowSelectionModel);
        setOpenDialog(false);
    };

    const prepareData = () => {
        return partners.map((partner, index) => {
            const sortedAdmins = admins[index].sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
            const contact1 = sortedAdmins[0] || {};
            const contact2 = sortedAdmins[1] || {};
            return {
                id: partner.id,
                name: partner.name,
                'contact-1': contact1.name || '',
                'email-1': contact1.email || '',
                'contact-2': contact2.name || '',
                'email-2': contact2.email || '',
            };
        });
    };

    const rows = prepareData();

    return (
        <>
            <Card>
                <CardHeader
                    subheader="Manage the partners"
                    title="Partners"
                    action={
                        <IconButton
                            onClick={handleDelete}
                        >
                            <Badge badgeContent={rowSelectionModel.length}
color="error">
                                <DeleteIcon />
                            </Badge>
                        </IconButton>
                    }
                />
                <Box sx={{ mb: 2, mr: 2, ml: 2}}>
                    <Alert severity="info">
                    This section is only visible for <Typography component="span"
style={{ fontWeight: 'bold' }}>Partners</Typography>
                    </Alert>
                </Box>
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
                        Deleting a company will remove all company data and cannot be undone.
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
        </Card >
        </>
    );
}