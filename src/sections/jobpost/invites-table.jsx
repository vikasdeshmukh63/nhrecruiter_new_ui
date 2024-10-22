import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Table,
  Button,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
  Box,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { deleteInviteCandidate, fetchCandidateListForInviteTab } from 'src/redux/slices/invites';

import { Label } from 'src/components/label';
import { toast } from 'sonner';

// table header
const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
    align: 'center',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
    align: 'center',
  },
  {
    id: 'req_sent',
    numeric: false,
    disablePadding: false,
    label: 'Request Sent',
    align: 'center',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
    align: 'center',
  },
];

// ! table head component
const InvitesEnhancedTableHead = () => (
  <TableHead sx={{ width: '100%' }}>
    <TableRow>
      {headCells.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.align}
          padding={headCell.disablePadding ? 'none' : 'normal'}
        >
          <Typography variant="body1" fontWeight={500}>
            {headCell.label}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

// ! table component
const InvitesEnhancedTable = ({
  invitesData,
  itemCount,
  error,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
}) => {
  // using useDispatch
  const dispatch = useDispatch();

  // states
  const [dense] = useState(false);
  const deleted = useBoolean();
  const openConfirmDeleteModal = useBoolean();
  const [deleteId, setDeleteId] = useState(null);

  // extracting data from redux store
  const { individualJobPostData } = useSelector((state) => state.jobpost);

  // function to handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // function to handle rowsperpage
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // function to delete invite candidates
  const handleDeleteCandidate = async (id) => {
    await dispatch(deleteInviteCandidate(id));
    deleted.onTrue();
  };

  // function to handle open confirm delete modal
  const handleOpenConfirmDeleteModal = async (id) => {
    await setDeleteId(id);
    openConfirmDeleteModal.onTrue();
  };

  useEffect(() => {
    if (deleted.value && error) {
      toast.error('Something Went Wrong', { variant: 'error' });
    }
    if (deleted.value && !error) {
      toast.success('Candidate Deleted Successfully');
      dispatch(fetchCandidateListForInviteTab(page, rowsPerPage, individualJobPostData?.Job_Id));
    }
    deleted.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted, deleted.value, error]);

  return (
    <Box>
      {/* table */}
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? 'small' : 'medium'}
        >
          {/* table head  */}
          <InvitesEnhancedTableHead />
          {/* table body  */}
          <TableBody>
            {invitesData?.map((row, index) => (
              <TableRow hover key={index}>
                <TableCell align="center">{row?.name}</TableCell>
                <TableCell align="center">{row?.email}</TableCell>
                <TableCell align="center">
                  <Label
                    variant="soft"
                    color={row?.requestSent ? 'success' : 'warning' || 'default'}
                  >
                    {row?.requestSent ? 'Request Sent' : 'Schedule Pending'}
                  </Label>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenConfirmDeleteModal(row?.uniq_id)}>
                    <Icon icon="icomoon-free:blocked" color="red" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* pagination  */}
      <TablePagination
        rowsPerPageOptions={[50, 100, 200]}
        component="div"
        count={itemCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* delete notification modal */}
      <ConfirmDeleteModal
        handleDeleteCandidate={handleDeleteCandidate}
        deleteId={deleteId}
        openConfirmDeleteModal={openConfirmDeleteModal}
      />
    </Box>
  );
};

export default InvitesEnhancedTable;

const ConfirmDeleteModal = ({ handleDeleteCandidate, deleteId, openConfirmDeleteModal }) => {
  const handleDeleteClick = () => {
    handleDeleteCandidate(deleteId);
    openConfirmDeleteModal.onFalse();
  };

  return (
    <Box>
      <Dialog
        open={openConfirmDeleteModal.value}
        onClose={openConfirmDeleteModal.onFalse}
        PaperProps={{ sx: { borderRadius: 1, p: 3, width: 400 } }}
      >
        <Typography variant="body2" mb={2}>
          Candidate may have already received the invitation for the Job post.
        </Typography>
        <Typography variant="body2">
          Are you sure you want to remove the candidate invite from the Job Post ?
        </Typography>

        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mt: 3 }}
        >
          <Button variant="outlined" onClick={openConfirmDeleteModal.onFalse}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDeleteClick}>
            Yes Delete
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};
