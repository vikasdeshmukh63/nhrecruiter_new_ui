
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { DateFormat, finderFunction } from 'src/utils/helperFunctions';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// utility function to render text safely
const renderText = (value, na) => {
  if (value !== null && value !== undefined) {
    return value;
  }
  return na ? 'Not Available' : '';
};

// ----------------------------------------------------------------------

export default function SchedulesTableRow({ row, STATUS_OPTIONS }) {
  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        {/* candidate name  */}
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={renderText(row?._candid.name)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondary={renderText(row?._jpid.ext_id)}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        {/* job post  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(row?._jpid.title, true)}</TableCell>

        {/* schedule date  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {DateFormat(row?.int_sch_date, 'd MMM yyyy, h a')}
        </TableCell>

        {/* status  */}
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 1 && 'primary') ||
              (row.status === 2 && 'error') ||
              (row.status === 3 && 'success') ||
              (row.status === 4 && 'info') ||
              (row.status === 5 && 'primary') ||
              'default'
            }
          >
            {finderFunction('statusValue', row.status, STATUS_OPTIONS)?.label}
          </Label>
        </TableCell>
      </TableRow>

      {/* menu  */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            quickEdit.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
    </>
  );
}