import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button, TextField, InputAdornment } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { searchCandidates, fetchCandidateListForInviteTab } from 'src/redux/slices/invites';

import { Iconify } from 'src/components/iconify';

import InvitesTable from './invites-table';
import AddCandidatesModal from '../candidate/add-candidate-modal';
import EmptyContent from 'src/components/empty-content';

const InvitesTab = () => {
  const dispatch = useDispatch();

  const openAdd = useBoolean();
  const isDisable = useBoolean();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const { individualJobPostData } = useSelector((state) => state.jobpost);
  const { invitesData, itemCount, error } = useSelector((state) => state.invites);

  const handleKeyUp = (e) => {
    const query = e.target.value;
    if (query.length > 3) {
      dispatch(searchCandidates(query, individualJobPostData?.Job_Id));
    }
    if (query.length === 0) {
      dispatch(fetchCandidateListForInviteTab(0, 5, individualJobPostData?.Job_Id));
    }
  };

  useEffect(() => {
    if (individualJobPostData) {
      if (individualJobPostData?.status !== 1) {
        isDisable.onFalse();
      } else {
        isDisable.onTrue();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [individualJobPostData]);

  // fetching invited candidate list based on job posts
  useEffect(() => {
    dispatch(fetchCandidateListForInviteTab(page, rowsPerPage, individualJobPostData?.Job_Id));
  }, [dispatch, individualJobPostData?.Job_Id, page, rowsPerPage]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display="flex" alignItems="center" gap={2}>
        <TextField
          onKeyUp={handleKeyUp}
          size="small"
          fullWidth
          placeholder="Search by Name, Email or Phone..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="material-symbols:search" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<Icon fontSize={30} icon="mdi:invite" />}
          onClick={openAdd.onTrue}
          disabled={isDisable.value}
        >
          Add
        </Button>
      </Grid>

      <Grid item xs={12}>
        {invitesData?.length === 0 ? (
          <EmptyContent
            filled
            title="No Data"
            sx={{
              py: 10,
              mt: 1,
            }}
          />
        ) : (
          <InvitesTable
            invitesData={invitesData}
            itemCount={itemCount}
            error={error}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        )}
      </Grid>

      {/* add candidates modal  */}
      <AddCandidatesModal openAdd={openAdd} />
    </Grid>
  );
};

export default InvitesTab;
