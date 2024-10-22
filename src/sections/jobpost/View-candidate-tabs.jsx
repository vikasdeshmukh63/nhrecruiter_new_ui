import React from 'react';

// next js imports

import Link from 'next/link';
// assets
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';

import { useTheme } from '@mui/material/styles';
// material-ui
import { Box, Tab, Tabs, Typography } from '@mui/material';

import MediaTab from './candidates/Media-tab';
import InterviewStatus from './candidates/Interview-status';
import CandidateProfile from './candidates/Candidate-profile';

// tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// ================================|| UI TABS - SAMPLE ||================================ //

export default function ViewCandidateTabs({ profileData, type, canDownload }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const candId = type === 'default' ? profileData?.CAND_Id : profileData?.id_str;

  return (
    <>
      <Tabs
        value={value}
        variant="scrollable"
        onChange={handleChange}
        sx={{
          mb: 3,
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
        <Tab
          component={Link}
          href="#"
          icon={<Icon icon="iconoir:check-circled-outline" fontSize="18px" />}
          label="Interview Status"
          {...a11yProps(0)}
        />
        <Tab
          component={Link}
          href="#"
          icon={<Icon icon="material-symbols:movie-outline" fontSize="18px" />}
          label="Media"
          {...a11yProps(1)}
        />
        <Tab
          component={Link}
          href="#"
          icon={<Icon icon="gg:profile" fontSize="18px" />}
          label="Profile"
          {...a11yProps(2)}
        />
      </Tabs>
      {/* interview status */}
      <TabPanel value={value} index={0}>
        <InterviewStatus profileData={profileData} type={type} />
      </TabPanel>
      {/* media */}
      <TabPanel value={value} index={1}>
        <MediaTab />
      </TabPanel>
      {/* profile */}
      <TabPanel value={value} index={2}>
        <CandidateProfile profileData={profileData} type={type} canDownload={canDownload} />
      </TabPanel>
    </>
  );
}
