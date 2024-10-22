import * as yup from 'yup';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Button, Dialog, Divider, Grid, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONSTANTS } from 'src/constants';
import {
  addCertificationsDetails,
  editCertificationDetails,
  getCandidateCertificationDetails,
} from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import { Field, Form } from 'src/components/hook-form';
import CustomLabel from 'src/components/hook-form/label/custom-label';

const AddEditCertificationDetailsModal = ({ isOpenModal, certificationData, type }) => {
  const isSubmitted = useBoolean();

  const { error: formErr, candidateIdData } = useSelector((state) => state.jobpost);

  const dispatch = useDispatch();

  const schema = yup.object().shape({
    name: yup.string().required('certification Name is required'),
    cert_id: yup.string(),
    issuing_body: yup.string(),
    date_obtained: yup
      .date()
      .nullable()
      .max(yup.ref('expiration_date'), 'Start date should be before end date'),
    expiration_date: yup
      .date()
      .nullable()
      .min(yup.ref('date_obtained'), 'End date should be after start date'),
  });
  const defaultValues = {
    name: certificationData?.name || '',
    cert_id: certificationData?.cert_id || '',
    issuing_body: certificationData?.issuing_body || '',
    date_obtained: certificationData?.date_obtained
      ? new Date(certificationData?.date_obtained)
      : null,
    expiration_date: certificationData?.expiration_date
      ? new Date(certificationData?.expiration_date)
      : null,
  };
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const payload = { ...data };

    try {
      if (type === CONSTANTS.EDIT) {
        payload.certId = certificationData.id;
        await dispatch(editCertificationDetails(candidateIdData?.cand_org_id, payload));
      } else {
        await dispatch(addCertificationsDetails(candidateIdData?.cand_org_id, payload));
      }
      isSubmitted.onTrue();
    } catch (err) {
      console.log(err);
    }
  });

  useEffect(() => {
    if (isSubmitted.value && formErr) {
      toast.error('something went wrong', { variant: 'error' });
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !formErr) {
      toast.success(`Certification ${type === CONSTANTS.EDIT ? 'edited' : 'added'} Successfully`);
      isOpenModal.onFalse();
      dispatch(getCandidateCertificationDetails(candidateIdData?.cand_org_id));
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
        <Typography variant="h6">Add Certification</Typography>
        <Typography variant="body2" color="#637381">
          Title, short description, image...
        </Typography>
      </Stack>
      <Divider sx={{ mt: 3 }} />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Certification Name" required />

              <Field.Text name="name" placeholder="Enter Certification Name" />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Certification Id" />

              <Field.Text name="cert_id" placeholder="Enter Certification Id" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <CustomLabel title="Certifying Body" />

              <Field.Text name="issuing_body" placeholder="Enter Certifying Body" />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Start Date" />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="date_obtained"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Start Date"
                      maxDate={new Date()}
                      views={['year', 'month']}
                      format="MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="End Date" />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="expiration_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="End Date"
                      maxDate={new Date()}
                      views={['year', 'month']}
                      format="MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
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

export default AddEditCertificationDetailsModal;
