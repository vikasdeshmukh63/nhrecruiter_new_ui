'use client';

import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  setMainSteps,
  setPreferanceSteps,
  setMainCurrentSteps,
  setPreferanceCurrentSteps,
} from 'src/redux/slices/jobposts';

import { useSettingsContext } from 'src/components/settings';

import AddJobDetails from '../create/add-jobdetails';
import JobPreferances from '../create/job-preferances';
import VerifyJobPosting from '../create/verify-job-posting';

// data
const infoCardData = [
  {
    id: 0,
    title: 'Job Details',
    description: 'Provide details about the job',
    stepId: 0,
    icon: <Icon icon="ic:round-post-add" />,
  },
  {
    id: 1,
    title: 'Preferences',
    description: 'Add interview preferences',
    stepId: 1,
    icon: <Icon icon="tabler:checklist" />,
  },
  {
    id: 2,
    title: 'Verify & Confirm',
    description: 'Verify and submit',
    stepId: 2,
    icon: <Icon icon="bitcoin-icons:verify-filled" />,
  },
];

//! COMPONENT
const EditJobPost = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const settings = useSettingsContext();

  // accessing data from redux store
  const { mainStepsDone, mainCurrentStep, preferenceStepsDone, preferenceCurrentStep } =
    useSelector((state) => state.jobpost);

  // for setting current step in redux store
  useEffect(() => {
    dispatch(setMainSteps(0));
    dispatch(setMainCurrentSteps(0));
    dispatch(setPreferanceSteps(0));
    dispatch(setPreferanceCurrentSteps(0));
  }, [dispatch]);

  // to change background color or the card only when its active
  const bgColor = (currentStep) => {
    if (mainStepsDone.includes(currentStep)) {
      return theme.palette.grey[200];
    }
    return 'transparent';
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* page progress stepping */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 3 }}>
          {infoCardData.map((item, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                border: bgColor(item.stepId),
              }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="h3">{item.icon}</Typography>
                </Grid>
                <Grid item>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: mainStepsDone.includes(item.stepId) ? 'primary' : 'inherit',
                        fontWeight: 700,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="caption">{item.description}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Box>
        {/* showing add job details component only when we are on that step  */}
        {mainCurrentStep === 0 && <AddJobDetails />}
        {/* showing job preferences component only when we are on that step */}
        {mainCurrentStep === 1 && <JobPreferances />}
        {/* showing job Verify page component only when we are on that step  */}
        {mainCurrentStep === 2 && <VerifyJobPosting type="edit" />}
      </Container>
    </DashboardContent>
  );
};

export default EditJobPost;
