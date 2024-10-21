// extra packages
import { yupResolver } from '@hookform/resolvers/yup';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// material ui
import { Box, Grid, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { setJobData, setMainCurrentSteps, setMainSteps } from 'src/redux/slices/jobposts';

import { Field, Form } from 'src/components/hook-form';
import { fetchLanguages } from 'src/redux/slices/general';

//! COMPONENT
const Others = forwardRef((pr, ref) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();

  // schema
  const schema = Yup.object().shape({
    from: Yup.date()
      .required('Date is Required')
      .max(Yup.ref('to'), 'Start date should be before end date'),
    to: Yup.date()
      .required('Date is Required')
      .min(Yup.ref('from'), 'End date should be after start date'),
    language: Yup.object().required('Language is required'),
  });

  // accessing data from redux store
  const { jobData, individualJobPostData } = useSelector((state) => state.jobpost);
  const { languages } = useSelector((state) => state.general);

  const defaultValues = {
    from: jobData?.from || new Date(),
    to: jobData?.to || new Date(new Date(new Date()).setDate(new Date().getDate() + 7)),
    language: null || jobData?.language,
  };
  // using formik
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const onsubmit = (values) => {
    dispatch(setJobData(values));
    // maintaining record of main steps
    dispatch(setMainSteps(2));
    // setting current main step
    dispatch(setMainCurrentSteps(2));
  };

  // expose a function to submit the form using the parent's ref
  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onsubmit),
  }));

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);
  return (
    <Form methods={methods} onSubmit={onsubmit}>
      <Box
        sx={{
          pl: 3,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Grid container alignItems="center" justifyContent="flex-start" spacing={3}>
          <Grid item md={12} lg={4}>
            <Typography>Start & End Date</Typography>
          </Grid>
          <Grid item md={12} lg={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DateTimePicker
                      disabled={
                        individualJobPostData
                          ? individualJobPostData?.status !== 2 &&
                            individualJobPostData?.status !== 1
                          : false
                      }
                      onChange={(value) => {
                        setValue('from', value);
                        setValue('to', new Date(new Date(value).setDate(value.getDate() + 7)));
                      }}
                      value={new Date(field.value)}
                      maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                      defaultValue={new Date()}
                      minDate={new Date()}
                      label="From"
                    />
                    {error && (
                      <Typography color="error" variant="h6">
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
                name="from"
                control={control}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={12} lg={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DateTimePicker
                      disabled={
                        individualJobPostData
                          ? individualJobPostData?.status !== 2 &&
                            individualJobPostData?.status !== 1
                          : false
                      }
                      onChange={(value) => {
                        setValue('to', value);
                      }}
                      minDate={new Date().setDate(new Date().getDate() + 1)}
                      value={new Date(field.value)}
                      maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                      label="To"
                    />
                    {error && (
                      <Typography color="error" variant="h6">
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
                name="to"
                control={control}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container alignItems="center" justifyContent="flex-start" spacing={3}>
          <Grid item md={12} lg={4}>
            <Typography>Language Mode</Typography>
          </Grid>
          <Grid item md={12} lg={4}>
            <Field.Autocomplete
              name="language"
              placeholder="Select Language"
              disabled={
                individualJobPostData
                  ? individualJobPostData?.status !== 2 && individualJobPostData?.status !== 1
                  : false
              }
              options={languages}
              getOptionLabel={(option) => option.name}
            />
          </Grid>
        </Grid>
      </Box>
    </Form>
  );
});

export default Others;
