import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Card, Grid, Divider, IconButton, Typography, Stack } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { renderText } from 'src/utils/helperFunctions';

import { getCandidateProfessionalDetails } from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import CustomLabel from 'src/components/hook-form/label/custom-label';

import AddEditProfessionalDetailModal from './add-edit-professional-details-modal';

function convertToString(data, item) {
  return data?.map((ele) => ele[item]).join(',');
}

function formatToIndianNumberSystem(number) {
  return new Intl.NumberFormat('en-IN').format(number);
}

const ProfessionalDetails = ({ type }) => {
  const isOpenModal = useBoolean();
  const dispatch = useDispatch();
  // redux
  const {
    error: formErr,
    candidateIdData,
    candidateData,
    foundLocationData,
    editCandidateId,
  } = useSelector((state) => state.jobpost);

  // implementing personal details
  useEffect(() => {
    if (editCandidateId) {
      dispatch(getCandidateProfessionalDetails(editCandidateId));
      // dispatch(setCandidateData(formData));
    }
  }, [dispatch, editCandidateId]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h6">Professional Details</Typography>
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

      {isOpenModal.value && <AddEditProfessionalDetailModal isOpenModal={isOpenModal} />}
      <Grid container mt={2} spacing={2} justifyContent="flex-end">
        <Grid item xs={12}>
          <Stack spacing={1}>
            <CustomLabel title="Profile Summary" />
            {candidateData?.prof_summary ? (
              <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
                {renderText(candidateData?.prof_summary)}
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Not Available
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <CustomLabel title="Experience" mb={2} />
          {candidateData?.exp_years?.year || candidateData?.exp_months?.month ? (
            <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
              {renderText(candidateData?.exp_years?.year)} years{' '}
              {renderText(candidateData?.exp_months?.month)} Months
            </Typography>
          ) : (
            <Typography variant="caption" color="error">
              Not Available
            </Typography>
          )}
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="Current Location" />
            {candidateData?.curr_location?.city ? (
              <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
                {renderText(candidateData?.curr_location?.city)}
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Not Available
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={1}>
            <CustomLabel title="Preferred Location" />
            {candidateData?.pref_location?.length ? (
              <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
                {convertToString(candidateData?.pref_location, 'city')}
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Not Available
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={1}>
            <CustomLabel title="Skills" />
            {candidateData?.skills?.length ? (
              <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
                {convertToString(candidateData?.skills, 'name')}
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Not Available
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="Current CTC (in lakhs)" />
            {candidateData?.cctc ? (
              <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
                Rs. {formatToIndianNumberSystem(+candidateData.cctc * 100000)}
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Not Available
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="Expected CTC (in lakhs)" />
            {candidateData?.ectc ? (
              <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
                Rs. {formatToIndianNumberSystem(+candidateData.ectc * 100000)}
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Not Available
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <CustomLabel title="Notice Period" />
            {candidateData?.not_period?.variant ? (
              <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
                {renderText(candidateData?.not_period?.variant)}
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Not Available
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Remaining Days</Typography>
            {candidateData?.remaining_days ? (
              <Typography variant="subtitle2" fontWeight={500} color="#4B5565">
                {renderText(candidateData?.remaining_days)} Days
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Not Available
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};
export default ProfessionalDetails;
