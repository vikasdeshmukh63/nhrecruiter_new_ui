'use client';

import * as Yup from 'yup';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import { Box, Link, Stack, Button, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import EmailInboxIcon from 'src/assets/icons/email-inbox-icon';
import { resendOtp, validateOtp } from 'src/redux/slices/signup';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function JwtVerifyView() {
  // states
  const [buttonClick, setButtonClick] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [validate, setValidate] = useState(false);
  const [otp, setOtp] = useState('');
  const [resend, setResend] = useState(false);

  // redux to extract data
  const { validationStatus, error } = useSelector((state) => state.signup);
  const { user } = useAuthContext();
  const dispatch = useDispatch();

  // router for navigation
  const router = useRouter();

  const VerifySchema = Yup.object().shape({
    code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
  });

  const defaultValues = {
    code: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await dispatch(validateOtp({ otp, userid: user?.id_str }));
      setValidate(true);
    } catch (err) {
      toast.error('Something Went Wrong Please Try Again Later');
      console.error(err);
    }
  });

  // onchange to store otp
  const handleChange = (otpcode) => {
    if (/^\d*$/.test(otpcode)) {
      setOtp(otpcode);
      setValue('code', otpcode);
    } else {
      toast.error('Please enter only numeric values');
    }
  };

  // setting timer
  useEffect(() => {
    let timerId;
    // starting timer only when button is clicked and error is not present
    if (buttonClick && !error) {
      timerId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          // if time is zero then stop timer and enable button
          if (prevTime === 0) {
            setButtonClick(false);
            clearInterval(timerId);
          }

          // if time is not zero then decrease it by 1 in each one second
          return prevTime > 0 ? prevTime - 1 : 0;
        });
      }, 1000);
    }

    // clering interval
    return () => clearInterval(timerId);
  }, [buttonClick, error]);

  // testing the cases
  useEffect(() => {
    // failure scenario
    const invalidOtpErrorPattern = /OTP is not valid/;
    const isInvalidOtpErrorPresent = invalidOtpErrorPattern.test(error?.message);

    if (validate && error?.status === 'FAILURE' && isInvalidOtpErrorPresent) {
      toast.error('OTP is Not Valid');
      // setting validate state as false
      setValidate(false);
    }
    // success scenario
    if (validate && !error) {
      toast.success('Verification Successful');
      // setting validate state as false
      setValidate(false);
      // navigating user to success screen
      router.push('/auth/verify/success');
    }
    // if there is any other error
    if (validate && error && !isInvalidOtpErrorPresent) {
      toast.error('Something Went Wrong Please Try Again Later', { variant: 'error' });

      // setting validate state as false
      setValidate(false);
    }
  }, [dispatch, validate, error, router, validationStatus]);

  // funciton to resend code
  const handleResendOtp = async () => {
    try {
      // making an api call to resend otp
      await dispatch(resendOtp(user?.id_str));
      // changing state
      setResend(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // failure scenario
    if (resend && error) {
      toast.error('Something Went Wrong ');

      // changing state
      setResend(false);
    }

    // success scenario
    if (resend && !error) {
      toast.success('OTP Sent Successfully');
      // changing state
      setResend(false);
      setButtonClick(true);
      setTimeRemaining(180);
    }
  }, [resend, error, dispatch]);

  // to send otp
  useEffect(() => {
    dispatch(resendOtp(user?.id_str));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <Field.Code name="code" otp={otp} onChange={handleChange} />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Verify
      </LoadingButton>

      <Typography variant="body2">
        {`Don’t have a code? `}
        <Button
          onClick={handleResendOtp}
          disabled={buttonClick || !user?.id_str}
          variant="subtitle2"
          sx={{
            cursor: 'pointer',
          }}
        >
          Resend Code{' '}
          {buttonClick ? `(${Math.floor(timeRemaining / 60)}:${timeRemaining % 60})` : ''}
        </Button>
      </Typography>

      <Link
        component={RouterLink}
        href="/"
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <Box>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Please check your email!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          `We have emailed a 6-digit confirmation code to{' '}
          {user?.email.replace(/^(.{4}).*@/, '$1****@')}, please enter the code in below box to
          verify your email.`
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </Form>
  );
}
