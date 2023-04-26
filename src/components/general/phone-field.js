import React from 'react';
import { useState } from 'react';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

const PhoneField = ({ formik, name, label}) => {

  const [phone, setPhone] = useState('+57');
  const isValid = matchIsValidTel(phone);

  const handleChange = (value) => {
    setPhone(value);
    formik.setFieldValue(name, value);
 
    // Set formik error on invalid input
    if(!formik.errors[name] && isValid == false) {
      formik.setFieldError(name, 'Invalid phone number');
    }
  };

  return (
      <MuiTelInput
        name={name}
        label={label}
        value={phone}
        onBlur={formik.handleBlur}
        onChange={handleChange}
        error={Boolean(formik.touched[name] && formik.errors[name]) || ( formik.touched[name] && isValid === false )}
        helperText={
          (formik.touched[name] && formik.errors[name]) ||
          (formik.touched[name] && isValid === false && 'Invalid phone number')
        }
        fullWidth
        margin="normal"
        variant="outlined"
        defaultCountry="co"
      />
  );
};

export default PhoneField;
