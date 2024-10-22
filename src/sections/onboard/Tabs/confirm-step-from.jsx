import { toast } from "sonner";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, Button, Switch, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import { useBoolean } from "src/hooks/use-boolean";

import { setAccError, createNewOrgWithCustomerAcc } from "src/redux/slices/organization";


// ----------------------------------------------------------------------


const ConfirmStepForm = ({ setActiveStep, activeStep, type, handleBack, steps, handleNext }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const path = searchParams.get('returnTo');
  const router = useRouter();

  // states
  const agree = useBoolean(false);
  const isSubmitted = useBoolean();
  const isSubmitting = useBoolean();

  // extracting data from redux
  const { organizationData, error } = useSelector((state) => state.organization);

  // function to toggle the agree switch
  const toggleAgree = () => {
    agree.onToggle();
  };

  // function to handle the submit form
  const handleSubmit = async () => {
    try {
      // modifying the payload as per api requirement
      const payload = {
        ...organizationData,
        acc_mobile_code: organizationData?.acc_mobile_code?.dial_code,
        org_country: organizationData?.org_country?.name,
        userType: type === 'Organization' ? 2 : 3,
      };

      // converting the object into formData
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      // making api call
      isSubmitting.onTrue();
      await dispatch(createNewOrgWithCustomerAcc(formData));
      isSubmitted.onTrue();
    } catch (err) {
      toast.error('Something Went Wrong');
    }
  };

  // to show notification
  useEffect(() => {
    // if there is no error
    if (!error && isSubmitted.value) {
      if (path) {
        const requiredPath = new URLSearchParams({
          returnTo: path,
        }).toString();
        const href = `${paths.auth.jwt.orgSuccess}?${requiredPath}`;
        router.replace(href);
      } else {
        router.push(
          type === 'Organization' ? paths.auth.jwt.orgSuccess : paths.auth.jwt.collegeSuccess
        );
      }

      isSubmitted.onFalse();
    }
    // if there is a error
    if (error && isSubmitted.value) {
      if (error?.message?.includes('already exists in organizations. Unique name are allowed.')) {
        if (type === 'Organization') {
          dispatch(setAccError({ name: 'Organization name is already exists' }));
        } else {
          dispatch(setAccError({ name: 'College name is already exists' }));
        }
        setActiveStep(0);
      } else if (
        error?.message?.includes('already exists in organizations. Unique email are allowed.')
      ) {
        if (type === 'Organization') {
          dispatch(setAccError({ name: 'Recruiters Email is already exists' }));
        } else {
          dispatch(setAccError({ name: 'Admins Email is already exists' }));
        }
        setActiveStep(1);
      } else {
        toast.error('Something Went Wrong');
        setActiveStep(1);
      }
      isSubmitted.onFalse();
      isSubmitting.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitted.value]);

  return (
    <Box my={2} p={2}>
      {/* subheading  */}
      <Typography variant="h5" fontWeight={500} mb={3}>
        Confirm and Create {type}
      </Typography>

      <Card sx={{ mb: 2, p: 3 }}>
        <Grid container spacing={2}>
          {/* organization details preview  */}
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontWeight: 700 }}>
              {steps[0]}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                Name
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                {organizationData?.org_name}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} />

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                Website
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                {organizationData?.org_website}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} />

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                House No
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                {organizationData?.org_houseno}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                Street
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                {organizationData?.org_street}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                City/Town
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                {organizationData?.org_city}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                State
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                {organizationData?.org_state}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                Country
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                {organizationData?.org_country?.name}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                Zip/Postal code
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                {organizationData?.org_zipcode}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      {/* recruiters details preview  */}
      <Card sx={{ mb: 2, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontWeight: 700 }}>
              {steps[1]}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                First Name
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                {organizationData?.acc_firstname}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                Last Name
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                {organizationData?.acc_lastname}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                Email Id
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 600, wordWrap: 'break-word' }}
              >
                {organizationData?.acc_email}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                Mobile
              </Typography>
              <Typography
                width="50%"
                variant="caption"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                {`${organizationData?.acc_mobile_code?.dial_code} ${organizationData?.acc_mobile_no}`}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ mb: 2, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center">
              <Switch onClick={toggleAgree} checked={agree.value} />
              <Typography variant="body2">Accept Terms & Conditions.</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>

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
        <LoadingButton
          fullWidth
          disabled={!agree.value}
          size="medium"
          onClick={handleSubmit}
          sx={{ background: activeStep === steps.length - 1 && '#00A76F', width: 'auto' }}
          variant="contained"
          loading={isSubmitting.value}
        >
          Create {type}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default ConfirmStepForm;
