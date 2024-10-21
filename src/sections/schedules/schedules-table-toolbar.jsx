import { debounce } from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

import { searchJobPost } from 'src/redux/slices/jobposts';

import { usePopover } from 'src/components/custom-popover';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export default function SchedulesTableToolbar({ onFilters, selectedJobPost, setSelectedJobPost }) {
  // search state
  const [searched, setSearched] = useState(false);

  const popover = usePopover();
  const dispatch = useDispatch();

  // extracting data from redux store
  const { jobPosts, error } = useSelector((state) => state.jobpost);

  // search function to search jobs
  const debouncedSearchJobPost = debounce((value) => {
    if (value.length > 3) {
      dispatch(searchJobPost(value));
    }
  }, 300);

  // handling the jobpost filter
  const handleFilterJobPost = useCallback(
    (event) => {
      const { value } = event.target;
      debouncedSearchJobPost(value);
      setSearched(true);
      onFilters('jobpost', value);
    },
    [debouncedSearchJobPost, onFilters]
  );

  // handle filter value change
  const handleFilterValueChange = (newValue) => {
    newValue = newValue === null ? '' : newValue;
    // setting the autocomplete value
    setSelectedJobPost(newValue);
    // setting the filter values
    onFilters('jobpost', newValue);
  };

  // to show the notifications for delete operations
  useEffect(() => {
    if (searched && !error) {
      setSearched(false);
    }
    if (searched && error) {
      toast.error('Something Went Wrong');
      setSearched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, searched]);

  return (
    <>
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
          {/* search by job */}
          <Autocomplete
            fullWidth
            onKeyUp={handleFilterJobPost}
            options={jobPosts || []}
            value={selectedJobPost}
            onChange={(_, newValue) => handleFilterValueChange(newValue)}
            getOptionLabel={(option) => {
              if (option.title) return option.title;
              if (typeof option.title === 'string') return option.title;
              return '';
            }}
            label="Select Job Post"
            renderInput={(params) => <TextField {...params} label="Select Job Post" />}
          />

          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </Stack>
      </Stack>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover> */}
    </>
  );
}
