import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const sortOptions = {
  name: 'Name',
  finalscore: 'Score',
  jobfitscore: 'Job Fit Score',
  ivdate: 'Interview Date',
};
export default function JobPostTableToolbar({ filters, onFilters }) {
  const popover = usePopover();
  const dispatch = useDispatch();

  // extracting data from redux
  const { companies } = useSelector((state) => state.company);

  // handling the name filter
  const handleFilterName = useCallback(
    (event) => {
      onFilters('title', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        {/* search by name  */}
        <Box width={0.5}>
          <TextField
            fullWidth
            value={filters.title}
            onChange={handleFilterName}
            placeholder="Search by Job Title"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box gap={1} width={0.5} display="flex" justifyContent="end">
          <Button
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            disableRipple
            endIcon={<Icon icon="ion:filter" />}
            variant="text"
          >
            Filters
          </Button>
          <Button endIcon={<Icon icon="ep:arrow-down-bold" />}>Sort By:Latest</Button>
          {/* <Menu
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
        </Menu> */}
        </Box>
      </Stack>
    </Stack>
  );
}
