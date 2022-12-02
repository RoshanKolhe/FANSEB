import * as yup from 'yup';

export const shopValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  balance: yup.object().shape({
    payment_info: yup.object().shape({
      name: yup.string().required('Account name is required'),
      email: yup
        .string()
        .typeError('form: error-email-string')
        .email('form:error-email-format')
        .required('form:error-email-required'),
      account: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('required'),
      bank: yup.string().required('Bank name is required'),
    }),
  }),
  address: yup.object().shape({
    country: yup.string().required('Country Name is required'),
    city: yup.string().required('City Name is required'),
    state: yup.string().required('City Name is required'),
    zip: yup.string().required('Zip Code is required'),
    street_address: yup.string().required('Street Address is required'),
  }),
});
