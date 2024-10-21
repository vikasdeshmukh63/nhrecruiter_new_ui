'use client';

import isEqual from 'lodash/isEqual';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONSTANTS } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { fetchCountries } from 'src/redux/slices/general';
import { fetchCompaniesList } from 'src/redux/slices/company';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { CompaniesTableRow } from '../companies-table-row';
import { CompaniesQuickEditForm } from '../companies-quick-edit-form';
import { CompaniesFiltersResult } from '../companies-table-filters-result';

// ----------------------------------------------------------------------

// status options
const STATUS_OPTIONS = [
  { value: 'all', label: 'All', statusValue: undefined },
  { value: 'pending', label: 'Pending', statusValue: 1 },
  { value: 'active', label: 'Active', statusValue: 2 },
  { value: 'cancelled', label: 'Cancelled', statusValue: 3 },
];

// table heads
const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'street', label: 'Street' },
  { id: 'city', label: 'City' },
  { id: 'country', label: 'Country' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

// default filters
const defaultFilters = {
  status: 'all',
};

// ----------------------------------------------------------------------

export default function CompaniesListView() {
  // states
  const [filters, setFilters] = useState(defaultFilters);

  const table = useTable();

  const dispatch = useDispatch();

  const confirm = useBoolean();

  const openAdd = useBoolean();

  const status = STATUS_OPTIONS?.find((ele) => ele.value === filters.status)?.statusValue;

  // extracting data from redux store
  const { companies, itemCount, error } = useSelector((state) => state.company);
  const { countries } = useSelector((state) => state.general);

  // to get the filtered data
  const dataFiltered = applyFilter({
    inputData: companies,
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
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
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

  // to get initial data and data after job post filter
  useEffect(() => {
    dispatch(fetchCompaniesList(table.page, table.rowsPerPage, status));
  }, [dispatch, status, table.page, table.rowsPerPage]);

  // to get countires if not there
  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [countries, dispatch]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Companies List"
        links={[
          { name: 'Admin', href: paths.admin.companies },
          { name: 'Companies', href: paths.admin.companies },
          { name: 'List' },
        ]}
        action={
          <Button
            onClick={openAdd.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Company
          </Button>
        }
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

        {/* reset buttons */}
        {canReset && (
          <CompaniesFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered?.length}
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
                  <CompaniesTableRow
                    key={row.id_str}
                    row={row}
                    STATUS_OPTIONS={STATUS_OPTIONS}
                    page={table.page}
                    rowsPerPage={table.rowsPerPage}
                    Status={status}
                    filters={filters}
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

      {openAdd.value && (
        <CompaniesQuickEditForm
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          Status={status}
          open={openAdd.value}
          onClose={openAdd.onFalse}
          type={CONSTANTS.CREATE}
        />
      )}
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
