import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Box, Checkbox, Collapse, IconButton, MenuItem, Stack } from '@mui/material';

import {
  resetAdditionalCandidateAdditionalData,
  resetCandidateData,
  setCandidateData,
  setEditCandidateId,
} from 'src/redux/slices/jobposts';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { ReactRadialChart } from 'src/components/chart/radial-chart';

import JobPostAddCandidateStepperStatus from './job-post-add-candidate-stepper-status';

// utility function to render text safely
const renderText = (value, na) => {
  if (value !== null && value !== undefined) {
    return value;
  }
  return na ? 'Not Available' : '';
};

// function to set color according to the value
const statusColorFinder = (value) => {
  if (value >= 0 && value < 4) {
    return 'error';
  }
  if (value >= 4 && value < 8) {
    return 'warning';
  }
  if (value >= 8 && value <= 10) {
    return 'success';
  }
  return 'primary';
};

// ----------------------------------------------------------------------

export default function JobPostAddCandidatesTableRow({
  row,
  STATUS_OPTIONS,
  page,
  rowsPerPage,
  Status,
  filters,
  selected,
  onSelectRow,
  setExpandedItem,
  expandedItem,
}) {
  // const [activeStep, setActiveStep] = useState(row.status);
  const dispatch = useDispatch();
  const router = useRouter();
  const popover = usePopover();

  const handleToggle = (id) => {
    setExpandedItem((prev) => (prev === id ? null : id));
  };

  const handleEditCandidate = async (id) => {
    await dispatch(setEditCandidateId(id));
    await dispatch(resetCandidateData());
    await dispatch(resetAdditionalCandidateAdditionalData());
    router.push('/application/jobposts/edit-candidate/');
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        {/* name  */}
        <TableCell>
          <Stack direction="row" alignItems="center">
            <Avatar src={row?._prof_id?.path} sx={{ mr: 3 }} />
            <ListItemText
              primary={renderText(row?._org_cand_id?._cand_id?.first_name, true)}
              primaryTypographyProps={{
                typography: 'body2',
                sx: { textDecoration: 'underline', cursor: 'pointer' },
              }}
              onClick={() => handleEditCandidate(row?._org_cand_id?.id)}
            />
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {`${renderText(row?._org_cand_id?._cand_id?.mobile_code)} ${renderText(
            row?._org_cand_id?._cand_id?.mobile_no
          )}`}{' '}
          <br /> {renderText(row?._org_cand_id?._cand_id?.email)}
        </TableCell>

        <TableCell sx={{ p: 0 }}>
          <Box width="40%">
            <ReactRadialChart
              fontSize="1rem"
              symbol="%"
              outOf={1}
              series={[Number(renderText(row?.screening_score)) * 10 || 0]}
              height={140}
              size="40%"
              color={statusColorFinder(renderText(row?.screening_score))}
            />
          </Box>
        </TableCell>
        <TableCell sx={{ p: 0 }}>
          <Box width="40%">
            <ReactRadialChart
              fontSize="1rem"
              symbol=""
              series={[Math.ceil(renderText(row?.interview_score)) * 1 || 0]}
              height={140}
              outOf={10}
              size="40%"
              color={statusColorFinder(Math.ceil(renderText(row?.interview_score)) / 10)}
            />
          </Box>
        </TableCell>

        {/* status  */}
        <TableCell>
          <Label
            variant="soft"
            color={
              (row?._org_cand_id?._cand_id?.isActive === true && 'success') ||
              (row?._org_cand_id?._cand_id?.isActive === false && 'warning') ||
              'default'
            }
          >
            {row?._org_cand_id?._cand_id?.isActive ? 'Active' : 'Pending'}
          </Label>
        </TableCell>

        {/* action  */}
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            sx={{
              bgcolor: 'rgba(99, 115, 129, 0.08)',
              transition: 'color 0.3s ease, transform 0.3s ease',
              transform: expandedItem === row.id ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            color={expandedItem === row.id ? 'inherit' : 'default'}
            onClick={() => handleToggle(row.id)}
          >
            <Iconify
              icon={expandedItem === row.id ? 'eva:arrow-ios-upward-fill' : 'mingcute:down-fill'}
              sx={{
                transition: 'transform 0.3s ease',
                transform: expandedItem === row.id ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </IconButton>

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        {/* custom popover */}
        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem onClick={() => handleEditCandidate(row?._org_cand_id?.id)}>
            <Iconify icon="ic:outline-edit" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="material-symbols:delete" />
            Delete
          </MenuItem>
        </CustomPopover>
      </TableRow>

      {/* {expandedItem === row.id && ( */}
      <TableRow sx={{ bgcolor: '#f4f6f8' }}>
        <TableCell colSpan={7} sx={{ p: 0 }}>
          <Collapse in={expandedItem === row.id}>
            {expandedItem === row.id && (
              <JobPostAddCandidateStepperStatus
                expandedItem={expandedItem}
                activeStep={row.status - 1}
              />
            )}
          </Collapse>
        </TableCell>
      </TableRow>
      {/* )} */}
    </>
  );
}
