import { useDispatch, useSelector } from 'react-redux';
import { forwardRef, useCallback, useEffect, useState } from 'react';

import { Box, Button, Card, Divider, Grid, IconButton, Typography, Stack } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONSTANTS } from 'src/constants';
import { getCandidateCertificationDetails } from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';

import AddEditCertificationDetailsModal from './add-edit-certification-details-modal';

function formatToMonthYearRange(startDate, endDate) {
  const options = { year: 'numeric', month: 'long' };

  if (!startDate && !endDate) {
    return 'Not Available';
  }
  const start = new Date(startDate).toLocaleDateString('en-US', options);
  const end = new Date(endDate).toLocaleDateString('en-US', options);

  return `${start} | ${end}`;
}
const CertificationDetails = () => {
  const [certificationData, setCertificationData] = useState(null);

  const isOpenModal = useBoolean();
  const openEditModal = useBoolean();

  const { candidateAdditionalData, candidateIdData } = useSelector((state) => state.jobpost);
  const dispatch = useDispatch();

  const handleEditCertification = (education) => {
    setCertificationData(education);
    openEditModal.onTrue();
  };

  useEffect(() => {
    if (candidateIdData?.cand_org_id) {
      dispatch(getCandidateCertificationDetails(candidateIdData?.cand_org_id));
    }
  }, [candidateIdData?.cand_org_id, dispatch]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h6">Certifications</Typography>
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
            Add Certification
          </Button>
        </Box>
      </Stack>

      <Divider sx={{ mt: 3 }} />

      {isOpenModal.value && <AddEditCertificationDetailsModal isOpenModal={isOpenModal} />}

      <Stack mt={2} spacing={2}>
        {candidateAdditionalData.certificationsData.length ? (
          candidateAdditionalData.certificationsData.map((certification, index) => (
            <Stack spacing={1} key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">{certification.name}</Typography>
                <IconButton onClick={() => handleEditCertification(certification)}>
                  <Iconify width={24} icon="ic:outline-edit" />
                </IconButton>
              </Stack>
              <Typography variant="subtitle2" fontWeight={600} color="#4B5565">
                {certification.cert_id || 'Not Avaiable'} |{' '}
                {formatToMonthYearRange(certification.date_obtained, certification.expiration_date)}
              </Typography>
            </Stack>
          ))
        ) : (
          <Box mt={2}>
            <EmptyContent filled sx={{ p: 5, height: '40vh' }} title="No Certication Found" />
          </Box>
        )}
      </Stack>

      {openEditModal.value && (
        <AddEditCertificationDetailsModal
          type={CONSTANTS.EDIT}
          certificationData={certificationData}
          isOpenModal={openEditModal}
        />
      )}
    </Card>
  );
};
export default CertificationDetails;
