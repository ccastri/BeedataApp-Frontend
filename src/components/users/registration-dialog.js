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
export const RegistrationDialog = ({ companyId, role }) => {
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
   const { token } = useContext(AuthContext);;

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    };

    const onSubmit = async (values) => {
        try {
            const response = await api.post('/api/v1/users/register', { values, isInvite: true }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                console.log(response.data);
                if (role === 'admin') {
                    const productId = 50;
                    const newCompanyId = response.data.user.company_id;
                    await api.post(`/api/v1/${newCompanyId}/products/${productId}`, { productQty: 10 }, { headers: { Authorization: `Bearer ${token}` } });
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
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"
                sx={{ '& .MuiPaper-root': { backgroundColor: '#F9FAFC' } }}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">
                            {role === 'admin' ? 'Register a New Company' : 'Register a New User'}
                        </Typography>
                        <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Card
                        sx={{
                            margin: 3,
                            padding: 3,
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #ccc'
                        }}
                    >
                        <CardContent>
                            <form onSubmit={formik.handleSubmit}>
                                <TextFieldWrapper
                                    label={role === 'admin' ? "Admin Name" : "Name"}
                                    name="fullName"
                                    formik={formik}
                                    autoFocus
                                />
                                {role === 'admin' && <TextFieldWrapper
                                    label="Company"
                                    name="company"
                                    formik={formik}
                                />}
                                <TextFieldWrapper
                                    label="Identification Type"
                                    name="identificationType"
                                    formik={formik}
                                    selectOptions={idTypes}
                                />
                                <TextFieldWrapper
                                    label="Identification Number"
                                    name="identificationNumber"
                                    formik={formik}
                                />
                                {role === 'admin' && <PhoneField
                                    label="Phone Number"
                                    name="phoneNumber"
                                    formik={formik}
                                />}
                                <TextFieldWrapper
                                    label="Email"
                                    name="email"
                                    formik={formik}
                                />
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
                </DialogContent>
            </Dialog>
            <Dialog
                open={!!successMessage}
                onClose={() => setSuccessMessage('')}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">
                            Email Sent Successfully!
                        </Typography>
                        <IconButton edge="end" color="inherit" onClick={() => setSuccessMessage('')} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText>
                        {successMessage}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
};