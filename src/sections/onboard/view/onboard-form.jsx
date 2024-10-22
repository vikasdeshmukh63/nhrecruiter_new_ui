'use client';

import { useState } from 'react';

import { Box, Step, Stepper, StepLabel, Typography } from '@mui/material';

import ConfirmStepForm from '../Tabs/confirm-step-from';
import OnboardStepOneDetailsForm from '../Tabs/onboard-step-one-detais-form';
import OnboardStepTwoDetailsForm from '../Tabs/onboard-step-two-detais-form';

// ----------------------------------------------------------------------

export default function OnboardForm({ type, steps }) {
  // states
  const [activeStep, setActiveStep] = useState(0);

  // function to go to next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // function to go to previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: '700px', margin: '0 auto' }}>
      {/* main title  */}
      <Typography my={2} variant="h4" textAlign="center">
        Onboard {type}
      </Typography>

      {/* steper  */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconProps={{
                classes: {
                  root: 'stepIcon',
                },
              }}
              classes={{
                label: 'stepLabel',
              }}
            >
              <span>{label}</span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* organization form  */}
      <>
        {activeStep === 0 && (
          <OnboardStepOneDetailsForm
            handleBack={handleBack}
            handleNext={handleNext}
            steps={steps}
            activeStep={activeStep}
          />
        )}

        {/* recruiters form  */}
        {activeStep === 1 && (
          <OnboardStepTwoDetailsForm
            handleBack={handleBack}
            handleNext={handleNext}
            steps={steps}
            activeStep={activeStep}
          />
        )}

        {/* confirm form  */}
        {activeStep === 2 && (
          <ConfirmStepForm
            setActiveStep={setActiveStep}
            handleBack={handleBack}
            handleNext={handleNext}
            steps={steps}
            type={type}
            activeStep={activeStep}
          />
        )}
      </>
    </Box>
  );
}
