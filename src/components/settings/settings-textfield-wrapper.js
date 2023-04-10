import React from 'react';
import { TextField } from '@mui/material';

const TextFieldWrapper = ({ formik, name, label, type = "text", inputProps }) => (
    <TextField
      error={Boolean(formik.touched[name] && formik.errors[name])}
      fullWidth
      helperText={formik.touched[name] && formik.errors[name]}
      label={label}
      margin="normal"
      name={name}
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      type={type}
      value={formik.values[name]}
      variant="outlined"
      {...inputProps && { InputProps: inputProps }}
    />
  );
  

export default TextFieldWrapper;

