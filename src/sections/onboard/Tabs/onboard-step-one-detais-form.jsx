import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, Stack, Button, Typography } from '@mui/material';

import { fData } from 'src/utils/format-number';
import { finderFunction } from 'src/utils/helperFunctions';

import { fetchCountries } from 'src/redux/slices/general';
import { getLocationOnIp, setOrganizationData } from 'src/redux/slices/organization';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const OnboardStepOneDetailsForm = ({ activeStep, handleBack, steps, handleNext }) => {
  const dispatch = useDispatch();

  // extracting data from redux
  const { organizationData, ipAddress, error, errorOrg } = useSelector(
    (state) => state.organization
  );
  const { countries } = useSelector((state) => state.general);

  // regex for website
  const websiteUrlRegex =
    /^((https?|ftp|smtp):\/\/)?(www\.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
  // default values
  const defaultValues = {
    org_name: '' || organizationData?.org_name,
    org_website: '' || organizationData?.org_website,
    org_houseno: '' || organizationData?.org_houseno,
    org_street: '' || organizationData?.org_street,
    org_city: '' || organizationData?.org_city,
    org_state: '' || organizationData?.org_state,
    org_country:
      organizationData?.org_country || finderFunction('name', ipAddress?.country, countries),
    org_zipcode: '' || organizationData?.org_zipcode,
    prof_id: null || organizationData?.prof_id,
  };

  // schema
  const schema = Yup.object().shape({
    prof_id: Yup.mixed().nullable().required('Logo is requirerd'),
    org_name: Yup.string().required(`${steps[0]} name is required`),
    org_website: Yup.string()
      .required('Website url is required')
      .matches(websiteUrlRegex, 'Invalid URL. Please enter a valid website.'),
    org_houseno: Yup.string().required('House no. is required'),
    org_street: Yup.string().required('Street is required'),
    org_city: Yup.string().required('City is required'),
    org_state: Yup.string().required('State is required'),
    org_country: Yup.object().required('Country is required'),
    org_zipcode: Yup.string()
      .matches(/^\d{5,6}$/, 'Zip code must be 5 or 6 digits')
      .required('Zip code is required'),
  });

  // getting methods from react hook form
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  // function to get the required funcitons from methods
  const {
    reset,
    getValues,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // functon to handle submiting form
  const onSubmit = handleSubmit(async (data) => {
    await dispatch(setOrganizationData(data));
    handleNext();
  });

  // fucntion to handle the image change
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('prof_id', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // to fetch countries
  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
      dispatch(getLocationOnIp());
    }
  }, [countries.length, dispatch]);

  // to fill auto country
  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipAddress, countries, reset]);

  // scroll into error data
  useEffect(() => {
    if (errorOrg.name) {
      window.scrollTo({
        top: window.innerHeight * 5,
        behavior: 'smooth',
      });
    }
  }, [errorOrg]);

  return (
    <Box my={2} p={2}>
      {/* sub heading  */}
      <Typography variant="h5" fontWeight={300} mb={3}>
        Add {steps[0]}
      </Typography>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid my={2} p={2} boxShadow={2} gap={3} borderRadius="10px" container alignItems="center">
          {/* photo upload input  */}
          <Grid item xs={12}>
            <Field.UploadAvatar
              name="prof_id"
              label="upload Logo"
              maxSize={3250585}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3250585)}
                </Typography>
              }
            />
          </Grid>

          {/* organization name  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                {steps[0]} Name
              </Typography>
              <Field.Text name="org_name" placeholder={`Name of your ${steps[0]}`} />
            </Stack>
          </Grid>

          {/* website url  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Website url
              </Typography>
              <Field.Text name="org_website" placeholder="https://www.novelhire.com" />
            </Stack>
          </Grid>

          {/* house no. */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                House No
              </Typography>
              <Field.Text name="org_houseno" placeholder="Enter Your House No." />
            </Stack>
          </Grid>

          {/* street  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Street
              </Typography>
              <Field.Text name="org_street" placeholder="Enter Your Street Name" />
            </Stack>
          </Grid>

          {/* city / town  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                City/Town
              </Typography>
              <Field.Text name="org_city" placeholder="Enter Your City/Town Name" />
            </Stack>
          </Grid>

          {/* state  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                State
              </Typography>
              <Field.Text name="org_state" placeholder="Enter Your State Name" />
            </Stack>
          </Grid>

          {/* country  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Country
              </Typography>
              <Field.Autocomplete
                name="org_country"
                options={countries}
                getOptionLabel={(option) => option?.name}
                placeholder="Select Your Country"
              />
            </Stack>
          </Grid>

          {/* zipcode  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Zip/Postal Code
              </Typography>
              <Field.Text name="org_zipcode" placeholder="Enter Your Zipcode" />
            </Stack>
          </Grid>
          {error && errorOrg?.name === `${steps[0]} name is already exists` && (
            <Grid item sm={12}>
              <Typography color="error" variant="caption">
                Cannot Create {steps[0]} & Account
              </Typography>
              <Typography color="error" component="div">
                <ul>
                  {Object.values(errorOrg).map((item, index) => (
                    <li key={index}>
                      <Typography color="error" variant="caption">
                        {item}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* action button  */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{ background: activeStep === steps.length - 1 && '#00A76F' }}
          >
            {activeStep === steps.length - 1 ? 'Create Organization' : 'Continue'}
          </Button>
        </Box>
      </Form>
    </Box>
  );
};

export default OnboardStepOneDetailsForm;
