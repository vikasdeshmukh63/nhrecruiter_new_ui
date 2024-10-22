import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Chip,
  Button,
  Drawer,
  Slider,
  Switch,
  Divider,
  TextField,
  IconButton,
  Typography,
  Autocomplete,
  drawerClasses,
  Stack,
} from '@mui/material';

import { paper } from 'src/theme/css';
import { searchSkills } from 'src/redux/slices/skills';

// ----------------------------------------------------------------------

const FilterDrawer = ({ filtersDrawer, setFiltersObj }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  // states
  const [experience, setExperience] = useState([0, 10]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [hasCodingEvaluation, setHasCodingEvaluation] = useState(false);

  // extracting data from the redux
  const { skills } = useSelector((state) => state.skills);

  // function to set the experience slider
  const handleExperience = (event, newValue) => {
    setExperience(newValue);
  };

  // function to handle the skills input change
  const handleSkillsInputChange = (value) => {
    if (value) {
      setSelectedSkills(value);
    }
  };

  // function to handle the apply filter
  const handleApplyFilter = async () => {
    await setFiltersObj((prev) => ({
      ...prev,
      experience,
      iscodingevaluation: hasCodingEvaluation,
      skills: selectedSkills.map((i) => i.id),
    }));
  };

  // function to handle the search skills
  const handleKeyUp = async (e) => {
    const query = e.target.value;
    if (query.length > 3) {
      await dispatch(searchSkills(query));
    }
  };

  // funciton to handle switch change
  const handleSwitchChange = (event) => {
    setHasCodingEvaluation(event.target.checked);
  };

  // function to handle reset feature
  const handleReset = async () => {
    filtersDrawer.onFalse();
    setExperience([0, 10]);
    setSelectedSkills([]);
    setHasCodingEvaluation(false);

    await setFiltersObj((prev) => ({
      ...prev,
      experience: [],
      iscodingevaluation: false,
      skills: [],
    }));
  };

  return (
    <Drawer
      anchor="right"
      open={filtersDrawer.value}
      onClose={filtersDrawer.onFalse}
      slotProps={{
        backdrop: { invisible: true },
      }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          ...paper({ theme, bgcolor: theme.palette.background.default }),
          width: 600,
        },
      }}
    >
      {/* title and refresh button  */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={3}>
        <Typography variant="body1" fontWeight={600}>
          Filters
        </Typography>
        <IconButton onClick={handleReset}>
          <Icon icon="material-symbols:refresh" />
        </IconButton>
      </Stack>

      <Divider />

      {/* experience filter  */}
      <Stack sx={{ width: '100%' }} p={3}>
        <Typography variant="body1" fontWeight={600}>
          Experience
        </Typography>

        <Slider
          step={1}
          min={0}
          max={10}
          marks
          value={experience}
          color="success"
          onChange={handleExperience}
          valueLabelDisplay="on"
        />
      </Stack>

      {/* has coding filter  */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={3}>
        <Typography variant="body1" fontWeight={600}>
          Has Coding Round
        </Typography>
        <Switch color="success" checked={hasCodingEvaluation} onChange={handleSwitchChange} />
      </Stack>

      {/* skills filter  */}
      <Stack p={3} spacing={2}>
        <Typography>Skills</Typography>
        <Autocomplete
          fullWidth
          multiple
          onKeyUp={(value) => handleKeyUp(value)}
          value={selectedSkills}
          onChange={(event, newValue) => handleSkillsInputChange(newValue)}
          limitTags={3}
          options={skills || []}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} placeholder="Search skills by name..." />}
          renderOption={(props, option) => (
            <li {...props} key={option?.id}>
              {option?.name}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option?.id}
                label={option?.name}
                size="small"
                color="primary"
                variant="soft"
              />
            ))
          }
        />
        {/* action button  */}
        <Button fullWidth size="large" variant="contained" onClick={handleApplyFilter}>
          Apply
        </Button>
      </Stack>
    </Drawer>
  );
};

export default FilterDrawer;
