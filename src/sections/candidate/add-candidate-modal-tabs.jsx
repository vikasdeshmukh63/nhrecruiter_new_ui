import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import BulkInviteTab from './bulk-invite-tab';
import ManualInviteTab from './manual-invite-tab';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function AddCandidateModalTabs({ openAdd }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Bulk Invite" {...a11yProps(0)} icon={<Icon fontSize={30} icon="ph:users-four-duotone"/>}/>
          <Tab label="Manual Invite" {...a11yProps(1)} icon={<Icon fontSize={30} icon="mdi:invite"/>}/>
        </Tabs>
      </Box>
      {/* bulk invite */}
      <CustomTabPanel value={value} index={0}>
        <BulkInviteTab openAdd={openAdd} />
      </CustomTabPanel>

      {/* manual invite  */}
      <CustomTabPanel value={value} index={1}>
        <ManualInviteTab openAdd={openAdd} />
      </CustomTabPanel>
    </Box>
  );
}

AddCandidateModalTabs.propTypes = {
  openAdd: PropTypes.any,
};
