import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import { Box, alpha, Stack, Button, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { CONSTANTS } from 'src/constants';
import { addCartItems } from 'src/redux/slices/cart';
import PlanStarterIcon from 'src/assets/icons/plan-starter-icon';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

const PricingCard = () => {
  // count state
  const [count, setCount] = useState(1);

  const router = useRouter();
  const dispatch = useDispatch();

  // function to handle counting of the credits
  const handleCount = (e) => {
    if (e.target.innerText === '-' && count !== 1) {
      setCount((prev) => prev - 1);
    }
    if (e.target.innerText === '+') {
      setCount((prev) => prev + 1);
    }
  };

  // function to handle add item to cart
  const handleAddToCart = (title, desc, qty, price) => {
    // creating cart object
    const cartObj = {
      id: 'credit750',
      title,
      desc,
      qty,
      price,
    };

    // adding items to cart
    dispatch(addCartItems(cartObj));

    // pushing user to cart page
    router.push(paths.admin.credits.cart);
  };
  return (
    <Stack
      spacing={5}
      sx={{
        p: 5,
        borderRadius: 2,
        boxShadow: (theme) => ({
          xs: theme.customShadows.card,
          md: `-40px 40px 80px 0px ${alpha(
            theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
            0.16
          )}`,
        }),
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box sx={{ width: 48, height: 48 }}>
          <PlanStarterIcon />
        </Box>
        <Label color="info">POPULAR</Label>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
          Buy Interview Credits
        </Typography>
      </Stack>

      <Stack direction="row">
        <Typography variant="h4">₹</Typography>

        <Typography variant="h2">{CONSTANTS.CREDIT_PRICE}</Typography>

        <Typography
          component="span"
          sx={{
            alignSelf: 'center',
            color: 'text.disabled',
            ml: 1,
            typography: 'body2',
          }}
        >
          /Interview
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        border="1px solid gray"
        width="fit-content"
        mx="auto"
        borderRadius={1}
      >
        <Button onClick={handleCount}>-</Button>
        <Box>{count}</Box>
        <Button onClick={handleCount}>+</Button>
      </Stack>
      <Typography variant="caption" color="#80b5cd">
        {`You have added ${count} credits to checkout.`}
      </Typography>
      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box component="span" sx={{ typography: 'overline' }}>
            Features
          </Box>
        </Stack>

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
          AI-Powered Personalized Interviews
        </Stack>
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
          Multi-level Skill Assessments
        </Stack>
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
          24/7 Interview Scheduling
        </Stack>
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
          Basic Support
        </Stack>
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
          Real-time Feedback
        </Stack>
      </Stack>

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        onClick={() =>
          handleAddToCart(
            'Interview Credits',
            'AI-Powered Personalized Interviews',
            count,
            CONSTANTS.CREDIT_PRICE
          )
        }
      >
        Checkout
      </Button>
    </Stack>
  );
};

export default PricingCard;
