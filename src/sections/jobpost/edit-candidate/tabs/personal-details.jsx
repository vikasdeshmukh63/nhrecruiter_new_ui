import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Card,
  Grid,
  Dialog,
  Divider,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DateFormat, renderText } from 'src/utils/helperFunctions';

import { fetchMasters } from 'src/redux/slices/masters';
import { fetchPlatformConstants } from 'src/redux/slices/general';
import { getCandidatePersonalDetails, getLocationData } from 'src/redux/slices/jobposts';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import CustomLabel from 'src/components/hook-form/label/custom-label';

import AddEditPersonalDetailModal from './add-edit-personal-details-modal';

const PersonalDetails = () => {
  const { constants } = useSelector((state) => state.general);

  const isOpenModal = useBoolean();
  const {
    error: formErr,
    candidateData,
    editCandidateId,
    locationData,
    isLoading,
  } = useSelector((state) => state.jobpost);

  const { nationalId } = useSelector((state) => state.masters);
  const dispatch = useDispatch();

  // initial data to fetch location
  useEffect(() => {
    if (nationalId.length === 0) {
      dispatch(fetchMasters());
    }
    if (locationData.length === 0) {
      dispatch(getLocationData());
    }
    if (!constants) {
      dispatch(fetchPlatformConstants());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // implementing personal details
  useEffect(() => {
    if (editCandidateId) {
      dispatch(getCandidatePersonalDetails(editCandidateId));
      // dispatch(setCandidateData(formData));
    }
  }, [dispatch, editCandidateId]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h6">Personal Details</Typography>
          <Typography variant="body2" color="#637381">
            Last updated: 10 Nov 2023
          </Typography>
        </Stack>
        <Box>
          <IconButton onClick={isOpenModal.onTrue}>
            <Iconify icon="ic:outline-edit" />
          </IconButton>
        </Box>
      </Stack>

      <Divider sx={{ mt: 3 }} />
      {isLoading && (
        <Dialog
          open={isLoading}
          PaperProps={{
            sx: {
              borderRadius: 1,
              width: '500px',
              maxWidth: '500px',
              padding: '80px',
              backgroundColor: 'transparent',
              boxShadow: '0',
              position: 'relative',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          >
            <svg width={0} height={0}>
              <defs>
                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e01cd5" />
                  <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
          </Box>
        </Dialog>
      )}

      {isOpenModal.value && <AddEditPersonalDetailModal isOpenModal={isOpenModal} />}

      <Grid container mt={2} spacing={2} justifyContent="flex-end">
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Image
              alt="avatar"
              src={candidateData?.prof_id}
              sx={{
                width: 130,
                height: 130,
                borderRadius: '50%',
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="First Name" />
            <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
              {renderText(candidateData?.first_name)} {renderText(candidateData?.middle_name)}{' '}
              {renderText(candidateData?.last_name)}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="Email" />
            <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
              {renderText(candidateData?.email)}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="Mobile #" />
            <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
              {renderText(candidateData?.phoneNumber)}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="DOB" />

            <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
              {candidateData?.dob && DateFormat(candidateData?.dob, 'd MMM yyyy')}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="Gender" />
            <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
              {renderText(candidateData?.gender?.variant)}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="Maritial Status" />

            <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
              {renderText(candidateData?.marital_status?.variant)}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};
export default PersonalDetails;
