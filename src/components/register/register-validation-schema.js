import * as Yup from 'yup';

const fields = {
  fullName: Yup.string().max(255).required('Full name is required'),
  company: Yup.string().max(255).required('Company name is required'),
  identificationNumber: Yup.string().max(255)
    .matches(/^\d+$/, 'Must contain only numbers')
    .required('Identification number is required'),
  identificationType: Yup.string().max(255).required('Identification type is required'),
  phoneNumber: Yup.string().max(255).required('Phone number is required'),
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required').test(
    'company-email',
    'Only company or institution email domains are allowed',
    function (value) {
      return /^[\w.%+-]+@([a-z0-9-]+\.)+[a-z]{2,}$/.test(value) && !/(gmail|outlook|hotmail|yahoo|icloud|aol|mail|zoho|gmx|inbox|yandex|ymail)/i.test(value);
    }
  ),
  role: Yup.string().max(255).required('Role is required'),
  policy: Yup.boolean().oneOf([true], 'This field must be checked').required('Accept terms and conditions is required'),
};

export const createValidationSchema = (fieldNames) => {
  const schemaFields = {};
  fieldNames.forEach((fieldName) => {
    if (fields[fieldName]) {
      schemaFields[fieldName] = fields[fieldName];
    }
  });
  return Yup.object().shape(schemaFields);
};