import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Card, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { finderFunction } from 'src/utils/helperFunctions';

import { CONSTANTS } from 'src/constants';
import { getCandidateWorkEducationDetails } from 'src/redux/slices/jobposts';

import EmptyContent from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';

import AddEditEducationDetailsModal from './add-edit-education-details-modal';

// function for converting into required format
function formatToMonthYearRange(startDate, endDate) {
  const options = { year: 'numeric', month: 'long' };

  const start = new Date(startDate).toLocaleDateString('en-US', options);
  const end = new Date(endDate).toLocaleDateString('en-US', options);

  return `${start} | ${end}`;
}
const EducationDetails = () => {
  const [educationData, setEducationData] = useState(null);

  const isOpenModal = useBoolean();
  const openEditModal = useBoolean();

  const { candidateAdditionalData, candidateIdData } = useSelector((state) => state.jobpost);
  const { constants } = useSelector((state) => state.general);
  const dispatch = useDispatch();

  const handleEditEducation = (education) => {
    setEducationData(education);
    openEditModal.onTrue();
  };
  useEffect(() => {
    if (candidateIdData?.cand_org_id) {
      dispatch(getCandidateWorkEducationDetails(candidateIdData?.cand_org_id));
    }
  }, [candidateIdData?.cand_org_id, dispatch]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h6">Education</Typography>
          <Typography variant="body2" color="#637381">
            Title, short description, image...
          </Typography>
        </Stack>
        <Box>
          <Button
            onClick={isOpenModal.onTrue}
            startIcon={<Iconify icon="bxs:file" />}
            variant="contained"
            color="success"
          >
            Add Education
          </Button>
        </Box>
      </Stack>

      <Divider sx={{ mt: 3 }} />

      {isOpenModal.value && <AddEditEducationDetailsModal isOpenModal={isOpenModal} />}

      <Stack mt={2} spacing={2}>
        {candidateAdditionalData?.educationData?.length ? (
          candidateAdditionalData.educationData.map((education, index) => (
            <Stack spacing={1} key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">
                  {finderFunction('id', education.type, constants.education_type)?.variant}{' '}
                  {education.course}
                </Typography>
                <IconButton onClick={() => handleEditEducation(education)}>
                  <Iconify width={24} icon="ic:outline-edit" />
                </IconButton>
              </Stack>
              <Typography variant="subtitle2" fontWeight={600} color="#4B5565">
                {education.college_name}
              </Typography>
              <Typography variant="subtitle2" fontWeight={500} color="#697586">
                {education.course_type.type}{' '}
                {formatToMonthYearRange(education.start_date, education.end_date)}
              </Typography>
            </Stack>
          ))
        ) : (
          <Box mt={2}>
            <EmptyContent filled sx={{ p: 5, height: '40vh' }} title="No Education Details Found" />
          </Box>
        )}
      </Stack>

      {openEditModal.value && (
        <AddEditEducationDetailsModal
          type={CONSTANTS.EDIT}
          educationData={educationData}
          isOpenModal={openEditModal}
        />
      )}
    </Card>
  );
};
export default EducationDetails;
