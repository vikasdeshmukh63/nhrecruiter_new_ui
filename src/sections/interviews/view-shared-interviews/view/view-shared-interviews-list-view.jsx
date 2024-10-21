'use client';

import isEqual from 'lodash/isEqual';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAllViewSharedinterviewHistory } from 'src/redux/slices/interviews';

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

import ViewSharedInterviewsTableRow from '../view-shared-interviews-table-row';
import ViewSharedInterviewsTableToolbar from '../view-shared-interviews-table-toolbar';
import SharedInterviewsTableFiltersResult from '../view-shared-interviews-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'interview', label: 'Interview#', width: 300 },
  { id: 'viewd_at', label: 'Viewed At', width: 160 },
  { id: '', width: 50 },
];

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function ViewSharedInterviewsListView() {
  // states
  const [filters, setFilters] = useState(defaultFilters);

  // extract data from redux
  const { viewSharedInterviewHistory, itemCount } = useSelector((state) => state.interview);

  const dispatch = useDispatch();

  // custom hooks
  const table = useTable();
  const settings = useSettingsContext();
  const confirm = useBoolean();

  // applying of filter
  const dataFiltered = applyFilter({
    inputData: viewSharedInterviewHistory,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

  // api call based on filter
  useEffect(() => {
    dispatch(getAllViewSharedinterviewHistory(table.page, table.rowsPerPage));
  }, [dispatch, table.page, table.rowsPerPage]);
  return (
    <DashboardContent maxWidth="xl">
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Interview View History"
          links={[
            { name: 'Application', href: paths.application.interviews.group.sharedInterviews },
            { name: 'Interview', href: paths.application.interviews.group.sharedInterviews },
            { name: 'View Shared Interviews' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <ViewSharedInterviewsTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <SharedInterviewsTableFiltersResult
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
              rowCount={dataFiltered.length}
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
                  {dataFiltered.map((row) => (
                    <ViewSharedInterviewsTableRow table={table} key={row.id_str} row={row} />
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
            //
            dense={table.dense}
            // onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
