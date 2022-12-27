import * as yup from 'yup';

export const reelsValidationSchema = yup.object().shape({
  // reel_link: yup.string().required('Reel Embed URL is required'),
  name: yup.string().required('Name is required'),
});
