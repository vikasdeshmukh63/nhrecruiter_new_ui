'use client';

import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import {
  Chip,
  Grid,
  Menu,
  Button,
  Slider,
  MenuItem,
  TextField,
  Typography,
  Autocomplete,
  ToggleButton,
  InputAdornment,
  ToggleButtonGroup,
  Stack,
  Box,
} from '@mui/material';

import { filtersForInstantHire, searchJobTitles } from 'src/redux/slices/instantHire';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

const sortOptions = {
  name: 'Name',
  finalscore: 'Score',
  jobfitscore: 'Job Fit Score',
  ivdate: 'Interview Date',
};

// ----------------------------------------------------------------------

const ViewInstantHireToolbar = ({ filtersDrawer, setFiltersObj, isFilterApplied, filtersObj }) => {
  const dispatch = useDispatch();

  // states
  const [score, setScore] = useState([0, 10]);
  const [jobFitScore, setJobFitScore] = useState([0, 10]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [order, setOrder] = useState('1');
  const [selectedJob, setSelectedJob] = useState([]);

  // extracting data from redux
  const { jobTitles, error, candidates } = useSelector((state) => state.instantHire);

  // function to handle search input change
  const handleSearchInputChange = (value) => {
    if (value) {
      setSelectedJob(value);
    }
  };

  // function to handle change sort
  const handleChangeSort = async (value = 'name') => {
    await setFiltersObj((prev) => ({ ...prev, sort: value }));
  };

  // function to change the order as asc or dsc
  const handleChangeOrder = useCallback(
    (event, newOrder) => {
      if (newOrder !== null) {
        setOrder(newOrder);
        setFiltersObj((prev) => ({ ...prev, order: newOrder }));
      }
    },
    [setFiltersObj]
  );

  // function to change the score
  const handleChangeScore = (event, newValue) => {
    setScore(newValue);
  };

  // function to change the job fit score
  const handleJobFitScore = (event, newValue) => {
    setJobFitScore(newValue);
  };

  // function to search the job titles on typing
  const handleKeyUp = async (e) => {
    const query = e.target.value;
    if (query.length > 3) {
      await dispatch(searchJobTitles(query));
    }
  };

  // handle right sidebar dropdown menu
  const handleClickSort = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  // function to set anchorEl state
  const handleCloseSort = () => {
    setAnchorEl(null);
  };

  // function to apply filters
  const handleApplyFilters = async () => {
    // setFiltersObj((prev) => ({
    //   ...prev,
    //   jobtitleid: selectedJob.map((i) => i.id),
    //   jobfitscore: jobFitScore,
    //   finalscore: score,
    // }));
    await dispatch(
      filtersForInstantHire({
        ...filtersObj,
        jobtitleid: selectedJob.map((i) => i.id),
        jobfitscore: jobFitScore,
        finalscore: score,
      })
    );
    isFilterApplied.onTrue();
  };

  // function to show notification
  useEffect(() => {
    if (error && isFilterApplied.value) {
      toast.error('Something went Wrong', { variant: 'error' });
      isFilterApplied.onFalse();
    }
    if (!error && isFilterApplied.value) {
      isFilterApplied.onFalse();
    }
  }, [error, isFilterApplied]);

  return (
    <Grid container spacing={6}>
      {/* search job post field  */}
      <Grid item lg={6} sm={12}>
        <Stack spacing={1}>
          <Autocomplete
            fullWidth
            multiple
            onKeyUp={(value) => handleKeyUp(value)}
            onChange={(event, newValue) => handleSearchInputChange(newValue)}
            limitTags={3}
            options={jobTitles || []}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by job title or role..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Icon icon="carbon:search" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                  size="small"
                  color="primary"
                  variant="soft"
                />
              ))
            }
          />
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="ic:twotone-info" />
            <Typography variant="caption">For ex: Senior Software Developer</Typography>
          </Box>
        </Stack>
      </Grid>

      {/* score filter  */}
      <Grid item lg={2.5} sm={6}>
        <Stack sx={{ width: '100%' }}>
          <Typography variant="body1" fontWeight={600}>
            Score
          </Typography>

          <Slider
            step={1}
            min={0}
            max={10}
            marks
            value={score}
            color="success"
            onChange={handleChangeScore}
            valueLabelDisplay="on"
          />
        </Stack>
      </Grid>

      {/* job fit score filter  */}
      <Grid item lg={2.5} sm={6}>
        <Stack sx={{ width: '100%' }}>
          <Typography variant="body1" fontWeight={600}>
            Job Fit Score
          </Typography>

          <Slider
            step={1}
            min={0}
            max={10}
            marks
            value={jobFitScore}
            color="success"
            onChange={handleJobFitScore}
            valueLabelDisplay="on"
          />
        </Stack>
      </Grid>
      <Grid item lg={1} sm={12}>
        <Button fullWidth variant="contained" size="large" onClick={handleApplyFilters}>
          <Icon fontSize={25} icon="carbon:search" />
        </Button>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body1">
          Found <span style={{ color: 'green', fontWeight: 800 }}>{candidates.length}</span>{' '}
          candidates
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          {/* filter button  */}
          <Button endIcon={<Icon icon="bi:filter" />} onClick={filtersDrawer.onTrue}>
            Filters
          </Button>

          {/* sort button  */}
          <Button
            onClick={handleClickSort}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClickSort(e);
              }
            }}
            endIcon={<Icon icon="ep:arrow-down-bold" />}
          >
            Sort By: {sortOptions[filtersObj.sort]}
          </Button>
          <Menu
            id="simple-menu"
            keepMounted
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseSort}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handleChangeSort('name')}>Name</MenuItem>
            <MenuItem onClick={() => handleChangeSort('finalscore')}>Score</MenuItem>
            <MenuItem onClick={() => handleChangeSort('jobfitscore')}>Job Fit Score</MenuItem>
            <MenuItem onClick={() => handleChangeSort('ivdate')}>Interview Date</MenuItem>
          </Menu>

          {/* asc dsc button  */}
          <ToggleButtonGroup exclusive value={order} size="small" onChange={handleChangeOrder}>
            <ToggleButton value="1">
              <Icon icon="fa6-solid:arrow-up" />
            </ToggleButton>

            <ToggleButton value="-1">
              <Icon icon="fa6-solid:arrow-down" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ViewInstantHireToolbar;
