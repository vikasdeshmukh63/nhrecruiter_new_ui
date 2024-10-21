import { Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';
import { DateFormat } from 'src/utils/helperFunctions';

// ----------------------------------------------------------------------

export default function ViewSharedInterviewsTableRow({ row, table, Status, selected }) {
  const { name, createdAt, Job_Title, Job_Title_Cand, guid, hash } = row;

  const handleViewInterview = () => {
    const url = `${process.env.NEXT_PUBLIC_APP_SHARED_URL}/shared/pub/interview/${guid}.${hash}`;
    window.open(url, '_blank');
  };

  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={Job_Title_Cand || Job_Title}
          secondary={name}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {DateFormat(createdAt, 'd MMM yyyy, hh:mm:ss a')}
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Button
          variant="contained"
          size="large"
          color="info"
          startIcon={<Iconify icon="solar:eye-bold" />}
          onClick={handleViewInterview}
        >
          View Interview
        </Button>
      </TableCell>
    </TableRow>
  );
}
