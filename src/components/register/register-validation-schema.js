import * as Yup from 'yup';

// Define a schema for string fields with optional max length and required validation
const stringField = (required, max) => Yup.string().max(max).required(required);

// Define email validation schema
const email = () =>
  Yup.string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required');


// const email = () => Yup.string().email('Must be a valid email').max(255).required('Email is required').test(
//   'company-email',
//   'Only company or institution email domains are allowed',
//   function (value) {
//     return /^[\w.%+-]+@([a-z0-9-]+\.)+[a-z]{2,}$/.test(value) && !/(gmail|outlook|hotmail|yahoo|icloud|aol|mail|zoho|gmx|inbox|yandex|ymail)/i.test(value);
//   }
// );
// const password = () => Yup.string()
//     .required('Password is required')
//     .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//         'Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
//     );

// Define a policy validation schema
const policy = () => Yup.boolean().oneOf([true], 'This field must be checked');


// Define a password validation schema to check if passwords match
const validatePassword = (password) =>
  Yup.string().required('Password is required').test(
    'password-match',
    'Passwords must match',
    function (value) {
      return this.parent.password === value;
    }
  );

// Define the schema for registration fields
const RegisterSchema = Yup.object().shape({
  fullName: stringField('Full name is required', 255).required("Full name is required"),
  company: stringField('Company name is required', 255).required("Company name is required"),
  identificationNumber: stringField('Identification number is required', 255)
  .matches(/^\d+$/, 'Must contain only numbers')
  .required("Identification number is required"),
  identificationType: stringField('Identification type is required', 255).required("Identification type is required"),
  phoneNumber: stringField('Phone number is required', 255)
  .required("Phone number is required"),
  email: email(),
  role: stringField('Role is required', 255).required("Role is required"),
  policy: policy().required("Accept terms and conditions is required"),
});

export default RegisterSchema;