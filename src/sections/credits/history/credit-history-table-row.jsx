import { IconButton, ListItemText, TableCell, TableRow, Tooltip } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DateFormat, finderFunction } from 'src/utils/helperFunctions';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CreditHistoryTableRow({ row, selected, onDeleteRow, STATUS_OPTIONS }) {
  const { id_str, ext_order_id, credit_purchase_payments, credits, Status } = row;

  const quickEdit = useBoolean();

  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={id_str}
          secondary={ext_order_id}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        $ {credit_purchase_payments[0]?.amount}/$ {credit_purchase_payments[0]?.final_amount}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{credits}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {credit_purchase_payments[0]?.createdAt
          ? DateFormat(credit_purchase_payments[0]?.createdAt, 'dd/MM/yyyy hh:mm a')
          : 'NA'}
        {' /'}
        <br />
        {credit_purchase_payments[0].completed_date
          ? DateFormat(credit_purchase_payments[0].completed_date, 'dd/MM/yyyy hh:mm a')
          : 'NA'}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (Status === 1 && 'warning') ||
            (Status === 2 && 'primary') ||
            (Status === 3 && 'error') ||
            (Status === 4 && 'error') ||
            'default'
          }
        >
          {finderFunction('statusValue', Status, STATUS_OPTIONS)?.label}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="Quick View" placement="top" arrow>
          <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
            <Iconify icon="carbon:view-filled" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
