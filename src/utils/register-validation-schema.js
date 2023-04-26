import * as Yup from 'yup';

const stringField = (required, max) => Yup.string().max(max).required(required);
const email = () => Yup.string().email('Must be a valid email').max(255).required('Email is required');
const password = () => Yup.string()
    .required('Password is required')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
    );
const policy = () => Yup.boolean().oneOf([true], 'This field must be checked');

// Check if Register paswords match

const validatePassword = (password) => {
    return Yup.string().required('Password is required').test(
      'password-match',
      'Passwords must match',
      function (value) {
        return this.parent.password === value;
      }
    );
  }

  // Validate registration fields when these have been 
  // filled out in email registration method.

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