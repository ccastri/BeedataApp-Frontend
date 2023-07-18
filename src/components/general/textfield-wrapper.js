import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const TextFieldWrapper = ({ formik, name, autoComplete, label, type = "text", selectOptions = [], inputProps }) => {
  const isSelect = selectOptions.length > 0;
  return (
    <TextField
      error={Boolean(formik.touched[name] && formik.errors[name])}
      fullWidth
      helperText={formik.touched[name] && formik.errors[name]}
      label={label}
      margin="normal"
      name={name}
      autoComplete={autoComplete ? autoComplete : 'on'}
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      type={type}
      value={formik.values[name]}
      variant="outlined"
      {...inputProps && { InputProps: inputProps }}
      {...isSelect && {
        select: true,
        SelectProps: {
          MenuProps: {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left"
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left"
            },
          }
        }
      }}
    >
      { isSelect && selectOptions.map(option => (
        <MenuItem key={option.value}
value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default TextFieldWrapper;
