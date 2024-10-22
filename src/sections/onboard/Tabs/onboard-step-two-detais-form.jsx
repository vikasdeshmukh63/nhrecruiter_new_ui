import * as Yup from 'yup';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, Stack, Button, IconButton, Typography, InputAdornment } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { finderFunction } from 'src/utils/helperFunctions';

import { setOrganizationData } from 'src/redux/slices/organization';

import { Form, Field } from 'src/components/hook-form';



// ----------------------------------------------------------------------

const disallowedDomains = [
  'gmail.com', // Google
  'yahoo.com', // Yahoo
  'rediff.com', // Rediff
  'hotmail.com', // Microsoft
  'aol.com', // AOL
  'icloud.com', // Apple
  'protonmail.com', // ProtonMail
  'zoho.com', // Zoho Mail
  'gmx.com', // GMX Mail
  'yandex.com', // Yandex.Mail
  'tutanota.com', // Tutanota
  'mail.com', // Mail.com
  'inbox.com', // Inbox.com
  'lycos.com', // Lycos Mail
];

// validate email for regex
const validateEmail = (email) => {
  const emailParts = email.split('@');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Invalid email format';
  }
  if (emailParts.length !== 2) {
    return 'Invalid email format';
  }
  const domain = emailParts[1];
  if (disallowedDomains.includes(domain)) {
    return 'Please use an official email address';
  }
  return '';
};

const OnboardStepTwoDetailsForm = ({ activeStep, handleBack, steps, handleNext }) => {
  const dispatch = useDispatch();

  // states

  const password = useBoolean(true);
  const confirmPassword = useBoolean(true);

  // extracting data from redux
  const { organizationData, ipAddress, error, errorOrg } = useSelector(
    (state) => state.organization
  );
  const { countries } = useSelector((state) => state.general);

  const mobilNoRegex = /^(\+1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})$/;

  // function to show or hide password
  const togglePasswordVisibility = () => {
    password.onToggle();
  };

  const toggleConfirmPasswordVisibility = () => {
    confirmPassword.onToggle();
  };

  // default values
  const defaultValues = {
    acc_firstname: '' || organizationData?.acc_firstname,
    acc_lastname: '' || organizationData?.acc_lastname,
    acc_email: '' || organizationData?.acc_email,
    acc_mobile_no: '' || organizationData?.acc_mobile_no,
    acc_mobile_code:
      organizationData?.acc_mobile_code ||
      finderFunction('code', ipAddress?.countryCode, countries),
    acc_password: '' || organizationData?.acc_password,
    acc_confirmpassword: '' || organizationData?.acc_confirmpassword,
  };

  // schema
  const schema = Yup.object().shape({
    acc_firstname: Yup.string().required('Firstname is required'),
    acc_lastname: Yup.string().required('Lastname is required'),
    acc_email: Yup.string()
      .test('is-valid-email', 'Invalid email format', function (value) {
        const errorMessage = validateEmail(value);
        if (errorMessage) {
          // eslint-disable-next-line react/no-this-in-sfc
          return this.createError({ message: errorMessage });
        }
        return true;
      })
      .required('Email is required'),
    acc_mobile_no: Yup.string()
      .matches(mobilNoRegex, 'Enter Valid mobile Number')
      .required('Mobile no. is required'),
    acc_mobile_code: Yup.object().required('Mobile code is required'),
    acc_password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/.><,])(?=.*\d)[A-Za-z\d!@#$%^&*()_+}{"':;?/.><,]{8,}$/,
        'Password must be at least 8 characters long, contain at least one special character, and one capital letter'
      ),
    acc_confirmpassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('acc_password'), null], 'Passwords must match'),
  });

  // getting methods from react hook form
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  // getting required funcitions from methods
  const {
    reset,
    getValues,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // function to submit the form
  const onSubmit = handleSubmit(async (data) => {
    await dispatch(setOrganizationData(data));
    handleNext();
  });

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
        Add {steps[1]}
      </Typography>

      <Form methods={methods} onSubmit={onSubmit}>
        <Grid my={2} p={2} boxShadow={2} gap={3} borderRadius="10px" container alignItems="center">
          {/* first name  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                First Name
              </Typography>
              <Field.Text name="acc_firstname" placeholder="Enter Your First Name" />
            </Stack>
          </Grid>

          {/* last name  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Last Name
              </Typography>
              <Field.Text name="acc_lastname" placeholder="Enter Your Last Name" />
            </Stack>
          </Grid>

          {/* email id  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Email Id (official)
              </Typography>
              <Field.Text name="acc_email" placeholder="Enter Your Email ID" />
              <Typography variant="caption">
                <Icon icon="ic:twotone-info" style={{ fontSize: 14 }} /> Please enter your official
                email id
              </Typography>
            </Stack>
          </Grid>

          {/* mobile no  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Mobile No
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Field.Autocomplete
                  name="acc_mobile_code"
                  options={countries}
                  getOptionLabel={(option) => option?.dial_code}
                  placeholder="Code"
                />
                <Field.Text
                  name="acc_mobile_no"
                  type="number"
                  placeholder="Enter Your Mobile No."
                />
              </Box>
            </Stack>
          </Grid>

          {/* password  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Password
              </Typography>
              <Field.Text
                name="acc_password"
                placeholder="Enter Strong Password"
                type={password.value ? 'password' : 'text'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={togglePasswordVisibility}>
                        <Icon
                          icon={
                            password.value ? 'ic:baseline-visibility-off' : 'ic:baseline-visibility'
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption">
                <Icon icon="ic:twotone-info" style={{ fontSize: 14 }} /> Min 10 characters, at least
                1 uppercase, 1 small case, 1 special character
              </Typography>
            </Stack>
          </Grid>

          {/* confirm password  */}
          <Grid item xs={12}>
            <Stack gap={2}>
              <Typography variant="h6" style={{ fontSize: '14px' }}>
                Confirm Password
              </Typography>
              <Field.Text
                name="acc_confirmpassword"
                placeholder="Enter Strong Password"
                type={confirmPassword.value ? 'password' : 'text'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={toggleConfirmPasswordVisibility}>
                        <Icon
                          icon={
                            confirmPassword.value
                              ? 'ic:baseline-visibility-off'
                              : 'ic:baseline-visibility'
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Grid>
          {error && errorOrg?.name === `${steps[1]}s Email is already exists` && (
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

        {/* action buttons  */}
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

          <Button type="submit" variant="contained">
            Continue
          </Button>
        </Box>
      </Form>
    </Box>
  );
};

export default OnboardStepTwoDetailsForm;
