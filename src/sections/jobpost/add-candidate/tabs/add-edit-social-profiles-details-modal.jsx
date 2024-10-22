import * as yup from 'yup';

import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import { Button, Dialog, Divider, Grid, Typography, Stack } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONSTANTS } from 'src/constants';
import {
  addSocialProfilesDetails,
  editSocialProfileDetails,
  getSocialProfilesDetails,
} from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import CustomLabel from 'src/components/hook-form/label/custom-label';
import { Field, Form } from 'src/components/hook-form';
import { toast } from 'sonner';

const AddEditSocialProfilesDetailsModal = ({ isOpenModal, socialProfileData, type }) => {
  // states
  const isSubmitted = useBoolean();

  const { error: formErr, candidateIdData } = useSelector((state) => state.jobpost);
  const dispatch = useDispatch();

  // schema
  const schema = yup.object().shape({
    name: yup.string().required('profile Name is required'),
    url: yup.string().required('profile URL is required'),
  });

  // default values
  const defaultValues = {
    name: socialProfileData?.name || '',
    url: socialProfileData?.url || '',
  };

  // methods
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // submit
  const onSubmit = handleSubmit(async (data) => {
    const payload = { ...data, isActive: true };

    try {
      if (type === CONSTANTS.EDIT) {
        payload.socId = socialProfileData.id;
        await dispatch(editSocialProfileDetails(candidateIdData?.cand_org_id, payload));
      } else {
        await dispatch(addSocialProfilesDetails(candidateIdData?.cand_org_id, payload));
      }

      isSubmitted.onTrue();
    } catch (err) {
      console.log(err);
    }
  });

  // form submit error handling
  useEffect(() => {
    if (isSubmitted.value && formErr) {
      toast.error('something went wrong', { variant: 'error' });
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !formErr) {
      toast.success(`Social Profile ${type === CONSTANTS.EDIT ? 'edited' : 'added'} Successfully`);

      dispatch(getSocialProfilesDetails(candidateIdData?.cand_org_id));
      isOpenModal.onFalse();
      isSubmitted.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErr, isSubmitted]);

  return (
    <Dialog
      open={isOpenModal.value}
      onClose={isOpenModal.onFalse}
      PaperProps={{ sx: { borderRadius: 1, width: 800, p: 3 } }}
    >
      <Stack spacing={1}>
        <Typography variant="h6">Add Social Profiles</Typography>
        <Typography variant="body2" color="#637381">
          Title, short description, image...
        </Typography>
      </Stack>
      <Divider sx={{ mt: 3 }} />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Profile Name" required />

              <Field.Text name="name" placeholder="Enter Profile Name" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Profile URL" required />

              <Field.Text name="url" placeholder="Enter Profile URL" />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack mt={3} direction="row" justifyContent="end" spacing={2}>
              <Button variant="soft" color="error" onClick={isOpenModal.onFalse}>
                Cancel
              </Button>
              <LoadingButton
                color="success"
                type="submit"
                startIcon={<Iconify icon="bxs:file" />}
                disabled={!candidateIdData?.cand_org_id}
                variant="contained"
                loading={isSubmitting}
              >
                Save
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </Dialog>
  );
};

export default AddEditSocialProfilesDetailsModal;
