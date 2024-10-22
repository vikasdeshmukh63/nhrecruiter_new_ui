import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Card, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONSTANTS } from 'src/constants';
import { getSocialProfilesDetails } from 'src/redux/slices/jobposts';

import EmptyContent from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';

import AddEditSocialProfilesDetailsModal from './add-edit-social-profiles-details-modal';

const SocialProfilesDetails = () => {
  const [socialProfileData, setSocialProfileData] = useState(null);

  const isOpenModal = useBoolean();
  const openEditModal = useBoolean();

  const { candidateAdditionalData, candidateIdData } = useSelector((state) => state.jobpost);
  const dispatch = useDispatch();

  const handleEditSocialProfile = (socialProfile) => {
    setSocialProfileData(socialProfile);
    openEditModal.onTrue();
  };

  useEffect(() => {
    if (candidateIdData?.cand_org_id) {
      dispatch(getSocialProfilesDetails(candidateIdData?.cand_org_id));
    }
  }, [candidateIdData?.cand_org_id, dispatch]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h6">Social Profiles</Typography>
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
            Add Social Profiles
          </Button>
        </Box>
      </Stack>

      <Divider sx={{ mt: 3 }} />

      {isOpenModal.value && <AddEditSocialProfilesDetailsModal isOpenModal={isOpenModal} />}

      <Stack mt={2} spacing={2}>
        {candidateAdditionalData?.socialProfilesData.length ? (
          candidateAdditionalData?.socialProfilesData.map((socialProfile, index) => (
            <Stack spacing={1} key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">{socialProfile.name}</Typography>
                <IconButton onClick={() => handleEditSocialProfile(socialProfile)}>
                  <Iconify width={24} icon="ic:outline-edit" />
                </IconButton>
              </Stack>
              <Typography variant="subtitle2" fontWeight={600} color="#4B5565">
                {socialProfile.url}
              </Typography>
            </Stack>
          ))
        ) : (
          <Box mt={2}>
            <EmptyContent filled sx={{ p: 5, height: '40vh' }} title="No Social Profiles Found" />
          </Box>
        )}
      </Stack>

      {openEditModal.value && (
        <AddEditSocialProfilesDetailsModal
          type={CONSTANTS.EDIT}
          socialProfileData={socialProfileData}
          isOpenModal={openEditModal}
        />
      )}
    </Card>
  );
};
export default SocialProfilesDetails;
