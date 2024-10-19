import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Tooltip, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { finderFunction } from 'src/utils/helperFunctions';

import { CONSTANTS } from 'src/constants';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { CompaniesQuickEditForm } from './companies-quick-edit-form';



// utility function to render text safely
const renderText = (value, na) => {
  if (value !== null && value !== undefined) {
    return value;
  }
  return na ? 'Not Available' : '';
};

// ----------------------------------------------------------------------

export function CompaniesTableRow({
  row,
  STATUS_OPTIONS,
  page,
  rowsPerPage,
  Status,
  filters,
}) {
  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover>
        {/* name  */}
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={row?._prof_id?.path} sx={{ mr: 3 }} />
          <ListItemText
            primary={renderText(row?.name)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        {/* email  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(row?.email, true)}</TableCell>

        {/* street  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(row?.street, true)}</TableCell>

        {/* city  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(row?.city, true)}</TableCell>

        {/* country  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(row?.country, true)}</TableCell>

        {/* status  */}
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 1 && 'secondary') ||
              (row.status === 2 && 'success') ||
              (row.status === 3 && 'error') ||
              'default'
            }
          >
            {finderFunction('statusValue', row.status, STATUS_OPTIONS)?.label}
          </Label>
        </TableCell>

        {/* actions  */}
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* edit form  */}
      {quickEdit.value && (
        <CompaniesQuickEditForm
          currentCompany={row}
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
          type={CONSTANTS.EDIT}
          page={page}
          rowsPerPage={rowsPerPage}
          Status={Status}
        />
      )}
    </>
  );
}
