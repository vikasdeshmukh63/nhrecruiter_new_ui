import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  InputAdornment,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import {
  resetAdditionalCandidateAdditionalData,
  resetCandidateData,
} from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import { getComparator, TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { applyFilter } from 'src/components/phone-input/utils';
import { Scrollbar } from 'src/components/scrollbar';

// table head
const TABLE_HEAD = [
  { id: 'name', label: 'Candidate Name' },
  { id: 'email', label: 'Email /  Mobile #', align: 'center' },
  { id: '', width: 100 },
];
const candidateList = [
  // {
  //   id: 1,
  //   name: 'Ramesh Sharma',
  //   email: 'amish@gmail.com',
  //   mobno: '7676578767',
  // },
  // {
  //   id: 2,
  //   name: 'Ramesh Sharma',
  //   email: 'amish@gmail.com',
  //   mobno: '7676578767',
  // },
  // {
  //   id: 3,
  //   name: 'Ramesh Sharma',
  //   email: 'amish@gmail.com',
  //   mobno: '7676578767',
  // },
];

const defaultFilters = {
  status: 'all',
  name: '',
};
const JobPostAddCandidateModal = ({ openCandidateModal }) => {
  const candidateTable = useTable();
  const [filters, setFilters] = useState(defaultFilters);

  const dispatch = useDispatch();
  const router = useRouter();

  // filtered the data
  const dataFiltered = applyFilter({
    inputData: candidateList,
    comparator: getComparator(candidateTable.order, candidateTable.orderBy),
  });

  const handleChange = (event) => {
    const { value } = event.target;
    setFilters((prev) => ({
      name: value,
    }));
  };

  const handleSelectCandidate = (row) => {
    candidateTable.onSelectRow(row.id);
  };
  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!candidateList?.length && canReset) || !candidateList?.length;

  const handleAddCandidate = async () => {
    await dispatch(resetCandidateData());
    await dispatch(resetAdditionalCandidateAdditionalData());
    router.push('/application/jobposts/add-candidate/');
  };
  return (
    <Dialog
      open={openCandidateModal.value}
      onClose={openCandidateModal.onFalse}
      PaperProps={{ sx: { borderRadius: 1, width: 720 } }}
    >
      <Stack spacing={1} p={3}>
        <Typography variant="h6">Add Candidate</Typography>
        <Typography variant="body2" color="#637381">
          Title, short description, image...
        </Typography>
      </Stack>
      <Divider />
      <Stack spacing={1} p={3}>
        <Typography variant="subtitle2">Search for Candidate</Typography>
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleChange}
          placeholder="Search by Email or Mobile No"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          startIcon={<Iconify icon="bxs:file" />}
          onClick={handleAddCandidate}
          variant="contained"
          color="success"
        >
          Add Candidate
        </Button>
        <Stack mt={3} direction="row" justifyContent="end" spacing={2}>
          <Button variant="outlined" color="error">
            Cancel
          </Button>
          <Button startIcon={<Iconify icon="bxs:file" />} variant="contained" color="success">
            Submit
          </Button>
        </Stack>
      </Stack>

      {/* <Stack spacing={1} p={3}>
        <Typography variant="subtitle2">Select Candidate</Typography>
        <TableContainer sx={{ position: 'relative', overflow: 'unset', borderRadius: 2 }}>
          <Scrollbar>
            <Table size={candidateTable.dense ? 'small' : 'medium'} sx={{ minWidth: 400 }}>
              <TableHeadCustom
                order={candidateTable.order}
                orderBy={candidateTable.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={candidateTable.selected.length}
                onSort={candidateTable.onSort}
                // onSelectAllRows={(checked) => selectAllRows(checked)}
              />

              <TableBody>
                {dataFiltered.map((row) => (
                  <TableRow hover key={row.id} selected={candidateTable.selected.includes(row.id)}>
                    <TableCell> {row.name} </TableCell>
                    <TableCell sx={{ alignItems: 'center' }}>
                      <ListItemText
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        primary={row?.email}
                        secondary={row?.mobno}
                        primaryTypographyProps={{ typography: 'body2' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        color="info"
                        variant="contained"
                        startIcon={<Iconify icon="mdi:eye" />}
                        onClick={() => handleSelectCandidate(row)}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                <TableNoData
                  imgUrl="/assets/icons/empty/ic_cart.svg"
                  title="No candidates found with given email/mobile!"
                  notFound={notFound}
                  child={
                    <Stack direction="row" spacing={3} my={4}>
                      <Button
                        startIcon={<Iconify icon="bxs:file" />}
                        variant="contained"
                        color="success"
                      >
                        Add Candidate
                      </Button>
                    </Stack>
                  }
                />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Stack> */}
    </Dialog>
  );
};

export default JobPostAddCandidateModal;
