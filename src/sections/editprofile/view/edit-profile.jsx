'use client';

import * as yup from 'yup';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button, Divider, Typography, Box } from '@mui/material';

import { paths } from 'src/routes/paths';

import { getUserData, updateProfile } from 'src/redux/slices/userAccount';

import { Field, Form } from 'src/components/hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';

const EditProfile = () => {
  // snackbar from notistack

  // using useDispatch
  const dispatch = useDispatch();
  // getting userData from useAuth hook

  const { error, userData } = useSelector((state) => state.userAccount);

  // states
  const [isSubmit, setIsSubmit] = useState(false);

  // extacting data from redux
  const { countries } = useSelector((state) => state.general);

  // function to find the dial code object
  const findMobileCode = (value) => countries?.find((item) => item.dial_code === value);

  // validation schema
  const schema = yup.object({
    firstname: yup
      .string()
      .required('Full Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Only alphabetic characters are allowed'),
    lastname: yup
      .string()
      .required('Last Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Only alphabetic characters are allowed'),
    email: yup.string().email('Invalid email').required('Email is required'),
    mobile_no: yup
      .string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Invalid phone number'),
    mobile_code: yup.object().required('Mobile code is required').nullable(),
  });

  const defaultValues = {
    firstname: userData?.firstname || '',
    lastname: userData?.lastname || '',
    email: userData?.email || '',
    mobile_code: findMobileCode(userData?.mobile_code) || null,
    mobile_no: userData?.mobile_no || '',
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, setValue, reset } = methods;

  const onSubmit = handleSubmit(async (values) => {
    values = { ...values, mobile_code: values.mobile_code.dial_code };
    try {
      await dispatch(updateProfile(userData?.id_str, values));

      // setting state as true
      setIsSubmit(true);
    } catch (err) {
      toast.error('Something Went Wrong');
    }
  });

  useEffect(() => {
    if (isSubmit && error) {
      toast.error('Something Went Wrong : Please Try Again Later.');
      setIsSubmit(false);
    }
    if (isSubmit && !error) {
      toast.success('Profile Updated Successfully.');
      dispatch(getUserData());
      setIsSubmit(false);
    }
  }, [isSubmit, error, dispatch]);

  useEffect(() => {
    setValue('email', userData?.email);
  }, [setValue, userData?.email]);

  // userdata
  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  // to fetch data
  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);
  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Form methods={methods} onSubmit={onSubmit}>
        <CustomBreadcrumbs
          heading="Edit Profile"
          links={[{ name: 'Profile', href: paths.profile.edit }, { name: 'Edit' }]}
          sx={{
            mb: { xs: 3, md: 5 },
            ml: 3,
          }}
          action={
            <Button
              startIcon={<Icon icon="material-symbols:layers-outline" />}
              variant="contained"
              type="submit"
              size="large"
            >
              Save Profile
            </Button>
          }
        />
        <Box>
          <Grid
            container
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              borderRadius: 3,
              pb: '30vh',
            }}
            spacing={3}
          >
            {/* firstname  */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={6}>
                  <Typography variant="body1" align="right">
                    First Name
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} lg={6} alignItems="center">
                  <Field.Text name="firstname" placeholder="First Name" />
                </Grid>
              </Grid>
            </Grid>

            {/* lastname */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={6}>
                  <Typography variant="body1" align="right">
                    Last Name
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} lg={6} alignItems="center">
                  <Field.Text name="lastname" placeholder="Last name" />
                </Grid>
              </Grid>
            </Grid>

            {/* section heading  */}
            <Grid item xs={12}>
              <Typography variant="h6" mb={2}>
                Personal Details
              </Typography>
              <Divider />
            </Grid>

            {/* email id  */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={6}>
                  <Typography variant="body1" align="right">
                    Email Id
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} lg={6} alignItems="center">
                  <Field.Text name="email" disabled placeholder="Email" />
                </Grid>
              </Grid>
            </Grid>

            {/* phone code */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={6}>
                  <Typography variant="body1" align="right">
                    Phone No
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={1} lg={1} alignItems="center">
                  <Field.Autocomplete
                    name="mobile_code"
                    getOptionLabel={(option) => option.dial_code}
                    options={countries}
                    placeholder="Code"
                  />
                </Grid>

                {/* phone no  */}
                <Grid item xs={12} sm={5} lg={5} alignItems="center">
                  <Field.Text name="mobile_no" placeholder="Phone No." />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Form>
    </DashboardContent>
  );
};

export default EditProfile;
