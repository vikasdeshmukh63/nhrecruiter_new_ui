import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { dispatch } from 'src/redux/store/store';
import {
  getCandidatesBasedOnJobId,
  searchCandidatesBasedOnJobId,
} from 'src/redux/slices/candidate';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';

import JobPostAddCandidatesTableRow from './job-post-add-candidates-table-row';
import JobPostAddCandidatesTableToolbar from './job-post-add-candidates-table-toolbar';
import JobPostAddCandidatesFiltersResult from './job-post-add-candidates-table-filters-result';

// status options
const STATUS_OPTIONS = [
  { id: 2, value: 'active', label: 'Active', statusValue: true },
  { id: 3, value: 'inactive', label: 'In-Active', statusValue: false },
  { id: 1, value: 'pending', label: 'Pending', statusValue: 'pending' },
];

// table heads
const TABLE_HEAD = [
  { id: 'name', label: 'Candidate Full Name' },
  { id: 'email', label: 'Email / Mobile #' },
  { id: 'screeningScore', label: 'Screening Score' },
  { id: 'interviewScore', label: 'Interview Score' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

// default filters
const defaultFilters = {
  status: 'all',
  name: '',
};

const JobPostAddCandidatesList = ({ table }) => {
  const [filters, setFilters] = useState(defaultFilters);

  const confirm = useBoolean();
  const [expandedItem, setExpandedItem] = useState(null);

  const canReset = !isEqual(defaultFilters, filters);

  const { individualJobPostData } = useSelector((state) => state.jobpost);
  const { candidatesData, itemCount } = useSelector((state) => state.candidate);

  const status = STATUS_OPTIONS?.find((ele) => ele.value === filters.status)?.statusValue;

  //  to detect when no data is there
  const notFound = (!candidatesData?.length && canReset) || !candidatesData?.length;

  // function to handle filters
  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  useEffect(() => {
    let timer;

    if (individualJobPostData?.Job_Id && !filters.name) {
      dispatch(
        getCandidatesBasedOnJobId(individualJobPostData?.Job_Id, table.page, table.rowsPerPage)
      );
    } else if (individualJobPostData?.Job_Id && filters.name) {
      timer = setTimeout(() => {
        dispatch(
          searchCandidatesBasedOnJobId(
            individualJobPostData?.Job_Id,
            filters.name,
            table.page,
            table.rowsPerPage
          )
        );
      }, 250);
    }

    return () => clearTimeout(timer);
  }, [filters.name, individualJobPostData?.Job_Id, table.page, table.rowsPerPage]);

  return (
    <Card>
      {/* table toolbar  */}
      <JobPostAddCandidatesTableToolbar onFilters={handleFilters} filters={filters} />

      {/* reset buttons */}
      {canReset && (
        <JobPostAddCandidatesFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={candidatesData?.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={candidatesData?.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              candidatesData.map((row) => row.id)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={confirm.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />

        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
          {/* table head  */}
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                candidatesData.map((row) => row.id)
              )
            }
          />

          <TableBody>
            {/* table rows  */}
            {candidatesData?.map((row) => (
              <JobPostAddCandidatesTableRow
                key={row.id}
                row={row}
                expandedItem={expandedItem}
                setExpandedItem={setExpandedItem}
                STATUS_OPTIONS={STATUS_OPTIONS}
                page={table.page}
                rowsPerPage={table.rowsPerPage}
                Status={status}
                filters={filters}
                selected={table.selected.includes(row.id)}
                onSelectRow={() => table.onSelectRow(row.id)}
              />
            ))}
            {/* no data component  */}
            <TableNoData notFound={notFound} />
          </TableBody>
        </Table>
      </TableContainer>

      {/* table pagination  */}
      <TablePaginationCustom
        count={itemCount}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[25, 50, 100]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        // onChangeDense={table.onChangeDense}
      />

      {/* confirm delete dialog */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </Card>
  );
};

export default JobPostAddCandidatesList;
