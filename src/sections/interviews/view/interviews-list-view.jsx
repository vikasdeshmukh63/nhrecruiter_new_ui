'use client';

import isEqual from 'lodash/isEqual';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { amber, blueGrey } from '@mui/material/colors';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { setDashboardFilter } from 'src/redux/slices/jobposts';
import { fetchInterviewList } from 'src/redux/slices/interviews';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import InterviewsTableRow from '../interviews-table-row';
import InterviewsTableToolbar from '../interviews-table-toolbar';
import InterviewsFiltersResult from '../interviews-table-filters-result';

// ----------------------------------------------------------------------

// status options
const STATUS_OPTIONS = [
  { value: 'all', label: 'All', statusValue: undefined },
  { value: 'scheduled', label: 'Scheduled', statusValue: [1, 5] },
  { value: 'completed', label: 'Completed', statusValue: 2 },
  { value: 'pending', label: 'Pending', statusValue: [3, 8, 9] },
  { value: 'cancelled', label: 'Cancelled', statusValue: 4 },
];

// table heads
const TABLE_HEAD = [
  { id: 'candidateName', label: 'Candidate Name / Interview #' },
  { id: 'jobPost', label: 'Job Post' },
  { id: 'scheduleDate', label: 'Schedule Date' },
  { id: 'status', label: 'Status', align: 'center' },
];

// default filters
const defaultFilters = {
  status: 'all',
  jobpost: '',
};

// ----------------------------------------------------------------------

export default function InterviewsListView() {
  // states
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  const table = useTable();
  const settings = useSettingsContext();

  const dispatch = useDispatch();

  const confirm = useBoolean();

  const openAdd = useBoolean();

  const status = STATUS_OPTIONS?.find((ele) => ele.value === filters.status)?.statusValue;

  // extracting data from redux store
  const { interviews, itemCount, error } = useSelector((state) => state.interview);
  const { dashboardFilter } = useSelector((state) => state.jobpost);

  // to get the filtered data
  const dataFiltered = applyFilter({
    inputData: interviews,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  // to detect that can we reset
  const canReset = !isEqual(defaultFilters, filters);

  //  to detect when no data is there
  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  // function to handle filters
  const handleFilters = useCallback(
    (name, value) => {
      if (dashboardFilter?.interviewsCompletedStatus) {
        dispatch(setDashboardFilter({}));
      }
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [dashboardFilter?.interviewsCompletedStatus, dispatch, table]
  );

  // function to reset filter
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // function to handle the status filter
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  // function to clear the autocomplete
  const handleClearAutoComplete = () => {
    setSelectedJobPost(null);
    handleFilters('jobpost', '');
  };

  // to get initial data and data after job post filter
  useEffect(() => {
    if (selectedJobPost) {
      dispatch(fetchInterviewList(table.page, table.rowsPerPage, status, selectedJobPost.id_str));
    } else {
      dispatch(fetchInterviewList(table.page, table.rowsPerPage, status));
    }
  }, [dispatch, selectedJobPost, status, table.page, table.rowsPerPage]);

  // filter based on dashboard
  useEffect(() => {
    if (dashboardFilter?.interviewsCompletedStatus) {
      handleFilters('status', dashboardFilter?.interviewsCompletedStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardFilter?.interviewsCompletedStatus]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Interviews List"
          links={[
            { name: 'Application', href: paths.application.interviews.group.list },
            { name: 'Interviews', href: paths.application.interviews.group.list },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS?.map((tab) => (
              <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          {/* table toolbar  */}
          <InterviewsTableToolbar
            onFilters={handleFilters}
            selectedJobPost={selectedJobPost}
            setSelectedJobPost={setSelectedJobPost}
          />

          {/* reset buttons */}
          {canReset && (
            <InterviewsFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered?.length}
              handleClearAutoComplete={handleClearAutoComplete}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id_str)
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

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                {/* table head  */}
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={table.onSort}
                />

                <TableBody>
                  {/* table rows  */}
                  {dataFiltered?.map((row) => (
                    <InterviewsTableRow
                      key={row.id_str}
                      row={row}
                      STATUS_OPTIONS={STATUS_OPTIONS}
                      table={table}
                    />
                  ))}
                  {/* no data component  */}
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/* table pagination  */}
          <TablePaginationCustom
            count={itemCount}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            // onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { status } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  return inputData;
}
