import { useEffect } from 'react';
import { Icon } from '@iconify/react';
// project imports
// import ViewCandidateTabs from 'components/viewCandidateTabs/ViewCandidateTabs';
import { useDispatch, useSelector } from 'react-redux';

// mui imports
import { Box, Button, Drawer, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  setInterviewData,
  getInterviewStatus,
  getInterviewStatusEvent,
} from 'src/redux/slices/candidate';

import ViewCandidateTabs from './View-candidate-tabs';
import CandidateQuickEditForm from '../candidate/edit-candidate-modal';

//! COMPONENT
const ViewCandidateDrawer = ({
  openViewCandidate,
  onClose,
  profileData,
  type = 'default',
  editable = true,
  canDownload = false,
}) => {
  // using useDispatch
  const dispatch = useDispatch();

  const openEdit = useBoolean();

  const { interviewStatus } = useSelector((state) => state.candidate);

  // function to handle close modal
  const handleCloseModal = async () => {
    await dispatch(setInterviewData(null));
    onClose();
  };

  const candId = type === 'default' ? profileData?.CAND_Id : profileData?.id_str;

  // getting interview status data
  useEffect(() => {
    if (profileData && type) {
      dispatch(getInterviewStatus(candId));
    }
  }, [dispatch, profileData, candId, type]);

  // getting interviewStatus events data
  useEffect(() => {
    if (interviewStatus?.Inerview_Id) {
      dispatch(getInterviewStatusEvent(interviewStatus?.Inerview_Id));
    }
  }, [dispatch, interviewStatus?.Inerview_Id]);

  // function to sent user to edit screen
  const handleEdit = async () => {
    openEdit.onTrue();
  };

  return (
    <Drawer anchor="right" open={openViewCandidate.value} onClose={handleCloseModal}>
      <Box
        sx={{
          width: 'auto',
          background: 'white',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">View Candidate</Typography>
          {editable && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: '5px',
              }}
              onClick={handleEdit}
            >
              <Icon fontSize="25px" icon="mdi:edit-outline" />
            </Button>
          )}
        </Box>

        {/* view candidate tabs  */}
        <ViewCandidateTabs profileData={profileData} type={type} canDownload={canDownload} />
      </Box>

      {openEdit.value && (
        <CandidateQuickEditForm currentCandidate={profileData} openEdit={openEdit} />
      )}
    </Drawer>
  );
};

export default ViewCandidateDrawer;
