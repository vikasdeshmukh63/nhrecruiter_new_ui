'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';

import { Box, Tab, Card, Tabs, Stack, Divider, Typography } from '@mui/material';

import { capitalizeFirstLetter } from 'src/utils/helperFunctions';

import { CandidateAssesmentView } from '../candidate-assesment-view';
import { CandidateProfessionalView } from '../candidate-professional-view';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}> {children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const CandidateScoreView = ({ id }) => {
  // extract the data from redux
  const { candidateInterviewData } = useSelector((state) => state.candidate);
  const [value, setValue] = useState(0);
  const [isIdChanged, setIsIdChanged] = useState(true);

  const theme = useTheme();
  // function to handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (id) {
      setIsIdChanged(false);
    }
  }, [id]);
  return (
    <Box>
      <Typography variant="h4" textAlign="center">
        {capitalizeFirstLetter(candidateInterviewData?.CAND_Name)} Interview Assessment
      </Typography>
      <Card sx={{ p: 3, mt: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            '& a': {
              minHeight: 'auto',
              minWidth: 10,
              py: 1.5,
              px: 1,
              mr: 2.2,
              color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& a.Mui-selected': {
              color: theme.palette.primary.main,
            },
            '& a > svg': {
              mb: '0px !important',
              mr: 1.1,
            },
          }}
        >
          <Tab label="Assessment" {...a11yProps(0)} />
          <Tab label="Professsional" {...a11yProps(1)} />
        </Tabs>
        <Divider />
        <TabPanel value={value} index={0}>
          <Stack spacing={2}>
            <CandidateAssesmentView isIdChanged={isIdChanged} id={id} />
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CandidateProfessionalView />
        </TabPanel>
      </Card>
    </Box>
  );
};

export default CandidateScoreView;
