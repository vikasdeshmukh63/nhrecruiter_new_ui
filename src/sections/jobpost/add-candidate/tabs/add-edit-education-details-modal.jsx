import * as yup from 'yup';

import React, { useEffect, useState } from 'react';
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
import {
  addEducationDetails,
  editEducationDetails,
  getCandidateWorkEducationDetails,
  searchCollege,
} from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import CustomLabel from 'src/components/hook-form/label/custom-label';
import { toast } from 'sonner';
import { Field, Form } from 'src/components/hook-form';

const AddEditEducationDetailsModal = ({ isOpenModal, educationData, type }) => {
  // states
  const isSubmitted = useBoolean();

  const { error: formErr, candidateIdData, collegeData } = useSelector((state) => state.jobpost);
  const { constants } = useSelector((state) => state.general);

  const dispatch = useDispatch();

  // schema
  const schema = yup.object().shape({
    type: yup.object().required('Employment Type is required'),
    course_type: yup.object().required('Employment Type is required'),
    college_name: yup.object().required('college name is required'),
    course: yup.object().required('college name is required'),
    specialization: yup.string().required('college name is required'),
    start_date: yup
      .date()
      .required('Start date is required')
      .max(yup.ref('end_date'), 'Start date should be before end date'),
    end_date: yup
      .date()
      .required('End date is required')
      .min(yup.ref('start_date'), 'End date should be after start date'),
  });

  // defaultValues
  const defaultValues = {
    type: finderFunction('id', educationData?.type, constants.education_type) || null,
    course_type: finderFunction('id', educationData?.course_type, constants.course_type) || null,
    college_name: educationData?.college_name ? { name: educationData?.college_name } : null,
    course: educationData?.course ? { variant: educationData?.course } : null,
    specialization: educationData?.specialization || '',
    start_date: educationData?.start_date ? new Date(educationData?.start_date) : null,
    end_date: educationData?.end_date ? new Date(educationData?.end_date) : null,
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

  // submit
  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      type: data.type.id,
      course_type: data.course_type.id,
      college_name: data.college_name.name,
      course: data?.course?.variant,
      isActive: true,
    };

    try {
      if (type === CONSTANTS.EDIT) {
        payload.eduId = educationData.id;

        await dispatch(editEducationDetails(candidateIdData?.cand_org_id, payload));
      } else {
        await dispatch(addEducationDetails(candidateIdData?.cand_org_id, payload));
      }
      isSubmitted.onTrue();
    } catch (err) {
      console.log(err);
    }
  });

  // form handling
  useEffect(() => {
    if (isSubmitted.value && formErr) {
      toast.error('something went wrong');
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !formErr) {
      toast.success(`Education ${type === CONSTANTS.EDIT ? 'edited' : 'added'} Successfully`);

      dispatch(getCandidateWorkEducationDetails(candidateIdData?.cand_org_id));
      isOpenModal.onFalse();
      isSubmitted.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErr, isSubmitted]);

  // search colleges
  const handleKeySearchColleges = (event) => {
    const name = event.target.value;
    if (name.length > 1) {
      dispatch(searchCollege(name));
    }
  };
  return (
    <Dialog
      open={isOpenModal.value}
      onClose={isOpenModal.onFalse}
      PaperProps={{ sx: { borderRadius: 1, width: 800, p: 3 } }}
    >
      <Stack spacing={1}>
        <Typography variant="h6">Add Education</Typography>
        <Typography variant="body2" color="#637381">
          Title, short description, image...
        </Typography>
      </Stack>
      <Divider sx={{ mt: 3 }} />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Education Type" required />

              <Field.Autocomplete
                options={constants.education_type}
                getOptionLabel={(option) => option.variant}
                name="type"
                placeholder="Select Education Type"
              />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Course Type" required />

              <Field.Autocomplete
                options={constants.course_type}
                getOptionLabel={(option) => option.variant}
                name="course_type"
                placeholder="Select Course Type"
              />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="University/College" required />

              <Stack gap={2}>
                <Field.Autocomplete
                  options={collegeData}
                  handleSearch={handleKeySearchColleges}
                  getOptionLabel={(option) => option.name}
                  name="college_name"
                  placeholder="Select College Name"
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
              <CustomLabel title="Course" required />

              <Stack gap={2}>
                <Field.Autocomplete
                  options={constants.courses}
                  getOptionLabel={(option) => option.variant}
                  name="course"
                  placeholder="Select Course"
                />
                <Box display="flex" gap={1} color="#637381">
                  <Iconify icon="material-symbols:info" width={18} />
                  <Typography variant="caption">Type slowly to search your company</Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Specialization" required />

              <Field.Text name="specialization" placeholder="Enter Specialization" />
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
                      views={['year', 'month']}
                      format="MM/yyyy"
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
                      maxDate={new Date()}
                      views={['year', 'month']}
                      format="MM/yyyy"
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
            <Stack mt={3} direction="row" justifyContent="end" spacing={2}>
              <Button variant="soft" color="error" onClick={isOpenModal.onFalse}>
                Cancel
              </Button>
              <LoadingButton
                color="success"
                type="submit"
                startIcon={<Iconify icon="bxs:file" />}
                disabled={!candidateIdData?.cand_org_id}
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

export default AddEditEducationDetailsModal;
