import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextFieldWrapper from '../general/textfield-wrapper';
import { Wompi } from './wompi';


export const CreditForm = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
        amountToAdd: 0,
        },
        validationSchema: Yup.object({
        amountToAdd: Yup.number()
            .required('Required')
            .min(0, 'The amount cannot be negative.'),
        }),
        onSubmit: (values) => {
        console.log(values);
        },
    });

    useEffect(() => {
        if (formik.isValid) {
            formik.submitForm();
        }
    }, [formik.values.amountToAdd]);

    return (
        <>
          <Button 
            variant="contained"
            fullWidth
            size="large"
            onClick={handleClickOpen}
          >
            Add Credit
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Credit Amount</DialogTitle>
            <DialogContent>
            <DialogContentText>
              Please, enter the amount you want to add to your balance.
            </DialogContentText>
              <form onSubmit={formik.handleSubmit}>
                <TextFieldWrapper
                    formik={formik}
                    label="Amount to add"
                    type="number"
                    id="amountToAdd"
                    name="amountToAdd"
                    error={formik.touched.amountToAdd && Boolean(formik.errors.amountToAdd)}
                    helperText={formik.touched.amountToAdd && formik.errors.amountToAdd}
                />
             </form>
             <Wompi amountInCents={formik.values.amountToAdd * 100} reference="123456" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        </>
    );
};
