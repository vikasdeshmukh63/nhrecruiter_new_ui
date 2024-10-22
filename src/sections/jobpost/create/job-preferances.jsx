import { useTheme } from '@emotion/react';
import { Icon } from '@iconify/react';
import { Box, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeLastMainStep,
  removeLastPreferanceStep,
  setMainCurrentSteps,
  setPreferanceCurrentSteps,
} from 'src/redux/slices/jobposts';
import Others from './others';
import TechnicalSkills from './technical-skills';

//! COMPONENT
const JobPreferances = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const evaluationFormRef = useRef(null);
  const technicalSKillFormRef = useRef(null);
  const otherFormRef = useRef(null);

  const handleSubmit = (currentStep) => {
    if (currentStep === 0) {
      technicalSKillFormRef?.current?.submitForm();
    }
    if (currentStep === 1) {
      otherFormRef?.current?.submitForm();
    }
  };

  // data
  const infoCardData = [
    {
      id: 0,
      title: 'Technical Skills',
      description: 'Profile Settings',
      stepId: 0,
      icon: <Icon icon="ph:gear-duotone" />,
    },
    {
      id: 1,
      title: 'Other',
      description: 'Update profile Security',
      stepId: 1,
      icon: <Icon icon="material-symbols-light:other-admission-outline" />,
    },
  ];

  // accessing data from redux store
  const { mainCurrentStep, preferenceStepsDone, preferenceCurrentStep, evaluationSwitch } =
    useSelector((state) => state.jobpost);

  // to change background color or the card only when its active
  const bgColor = (currentStep) => {
    if (preferenceStepsDone.includes(currentStep)) {
      return theme.palette.grey[200];
    }
    return 'transparent';
  };
  // funtion to handle go back to previous page function
  const handleBack = () => {
    // if mainCurrentStep is not zero then only we have to go back or reduce steps
    if (mainCurrentStep >= 0 && preferenceCurrentStep === 0) {
      dispatch(setMainCurrentSteps(mainCurrentStep - 1));
      dispatch(removeLastMainStep());
    }
    // if preferanceStep is greater than zero then only we go back in preferance steps
    if (preferenceCurrentStep > 0) {
      dispatch(setPreferanceCurrentSteps(preferenceCurrentStep - 1));
      dispatch(removeLastPreferanceStep());
    }
    // }
  };

  return (
    <Grid container>
      <Grid item md={12}>
        <Typography variant="h5" mt={6}>
          Job Details
        </Typography>
        <Divider sx={{ mt: 3, mb: 6 }} />
      </Grid>
      <Grid item md={3}>
        {/* vertical step info cards */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            gap: 3,
            flexDirection: { xs: 'row', md: 'column', lg: 'column' },
            pr: { xs: 0, md: 3 },
            pb: { xs: 3, md: 0 },
          }}
        >
          {infoCardData.map((item, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                bgcolor: bgColor(item.stepId),
              }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="h4">{item.icon}</Typography>
                </Grid>
                <Grid item>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: preferenceStepsDone.includes(item.stepId) ? 'primary' : 'inherit',
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
      </Grid>
      {/* vertical divider  */}
      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
      {/* right side form */}
      <Grid item md={8}>
        {/* Evaluation form  */}
        {/* {preferenceCurrentStep === 0 && <Evaluations ref={evaluationFormRef} />} */}
        {/* Technical skills form  */}
        {preferenceCurrentStep === 0 && <TechnicalSkills ref={technicalSKillFormRef} />}
        {/* Other form */}
        {preferenceCurrentStep === 1 && <Others ref={otherFormRef} />}
      </Grid>
      <Grid item md={12}>
        <Divider sx={{ mt: 6, mb: 3 }} />
      </Grid>
      <Grid
        item
        md={12}
        sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Button variant="outlined" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => handleSubmit(preferenceCurrentStep)}
        >
          {preferenceCurrentStep === 2 ? 'Review' : 'Continue'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default JobPreferances;
