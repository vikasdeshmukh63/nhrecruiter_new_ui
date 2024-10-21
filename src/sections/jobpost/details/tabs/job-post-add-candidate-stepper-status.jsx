import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';

const STEPS = [
  { label: 'Sourced', icon: 'material-symbols:upload-file-outline' },
  { label: 'Screened', icon: 'mdi:tick-circle-outline' },
  { label: 'Scheduled', icon: 'uil:calender' },
  { label: 'Interviewed', icon: 'material-symbols:assignment-outline' },
  { label: 'Feedback', icon: 'material-symbols:feedback-outline' },
];

const JobPostAddCandidateStepperStatus = ({ activeStep }) => {
  const progressRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const lineRef = useRef(null);
  const stepperRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }
    return () => {
      if (progressRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(progressRef.current);
      }
    };
  }, []);

  const handleClassList = (val) => {
    const circles = stepperRef.current.childNodes;

    circles[val].childNodes[0].classList.add('fill');

    circles[val].childNodes[1].childNodes[0].style.color = '#00a76f';
    circles[val].childNodes[0].childNodes[0].style.color = 'white';
  };

  useEffect(() => {
    if (isVisible) {
      let val = 0;
      const progressBar = lineRef.current;

      const handleTransitionEnd = () => {
        handleClassList(val);
        val += 1;
        const progressWidth = (val / (STEPS.length - 1)) * 100;
        if (val <= activeStep) {
          if (progressWidth === 100) {
            progressBar.style.width = `${progressWidth - 2}%`;
            progressBar.style.left = 0;
          } else {
            progressBar.style.width = `${progressWidth}%`;
          }
        } else {
          if (progressWidth !== 125) {
            progressBar.style.width = `${progressWidth - 15}%`;
          }
          progressBar.removeEventListener('transitionend', handleTransitionEnd);
        }
      };

      const initialProgressWidth = (val / (STEPS.length - 1)) * 100;

      progressBar.style.width = `${initialProgressWidth}%`;

      progressBar.addEventListener('transitionend', handleTransitionEnd);
    }
  }, [activeStep, isVisible]);
  return (
    <Box className="container">
      <Box className="stepper-wrapper" ref={progressRef}>
        <Box className="progress-bar">
          <Box ref={lineRef} className="progress">
            <Box className="primary-pulse" />
            <Box className="secondary-pulse" />
            <Box className="tertiary-pulse" />
          </Box>
        </Box>
        <Box ref={stepperRef} className="main-stepper-container">
          {STEPS.map((step, index) => (
            <Box key={index} className="screen-indicator">
              <Box className="circle">
                <Iconify icon={step.icon} width={26} className="icon" />
              </Box>
              <Box position="absolute" bottom={-40}>
                <Typography variant="subtitle2" color="black" fontWeight={600}>
                  {step.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default JobPostAddCandidateStepperStatus;
