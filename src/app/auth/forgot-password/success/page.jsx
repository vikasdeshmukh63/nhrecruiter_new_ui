import React from 'react';

import { Stack, Button, Typography } from '@mui/material';

export const metadata = {
  title: 'Forgot Password | NovelHire',
};

const page = () => (
  <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
    <Typography variant="h3" >
      Check Mail
    </Typography>

    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      We have sent a password recover instructions to your email.
    </Typography>

    <Button variant='contained' href='/auth/login'>Login</Button>
  </Stack>
);

export default page;
