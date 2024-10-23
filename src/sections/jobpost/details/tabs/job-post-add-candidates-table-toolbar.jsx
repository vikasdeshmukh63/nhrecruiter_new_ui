import { useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { Box, Button, IconButton, InputAdornment, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';

import { Iconify } from 'src/components/iconify/iconify';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBulkCandidateSchedule,
  getCandidatesBasedOnJobId,
  searchCandidatesBasedOnJobId,
} from 'src/redux/slices/candidate';
import { useBoolean } from 'src/hooks/use-boolean';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export default function JobPostAddCandidatesTableToolbar({
  onFilters,
  filters,
  numSelected,
  table,
}) {
  const popover = usePopover();
  const { individualJobPostData } = useSelector((state) => state.jobpost);
  const { error } = useSelector((state) => state.candidate);
  const isSubmitted = useBoolean();

  const dispatch = useDispatch();
  // handling the search
  const handleFilter = useCallback(
    (event) => {
      const { value } = event.target;
      onFilters('name', value);
    },
    [onFilters]
  );

  const handleSchduleInterview = async () => {
    const candidates = table.selected.map((candidate) => ({
      jpid: individualJobPostData.Job_Id,
      org_cand_id: candidate._org_cand_id.id,
      app_id: candidate.id,
    }));
    await dispatch(addBulkCandidateSchedule({ data: candidates }));
    isSubmitted.onTrue();
  };

  useEffect(() => {
    if (isSubmitted.value && error) {
      toast.error('Something went wrong');
    }
    if (isSubmitted.value && !error) {
      toast.success('Schedule created Successfully!');
      if (individualJobPostData?.Job_Id && !filters.name) {
        dispatch(
          getCandidatesBasedOnJobId(individualJobPostData?.Job_Id, table.page, table.rowsPerPage)
        );
      } else if (individualJobPostData?.Job_Id && filters.name) {
        dispatch(
          searchCandidatesBasedOnJobId(
            individualJobPostData?.Job_Id,
            filters.name,
            table.page,
            table.rowsPerPage
          )
        );
      }
      table.setSelected([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitted]);
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
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 1 }}>
          {/* filter */}
          <Box flexGrow={1}>
            <TextField
              fullWidth
              value={filters.name}
              onChange={handleFilter}
              placeholder="Search by Name, Email or Mobile No..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            disabled={!numSelected}
            variant="contained"
            startIcon={<Iconify icon="mdi:tick-circle-outline" />}
            onClick={handleSchduleInterview}
          >
            Schedule Interview
          </Button>

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
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
      </CustomPopover>
    </>
  );
}
