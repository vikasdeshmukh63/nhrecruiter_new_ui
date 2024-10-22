'use client';

import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';

import { Box, Stack, Button, Divider, Typography } from '@mui/material';

const SuccessForm = () => {
  const { createdOrgData } = useSelector((state) => state.organization);
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = searchParams.get('returnTo');
  const handleSignInRec = () => {
    if (path) {
      const requiredPath = new URLSearchParams({
        returnTo: path,
      }).toString();
      const href = `${'/auth/login'}?${requiredPath}`;
      router.replace(href);
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '800px',
        height: '100vh',
        margin: '0 auto',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" mb={3}>
        Success! Organization has been created successfully.
      </Typography>
      <Image
        src="/assets/illustration_seo.svg"
        width={360}
        height={270}
        alt="success-creating-org"
      />
      <Stack sx={{ maxWidth: '450px' }} mt={3}>
        <Typography textAlign="center" fontWeight={500}>
          Your organization{' '}
          <b style={{ color: '#22C55E', fontStyle: 'italic', fontSize: '18px' }}>
            {createdOrgData?.createdOrganizations?.name}
          </b>{' '}
          has been added successfully.
        </Typography>
        <Typography textAlign="center" fontWeight={500}>
          Your login email:{' '}
          <b style={{ color: '#00A76F', fontStyle: 'italic' }}>
            {' '}
            {createdOrgData?.createdOrganizations?.email}
          </b>
        </Typography>
        <Typography textAlign="center" my={2} fontWeight={500}>
          Please sign in to verify your account and get access to our NovelHire platform.
        </Typography>
        <Typography textAlign="center" fontWeight={700} mb={4} fontStyle="italic">
          Happy Hiring!
        </Typography>
        <Divider sx={{ borderStyle: 'dashed', mb: 5 }} />
        <Box justifyContent="center" display="flex">
          <Button color="success" variant="contained" onClick={handleSignInRec}>
            Go to Login
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default SuccessForm;
