import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Stack, Button, Card, Divider, IconButton, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { finderFunction } from 'src/utils/helperFunctions';

import { CONSTANTS } from 'src/constants';
import { getCandidateWorkExperienceDetails } from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';

import AddEditWorkExperienceModal from './add-edit-work-experience-modal';

function formatDateRange(start_date, end_date, is_current) {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  const startMonthYear = startDate.toLocaleString('default', { month: 'short', year: 'numeric' });
  const endMonthYear = endDate.toLocaleString('default', { month: 'short', year: 'numeric' });

  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();

  const duration = `${yearDiff} year ${monthDiff} months`;

  if (is_current) {
    return `${startMonthYear} - Present (${duration})`;
  }
  return `${startMonthYear} to ${endMonthYear} (${duration})`;
}

const WorkExperience = () => {
  const { candidateAdditionalData, candidateIdData } = useSelector((state) => state.jobpost);
  const { constants } = useSelector((state) => state.general);

  const dispatch = useDispatch();

  const isOpenModal = useBoolean();
  const openEditModal = useBoolean();

  const [experienceData, setExperienceData] = useState(null);

  const handleEditWorkExperience = (experience) => {
    setExperienceData(experience);
    openEditModal.onTrue();
  };

  useEffect(() => {
    if (candidateIdData?.cand_org_id) {
      dispatch(getCandidateWorkExperienceDetails(candidateIdData?.cand_org_id));
    }
  }, [candidateIdData?.cand_org_id, dispatch]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h6">Work Experience</Typography>
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
            Add Work Experience
          </Button>
        </Box>
      </Stack>

      <Divider sx={{ mt: 3 }} />

      {isOpenModal.value && <AddEditWorkExperienceModal isOpenModal={isOpenModal} />}

      <Stack mt={2} spacing={2}>
        {candidateAdditionalData?.workExperienceData?.length ? (
          candidateAdditionalData.workExperienceData.map((workExperience, index) => (
            <Stack spacing={1} key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                {workExperience?.job_title ? (
                  <Typography variant="subtitle2">{workExperience.job_title}</Typography>
                ) : (
                  <Typography variant="caption" color="error">
                    Not Available
                  </Typography>
                )}

                <IconButton onClick={() => handleEditWorkExperience(workExperience)}>
                  <Iconify width={24} icon="ic:outline-edit" />
                </IconButton>
              </Stack>

              {workExperience?.company_name ? (
                <Typography variant="subtitle2" fontWeight={600} color="#4B5565">
                  {workExperience.company_name}
                </Typography>
              ) : (
                <Typography variant="caption" color="error">
                  Not Available
                </Typography>
              )}

              {workExperience?.emp_type ||
              workExperience?.start_date ||
              workExperience?.end_date ? (
                <Typography variant="subtitle2" fontWeight={500} color="#697586">
                  {
                    finderFunction('id', workExperience.emp_type, constants.employment_type)
                      ?.variant
                  }{' '}
                  |{' '}
                  {formatDateRange(
                    workExperience?.start_date,
                    workExperience?.end_date,
                    workExperience?.is_current
                  )}
                </Typography>
              ) : (
                <Typography variant="caption" color="error">
                  Not Available
                </Typography>
              )}

              {workExperience?.responsibilities ? (
                <Typography
                  sx={{ wordWrap: 'break-word' }}
                  variant="subtitle2"
                  fontWeight={600}
                  color="#4B5565"
                >
                  {workExperience.responsibilities}
                </Typography>
              ) : (
                <Typography variant="caption" color="error">
                  Not Available
                </Typography>
              )}
            </Stack>
          ))
        ) : (
          <Box mt={2}>
            <EmptyContent filled sx={{ p: 5, height: '40vh' }} title="No Work Experience Found" />
          </Box>
        )}
      </Stack>

      {openEditModal.value && (
        <AddEditWorkExperienceModal
          type={CONSTANTS.EDIT}
          experienceData={experienceData}
          isOpenModal={openEditModal}
        />
      )}
    </Card>
  );
};
export default WorkExperience;
