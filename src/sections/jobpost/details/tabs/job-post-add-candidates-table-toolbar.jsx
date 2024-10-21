import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { IconButton, InputAdornment, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';

import { Iconify } from 'src/components/iconify/iconify';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function JobPostAddCandidatesTableToolbar({ onFilters, filters }) {
  const popover = usePopover();
  // handling the search
  const handleFilter = useCallback(
    (event) => {
      const { value } = event.target;
      onFilters('name', value);
    },
    [onFilters]
  );

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
          {/* filter */}
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
