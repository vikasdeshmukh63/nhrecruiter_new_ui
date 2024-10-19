'use client';

import React from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';

import { Box, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

const CreditSuccess = () => {
  const { orderInfo } = useSelector((state) => state.cart);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 10,
        gap: 3,
      }}
    >
      <Typography variant="h4">Thank you for your order!</Typography>
      <Image src="/assets/illustration_order_complete.svg" width={400} height={300} />

      <Typography variant="body1">Thanks for your order, below is the reference no:</Typography>

      <Typography variant="body1" color="green" fontWeight={600}>
        {orderInfo?.ext_order_id}
      </Typography>

      <Typography variant="body1">
        Incase any queries, kindly contact our support team with the reference no.
      </Typography>

      <Typography variant="body1">Happy Interviewing</Typography>

      <Button
        startIcon={<Icon icon="ep:arrow-left-bold" />}
        href={paths.admin.credits.group.buy}
        variant="outlined"
        sx={{
          mt: 3,
          color: 'inherit',
        }}
      >
        Continue Shopping
      </Button>
    </Box>
  );
};

export default CreditSuccess;
