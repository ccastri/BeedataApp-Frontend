import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import { createValidationSchema } from '../register/register-validation-schema';
import { AuthContext } from '../../contexts/auth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextFieldWrapper from '../general/textfield-wrapper';
import PhoneField from '../register/phone-field';
import api from '../../lib/axios';

const idTypes = [
    { value: 'CC', label: 'Cédula de ciudadanía' },
    { value: 'CE', label: 'Cédula de extranjería' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'TI', label: 'Tarjeta de identidad' },
    { value: 'NIT', label: 'Número de identificación tributaria (NIT)' },
];

const CustomDialog = ({ open, handleClose, title, children }) => (
    <Dialog
    open={open}
    onClose={handleClose}
    fullWidth
    maxWidth="sm"
    sx={{ '& .MuiPaper-root': { backgroundColor: '#F9FAFC' } }}>
        <DialogTitle
        sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Avatar src={'/static/beet_nb.svg'}
                sx={{ width: 60, height: 60 }} />
                <Typography variant="h5">{title}</Typography>
                <IconButton onClick={handleClose}
                aria-label="close"
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>{children}</DialogContent>
    </Dialog>
);

const createHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const RegistrationDialog = ({ companyId, role }) => {
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { token } = useContext(AuthContext);

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    };

    const onSubmit = async (values) => {
        try {
            const response = await api.post('/api/v1/users/register', { values, isInvite: true }, createHeaders(token));
            if (response.data.success) {
                if (role === 'admin') {
                    const productId = 50;
                    const newCompanyId = response.data.user.company_id;
                    await api.post(`/api/v1/${newCompanyId}/products/${productId}`, { productQty: 10 }, createHeaders(token));
                }
                setSuccessMessage(`The email has been successfully sent to: ${values.email}`);
                handleClose();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const formik = useFormik({
        initialValues: {
            fullName: '',
            company: role === 'admin' ? '' : companyId,
            identificationType: '',
            identificationNumber: '',
            phoneNumber: role === 'admin' ? '' : undefined,
            email: '',
            role: role,
            partnerId: role === 'admin' ? companyId : undefined,
        },
        validationSchema: createValidationSchema(['fullName', 'identificationType', 'identificationNumber', 'email'].concat(role === 'admin' ? ['company', 'phoneNumber'] : [])),
        onSubmit: onSubmit,
    });

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setOpen(true)}
            >
                {role === 'admin' ? 'Invite Company' : 'Invite User'}
            </Button>
            <CustomDialog open={open}
            handleClose={() => setOpen(false)}
            title={role === 'admin' ? 'Register a New Company' : 'Register a New User'}>
                <Card
                    sx={{
                        margin: 3,
                        padding: 3,
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #ccc',
                    }}
                >
                    <CardContent>
                        <form onSubmit={formik.handleSubmit}>
                            {['fullName', 'identificationType', 'identificationNumber', 'phoneNumber', 'email'].map((field) => (
                                field === 'phoneNumber' ?
                                    <PhoneField
                                        key={field}
                                        label={field}
                                        name={field}
                                        formik={formik}
                                    /> :
                                    <TextFieldWrapper
                                        key={field}
                                        label={field}
                                        name={field}
                                        formik={formik}
                                        selectOptions={field === 'identificationType' ? idTypes : undefined}
                                    />
                            ))}
                            {role === 'admin' &&
                                <TextFieldWrapper
                                    key='company'
                                    label='company'
                                    name='company'
                                    formik={formik}
                                />
                            }
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={!formik.isValid}
                                    sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                                >
                                    Invite
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </CustomDialog>
            <CustomDialog open={!!successMessage}
            handleClose={() => setSuccessMessage('')}
            title="Email Sent Successfully!">
                <DialogContentText sx={{ margin: 2, fontSize: '1.2rem' }}>{successMessage}</DialogContentText>
            </CustomDialog>
        </>
    );
};
