import 'react-quill/dist/quill.snow.css';

import * as yup from 'yup';
import dynamic from 'next/dynamic';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button, Divider, ListItem, TextField, Typography, Stack, Box } from '@mui/material';

import { finderFunction } from 'src/utils/helperFunctions';

import { searchCompanies } from 'src/redux/slices/company';
import {
  setJobData,
  setMainSteps,
  removeJobData,
  setPreferanceSteps,
  setMainCurrentSteps,
  resetEvaluationSwitch,
  setPreferanceCurrentSteps,
} from 'src/redux/slices/jobposts';

import { Field, Form } from 'src/components/hook-form';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

// schema
const jobDetailsSchema = yup.object().shape({
  jobTitle: yup.string().required('Job Title is Required'),
  jobDescription: yup.string().required('Job Description is Required'),
  company: yup.object().required('Company is required').nullable(),
});

// ! COMPONENT
const AddJobDetails = () => {
  // using useDispatch and useRouter
  const dispatch = useDispatch();
  const router = useRouter();

  // accessing data from redux store
  const { jobData, individualJobPostData } = useSelector((state) => state.jobpost);
  const { companies } = useSelector((state) => state.company);

  const [queryLength, setQueryLength] = useState(0);

  // initial values
  const defaultValues = {
    jobTitle: jobData?.jobTitle || '',
    jobDescription: jobData?.jobDescription || '',
    company:
      finderFunction('id_str', jobData?.company?.id_str, companies) || jobData?.company?.name
        ? {
            name: jobData?.company?.name,
            id_str: jobData?.company?.id_str,
          }
        : null,
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(jobDetailsSchema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = methods;

  const onsubmit = handleSubmit(async (values) => {
    values = { ...values, jobDescription: values.jobDescription };
    // storing values in redux store
    dispatch(setJobData(values));
    // setting current step in record
    dispatch(setMainSteps(1));
    // changing current step
    dispatch(setMainCurrentSteps(1));
  });

  // for setting current step in redux store
  useEffect(() => {
    dispatch(setMainSteps(0));
    dispatch(setMainCurrentSteps(0));
    dispatch(setPreferanceSteps(0));
    dispatch(setPreferanceCurrentSteps(0));
  }, [dispatch]);

  // funtion to handle go back to previous page function
  const handleBack = () => {
    router.back();
    dispatch(removeJobData({}));
    dispatch(resetEvaluationSwitch());
  };

  // to search companies based on typed value after keypress event
  const handleKeyUpForCompanies = (event) => {
    const query = event.target.value.toString();
    setQueryLength(query.length);
    if (query.length >= 3) {
      dispatch(searchCompanies(query));
    }
  };
  useEffect(() => {
    if (jobData) {
      setValue('jobTitle', jobData?.jobTitle);
    }
  }, [jobData, setValue]);

  return (
    <Form onSubmit={onsubmit} methods={methods}>
      <Typography variant="h5" mt={6}>
        Job Details
      </Typography>
      <Divider sx={{ mt: 3, mb: 6 }} />
      <Stack spacing={3}>
        {/* Job Organization and companies */}
        <Grid container>
          <Grid
            item
            lg={6}
            md={6}
            xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 3,
            }}
          >
            <Icon icon="octicon:organization-16" fontSize={20} />

            <Typography sx={{ pt: 0.5 }}>Job Organization</Typography>
          </Grid>
          <Grid item lg={6} md={6} xs={6} position="relative">
            <Field.Autocomplete
              disabled={individualJobPostData?.status}
              onKeyUp={handleKeyUpForCompanies}
              freeSolo
              options={
                companies === null && queryLength >= 3
                  ? [{ name: 'No organization found' }]
                  : companies || []
              }
              name="company"
              label="Job Organization"
              getOptionLabel={(option) => {
                if (option.name) return option.name;
                if (typeof option.name === 'string') return option.name;
                return '';
              }}
              filterOptions={(option) => option}
              renderInput={(params) => <TextField {...params} label="Job Organization" />}
              renderOption={(props, option) => {
                if (option.name === 'No organization found') {
                  return (
                    <>
                      <ListItem {...props} style={{ pointerEvents: 'none' }}>
                        No organization found
                      </ListItem>

                      <ListItem
                        {...props}
                        sx={{
                          '&:hover': {
                            bgcolor: 'lightgray',
                          },
                        }}
                        onClick={() => router.push('/admin/companies/')}
                      >
                        Create a new Company
                      </ListItem>
                    </>
                  );
                }
                return <ListItem {...props}>{option.name}</ListItem>;
              }}
            />
          </Grid>
        </Grid>
        {/* job title  */}
        <Grid container>
          <Grid
            item
            lg={6}
            md={6}
            xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 3,
            }}
          >
            <Icon icon="solar:suitcase-linear" fontSize={20} />

            <Typography sx={{ pt: 0.5 }}>Job Title</Typography>
          </Grid>
          <Grid item lg={6} md={6} xs={6}>
            <Field.Text
              disabled={
                individualJobPostData
                  ? individualJobPostData?.status !== 2 && individualJobPostData?.status !== 1
                  : false
              }
              fullWidth
              id="outlined-multiline-flexible"
              name="jobTitle"
              label="Job Title"
            />
          </Grid>
        </Grid>
        {/* job description  */}
        <Grid container>
          <Grid
            item
            lg={6}
            md={6}
            xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 3,
            }}
          >
            <Icon icon="fluent:text-description-16-filled" fontSize={20} />

            <Typography sx={{ pt: 0.5 }}>Job Description</Typography>
          </Grid>
          <Grid item lg={6} md={6} xs={6}>
            <Field.Editor
              simple
              name="jobDescription"
              readOnly={
                individualJobPostData
                  ? individualJobPostData?.status !== 2 && individualJobPostData?.status !== 1
                  : false
              }
              placeholder="Job Description"
            />
          </Grid>
        </Grid>
      </Stack>

      <Divider sx={{ mt: 3, mb: 3 }} />

      <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outlined" onClick={handleBack}>
          Back
        </Button>
        <Button
          disabled={!watch('company') || watch('company')?.name === 'No organization found'}
          variant="contained"
          type="submit"
        >
          Continue
        </Button>
      </Box>
    </Form>
  );
};

export default AddJobDetails;
