'use client';

import isEqual from 'lodash/isEqual';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';

import { alpha } from '@mui/material/styles';
import { Card, IconButton, Tab, Table, TableBody, TableContainer, Tabs, Tooltip } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchCreditHistory } from 'src/redux/slices/credit';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { getComparator, TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, useTable } from 'src/components/table';

import { CreditHistoryTableRow } from '../credit-history-table-row';
import { CreditHistoryTableFiltersResult } from '../credit-history-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', statusValue: undefined },
  { value: 'pending', label: 'Pending', statusValue: 1 },
  { value: 'completed', label: 'Completed', statusValue: 2 },
  { value: 'failed', label: 'Failed', statusValue: 3 },
  { value: 'canceled', label: 'Cancelled', statusValue: 4 },
];

const TABLE_HEAD = [
  { id: 'id_str', label: 'Order#', width: 250 },
  { id: 'price', label: 'Price/Final Price', width: 160 },
  { id: 'credits', label: 'No of Credits', width: 120 },
  { id: 'purchase_date', label: 'Purchase Date', width: 180 },
  { id: 'Status', label: 'Order Status', width: 150 },
  { id: '', width: 50 },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function HistoryListView() {
  const dispatch = useDispatch();

  // states
  const [filters, setFilters] = useState(defaultFilters);

  // extract data from redux
  const { creditHistory, itemCount } = useSelector((state) => state.credit);

  // to find status value
  const status = STATUS_OPTIONS?.find((ele) => ele.value === filters.status)?.statusValue;

  // custom hooks
  const table = useTable();
  const settings = useSettingsContext();
  const confirm = useBoolean();

  // applying of filter
  const dataFiltered = applyFilter({
    inputData: creditHistory,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  // handling filters
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

  // reset filters
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // handling filter status
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  // api call based on filter
  useEffect(() => {
    dispatch(fetchCreditHistory(table.page, table.rowsPerPage, status));
  }, [dispatch, status, table.page, table.rowsPerPage]);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Credits History"
        links={[
          { name: 'Admin', href: paths.admin.credits.group.history },
          { name: 'Credits', href: paths.admin.credits.group.history },
          { name: 'Histoy' },
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
        {/* 
        <CreditHistoryTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          roleOptions={_roles}
        /> */}

        {canReset && (
          <CreditHistoryTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ mt: 1, position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered?.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
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
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered?.map((row) => (
                  <CreditHistoryTableRow
                    STATUS_OPTIONS={STATUS_OPTIONS}
                    status={filters.status}
                    key={row.id_str}
                    row={row}
                  />
                ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={itemCount}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          // onChangeDense={table.onChangeDense}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  return inputData;
}
