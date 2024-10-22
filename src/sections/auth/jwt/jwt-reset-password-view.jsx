'use client';

import * as Yup from 'yup';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';

import { LoadingButton } from '@mui/lab';
import { Link, Stack, IconButton, Typography, InputAdornment } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import SentIcon from 'src/assets/icons/sent-icon';
import { resetPassword } from 'src/redux/slices/signup';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';


// ----------------------------------------------------------------------

export function JwtResetPasswordView() {
  // states
  const [submitted, setSubmitted] = useState(false);

  // redux to extract data
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.signup);

  const password = useBoolean();

  // router
  const searchParams = useSearchParams();
  const router = useRouter();

  // to get query after code from browser
  const code = searchParams.get('code');

  // regex pattern for password
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z]).{8,50}$/;

  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        passwordRegex,
        'Password must have at least 1 special character, 1 uppercase letter, 1 lowercase letter, and be 8-50 characters long'
      )
      .required('Password is required'),
    cnf_password: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Password & Confirm Password must be same'),
  });

  const defaultValues = {
    password: '',
    cnf_password: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      code,
      newPassword: values.password,
    };
    try {
      await dispatch(resetPassword(payload));
      setSubmitted(true);
    } catch (err) {
      toast.error('Operation Failed Please Try Again Later');
    }
  });

  // to show notification
  useEffect(() => {
    // failure scenario
    if (submitted && error) {
      toast.error('Operation Failed Please Try Again Later');
      // setting edit state as false
      setSubmitted(false);
    }

    // success scenario
    if (submitted && !error) {
      router.push('/auth/reset-password/success/');
    }
  }, [dispatch, error, submitted, router]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <Field.Text
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Field.Text
        name="cnf_password"
        label="Confirm New Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Reset Password
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
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Reset Password</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please choose your new password
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
