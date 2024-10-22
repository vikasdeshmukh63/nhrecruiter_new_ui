'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Link, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import PasswordIcon from 'src/assets/icons/password-icon';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { resetPasswordThroghEmail } from 'src/redux/slices/signup';
import { RouterLink } from 'src/routes/components';
import * as Yup from 'yup';


// ----------------------------------------------------------------------

export function JwtForgotPasswordView() {
  // states
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);



  //  redux to extract error messages
  const dispatcher = useDispatch();
  const { error } = useSelector((state) => state.signup);

  // router for navigation
  const router = useRouter();

  // schema
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  // default values
  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // submit function
  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      await dispatcher(resetPasswordThroghEmail(email));
      setIsEmailSubmitted(true);
    } catch (err) {
      toast.error('Something Went Wrong Please Try Again Later');
      console.error(err);
    }
  });

  // nofification
  useEffect(() => {
    // failure scenario

    const emailPresentError = /Record\(s\) not found with specified criteria\./;
    const isEmailPresentErrorPresent = emailPresentError.test(error?.message);

    if (isEmailSubmitted && error && isEmailPresentErrorPresent) {
      toast.error('Invalid Email');
      setIsEmailSubmitted(false);
    }

    // if there is any other error
    if (isEmailSubmitted && error && !isEmailPresentErrorPresent) {
      toast.error('Something Went Wrong Please Try Again Later');
      setIsEmailSubmitted(false);
    }

    // success scenario
    if (isEmailSubmitted && !error) {
      toast.success('Check mail for forgot password link');
      router.push('/auth/forgot-password/success');
    }
  }, [error, isEmailSubmitted, router]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <Field.Text name="email" label="Email address" />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send Request
      </LoadingButton>

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
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
        </Typography>
      </Stack>
    </>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </Form>
  );
}
