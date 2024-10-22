import * as yup from 'yup';

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Box, Button, Dialog, Divider, Grid, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { finderFunction } from 'src/utils/helperFunctions';

import { CONSTANTS } from 'src/constants';
import { searchJobTitles } from 'src/redux/slices/instantHire';
import {
  addWorkExperienceDetails,
  editWorkExperienceDetails,
  getCandidateWorkExperienceDetails,
} from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import CustomLabel from 'src/components/hook-form/label/custom-label';
import { toast } from 'sonner';
import { Field, Form } from 'src/components/hook-form';

const AddEditWorkExperienceModal = ({ isOpenModal, experienceData, type }) => {
  // states

  const isSubmitted = useBoolean();

  // redux
  const { jobTitles } = useSelector((state) => state.instantHire);
  const { error: formErr, editCandidateId } = useSelector((state) => state.jobpost);
  const { constants } = useSelector((state) => state.general);

  const dispatch = useDispatch();

  // schema
  const schema = yup.object().shape({
    emp_type: yup.object().required('Employment Type is required'),
    company_name: yup.string().required('Company name is required'),
    job_title: yup.object().required('job Title is required'),
    start_date: yup
      .date()
      .required('Start date is required')
      .max(yup.ref('end_date'), 'Start date should be before end date'),
    end_date: yup
      .date()
      .required('Start date is required')
      .min(yup.ref('start_date'), 'End date should be after start date'),
    responsibilities: yup.string(),
    is_current: yup.bool().required('Choose at least one option'),
  });

  // default values
  const defaultValues = {
    emp_type: finderFunction('id', experienceData?.emp_type, constants.employment_type) || null,
    company_name: experienceData?.company_name || '',
    job_title: experienceData?.job_title ? { name: experienceData?.job_title } : null,
    start_date: experienceData?.start_date ? new Date(experienceData?.start_date) : null,
    end_date: experienceData?.end_date ? new Date(experienceData?.end_date) : null,
    responsibilities: experienceData?.responsibilities || '',
    is_current: experienceData?.is_current || false,
  };

  // methods
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // on submit
  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      emp_type: data.emp_type.id,
      job_title: data.job_title.name,
    };

    try {
      if (type === CONSTANTS.EDIT) {
        payload.expId = experienceData.id;
        await dispatch(editWorkExperienceDetails(editCandidateId, payload));
      } else {
        await dispatch(addWorkExperienceDetails(editCandidateId, payload));
      }
      isSubmitted.onTrue();
    } catch (err) {
      console.log(err);
    }
  });

  const handleSearchJobTitle = (event) => {
    const jobTitle = event.target.value;
    if (jobTitle.length > 1) {
      dispatch(searchJobTitles(jobTitle));
    }
  };

  // form submit error handling
  useEffect(() => {
    if (isSubmitted.value && formErr) {
      toast.error('something went wrong', { variant: 'error' });
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !formErr) {
      toast.success(`Work Experience ${type === CONSTANTS.EDIT ? 'edited' : 'added'} Successfully`);
      dispatch(getCandidateWorkExperienceDetails(editCandidateId));
      isOpenModal.onFalse();
      isSubmitted.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErr, isSubmitted]);

  return (
    <Dialog
      open={isOpenModal.value}
      onClose={isOpenModal.onFalse}
      PaperProps={{ sx: { borderRadius: 1, width: 800, p: 3 } }}
    >
      <Stack spacing={1}>
        <Typography variant="h6">Add Work Experience</Typography>
        <Typography variant="body2" color="#637381">
          Title, short description, image...
        </Typography>
      </Stack>
      <Divider sx={{ mt: 3 }} />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Working here currently?</Typography>
              <Field.RadioGroup
                row
                name="is_current"
                // label="Working here currently?"
                spacing={4}
                options={[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' },
                ]}
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Employment Type" required />

              <Field.Autocomplete
                options={constants?.employment_type}
                getOptionLabel={(option) => option.variant}
                name="emp_type"
                placeholder="Select Employment Type"
              />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Company Name" required />

              <Stack gap={2}>
                <Field.Text name="company_name" placeholder="Enter Company Name" />
                <Box display="flex" gap={1} color="#637381">
                  <Iconify icon="material-symbols:info" width={18} />
                  <Typography variant="caption">Type slowly to search your company</Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Job Title" required />

              <Stack gap={2}>
                <Field.Autocomplete
                  handleSearch={handleSearchJobTitle}
                  options={jobTitles}
                  getOptionLabel={(option) => option.name}
                  name="job_title"
                  placeholder="Select Job Title"
                />
                <Box display="flex" gap={1} color="#637381">
                  <Iconify icon="material-symbols:info" width={18} />
                  <Typography variant="caption">Type slowly to search your company</Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Start Date" required />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      placeholder="Start Date"
                      maxDate={new Date()}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="End Date" required />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      placeholder="End Date"
                      format="dd/MM/yyyy"
                      maxDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Responsibilities" />

              <Stack gap={2}>
                <Field.Text
                  name="responsibilities"
                  multiline
                  rows={3}
                  placeholder="Write about your responsibilities"
                />
                <Box display="flex" gap={1} color="#637381">
                  <Iconify icon="material-symbols:info" width={18} />
                  <Typography variant="caption">
                    Write about your job responsibilities in this position
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack mt={3} direction="row" justifyContent="end" spacing={2}>
              <Button variant="soft" color="error" onClick={isOpenModal.onFalse}>
                Cancel
              </Button>
              <LoadingButton
                color="success"
                type="submit"
                startIcon={<Iconify icon="bxs:file" />}
                variant="contained"
                loading={isSubmitting}
              >
                Save
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </Dialog>
  );
};

export default AddEditWorkExperienceModal;
