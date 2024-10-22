import React from 'react';

import { Stack, Button, Typography } from '@mui/material';

export const metadata = {
  title: 'SignUp Success | Novelhire',
};

const page = () => (
  <Stack spacing={2} sx={{ mt: 3, mb: 5 }}>
    <Typography variant="h3">Verification Successful!</Typography>

    <Typography variant="body2">
      Your account has been Verified Successfully.
    </Typography>
    <Button href="/auth/login" variant="contained" fullWidth size="large">
      Sign In
    </Button>
  </Stack>
);

export default page;
