import { Icon } from '@iconify/react';

import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Chip, IconButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { DateFormat, finderFunction } from 'src/utils/helperFunctions';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

import { ShareInterviewLinkModal } from './share-interview-link-modal';

// utility function to render text safely
const renderText = (value, na) => {
  if (value !== null && value !== undefined) {
    return value;
  }
  return na ? 'Not Available' : '';
};

// ----------------------------------------------------------------------

export default function InterviewsTableRow({ row, STATUS_OPTIONS, table }) {
  const { ext_share_links, id_str } = row;
  const confirm = useBoolean();
  const openModal = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const handleShare = async () => {
    openModal.onTrue();
  };

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
          {DateFormat(row?.iv_date, 'd MMM yyyy, h a')}
        </TableCell>

        {/* status  */}
        <TableCell sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <Label
            variant="soft"
            color={
              ([1, 5].includes(row.status) && 'primary') ||
              (row.status === 2 && 'success') ||
              ([3, 8, 9].includes(row.status) && 'warning') ||
              (row.status === 4 && 'error') ||
              'default'
            }
          >
            {finderFunction('statusValue', row.status, STATUS_OPTIONS)?.label}
          </Label>
          <IconButton
            color={
              ext_share_links?.length &&
              !ext_share_links[0]?.isDeleted &&
              ext_share_links[0]?.isActive
                ? 'success'
                : 'secondary'
            }
            sx={{ visibility: row.status === 2 ? 'visible' : 'hidden' }}
            onClick={handleShare}
          >
            <Icon icon="material-symbols:share" />
          </IconButton>
        </TableCell>
      </TableRow>

      {openModal.value && (
        <ShareInterviewLinkModal
          openModal={openModal}
          ext_share_links={ext_share_links}
          table={table}
          id_str={id_str}
        />
      )}
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
