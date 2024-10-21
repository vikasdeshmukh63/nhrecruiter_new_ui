import { Typography } from '@mui/material';

const CustomLabel = ({ title, required, ...others }) => (
  <Typography variant="subtitle2" {...others}>
    {title}
    {required && <span style={{ color: 'red' }}>*</span>}
  </Typography>
);

export default CustomLabel;
