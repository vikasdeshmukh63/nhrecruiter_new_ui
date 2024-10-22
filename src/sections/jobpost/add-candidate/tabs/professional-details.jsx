import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';

import { LoadingButton } from '@mui/lab';

import { Alert, Box, Stack, Button, Card, Divider, Grid, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { EXPERIENCE_LEVELS, EXPERIENCE_MONTHS } from 'src/utils/helperFunctions';

import { searchSkills } from 'src/redux/slices/skills';
import {
  addCandidateProfessionalDetails,
  searchLocation,
  setCandidateData,
} from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import CustomLabel from 'src/components/hook-form/label/custom-label';
import { Field, Form } from 'src/components/hook-form';

const getArrayByField = (array, id) => array.map((element) => element[id]).join(',');

const ProfessionalDetails = () => {
  // states
  const [formData, setFormData] = useState(null);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: '',
    variant: '',
  });
  const isSubmitted = useBoolean();

  // redux
  const {
    error: formErr,
    candidateIdData,
    candidateData,
    foundLocationData,
  } = useSelector((state) => state.jobpost);

  const { constants } = useSelector((state) => state.general);

  const { skills } = useSelector((state) => state.skills);
  const dispatch = useDispatch();

  // schema
  const professionalDetailsSchema = yup.object().shape({
    prof_summary: yup.string().required('Profile Summary is required'),
    exp_years: yup.object().required('Experience is required'),
    exp_months: yup.object().required('Month is required'),
    skills: yup.array().min(2, 'Must have at least 2 items'),
    cctc: yup.string().required('Current Ctc is required'),
    ectc: yup.string(),
    curr_location: yup.object().required('Current Location is required'),
    pref_location: yup.array().min(2, 'Must have at least 2 Locations'),
    not_period: yup.object().required('Notice Period is required'),
    remaining_days: yup.string().when('not_period', (not_period, schema) => {
      if (not_period.length && not_period[0] !== null && not_period[0].id === 6) {
        return schema.required('Remaining Days required');
      }
      return schema.notRequired();
    }),
  });

  //  defaultValues
  const defaultValues = {
    prof_summary: candidateData?.prof_summary || '',
    exp_years: candidateData?.exp_years || null,
    exp_months: candidateData?.exp_months || null,
    skills: candidateData?.skills || [],
    cctc: candidateData?.cctc || '',
    ectc: candidateData?.ectc || '',
    curr_location: candidateData?.curr_location || null,
    pref_location: candidateData?.pref_location || [],
    not_period: candidateData?.not_period || null,
    remaining_days: candidateData?.remaining_days || '',
  };

  // methods
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(professionalDetailsSchema),
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // on submit
  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      exp_years: data.exp_years.id,
      exp_months: data.exp_months.id,
      cctc: +data.cctc,
      ectc: +data.ectc,
      curr_location: data.curr_location.id.toString(),
      not_period: data.not_period.id,
      remaining_days: +data.remaining_days,
      skills: getArrayByField(data.skills, 'id'),
      pref_location: getArrayByField(data.pref_location, 'id'),
    };

    try {
      setFormData(data);
      await dispatch(addCandidateProfessionalDetails(candidateIdData?.cand_org_id, payload));
      isSubmitted.onTrue();
    } catch (err) {
      console.log(err);
    }
  });

  // search location
  const handleKeySearchLocation = (event) => {
    const location = event.target.value;
    if (location.length > 1) {
      dispatch(searchLocation(location));
    }
  };

  // search location
  const handleKeySearchSkills = (event) => {
    const skill = event.target.value;
    if (skill.length > 1) {
      dispatch(searchSkills(skill));
    }
  };

  // form submit
  useEffect(() => {
    if (isSubmitted.value && formErr) {
      setShowAlert({
        show: true,
        message: 'Something Went Wrong',
        variant: 'error',
      });
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !formErr) {
      setDisableSaveBtn(true);
      setShowAlert({
        show: true,
        message: 'Profile saved successfully!',
        variant: 'success',
      });

      dispatch(setCandidateData(formData));
      isSubmitted.onFalse();
      // reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErr, isSubmitted]);

  // show the alert
  useEffect(() => {
    let timer;
    if (showAlert.show) {
      timer = setTimeout(() => {
        setShowAlert({
          show: false,
          message: '',
          variant: '',
        });
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert.show]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h6">Professional Details</Typography>
        <Typography variant="body2" color="#637381">
          Title, short description, image...
        </Typography>
      </Stack>
      <Divider sx={{ mt: 3 }} />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container mt={2} spacing={2} justifyContent="flex-end">
          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Profile Summary" required />

              <Stack gap={2}>
                <Field.Text
                  name="prof_summary"
                  multiline
                  rows={3}
                  placeholder="A brief about your experiences"
                />
                <Box display="flex" gap={1} color="#637381">
                  <Iconify icon="material-symbols:info" width={18} />
                  <Typography variant="caption">
                    Write about a brief summary about your experiences and skills
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <CustomLabel title="Experience" required mb={2} />
            <Grid container spacing={2} sx={{ alignItems: 'start' }}>
              <Grid item xs={6}>
                <Field.Autocomplete
                  options={EXPERIENCE_LEVELS}
                  getOptionLabel={(option) => option.year}
                  name="exp_years"
                  placeholder="Experience"
                />
              </Grid>

              <Grid item xs={6}>
                <Field.Autocomplete
                  options={EXPERIENCE_MONTHS}
                  getOptionLabel={(option) => option.month}
                  name="exp_months"
                  placeholder="Month"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Skills" required />
              <Field.Autocomplete
                multiple
                type="multipleSelect"
                onKeyUp={handleKeySearchSkills}
                options={skills}
                getOptionLabel={(option) => option.name}
                label="Enter Your Skills"
                name="skills"
              />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Current CTC (in lakhs)" required />
              <Field.Text type="number" name="cctc" placeholder="CTC" />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Expected CTC (in lakhs)" />
              <Field.Text type="number" name="ectc" placeholder="CTC" />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Current Location" required />

              <Field.Autocomplete
                options={foundLocationData}
                handleSearch={handleKeySearchLocation}
                getOptionLabel={(option) => option.city}
                name="curr_location"
                placeholder="Location"
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Preferred Location" required />

              <Field.Autocomplete
                multiple
                type="multipleSelect"
                handleSearch={handleKeySearchLocation}
                options={foundLocationData}
                getOptionLabel={(option) => option.city}
                label="Preferred Locations"
                name="pref_location"
              />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Notice Period" required />

              <Field.Autocomplete
                options={constants?.notice_period}
                getOptionLabel={(option) => option.variant}
                name="not_period"
                placeholder="Notice period"
              />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            {watch().not_period?.id === 6 && (
              <Stack spacing={1}>
                <Typography variant="subtitle2">Remaining Days</Typography>
                <Field.Text name="remaining_days" type="number" placeholder="Remaining Days" />
              </Stack>
            )}
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                {showAlert.show && (
                  <Alert
                    sx={{ width: 1 }}
                    variant="outlined"
                    severity={showAlert.variant}
                    onClose={() => setShowAlert({ show: false, message: '', variant: '' })}
                  >
                    {showAlert.message}
                  </Alert>
                )}
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" justifyContent="end">
                  <LoadingButton
                    color="success"
                    type="submit"
                    startIcon={<Iconify icon="bxs:file" />}
                    disabled={disableSaveBtn || !candidateIdData?.cand_org_id}
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Save
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </Card>
  );
};
export default ProfessionalDetails;
