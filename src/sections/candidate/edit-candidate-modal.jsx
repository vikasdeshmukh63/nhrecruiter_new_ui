import * as yup from 'yup';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Button from '@mui/material/Button';
import { Grid, Dialog, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { finderFunction } from 'src/utils/helperFunctions';

import { updateCandidate, getCandidatesBasedOnJobId } from 'src/redux/slices/candidate';
import { toast } from 'sonner';
import { Field, Form } from 'src/components/hook-form';

const style = {
  width: '100%',
  boxShadow: 24,
  p: 4,
};

export default function CandidateQuickEditForm({ openEdit, currentCandidate }) {
  const dispatch = useDispatch();

  const [resumeFileName, setResumeFileName] = useState('');
  const isSubmitted = useBoolean();
  const isResumeChanged = useBoolean();

  // extracting data from the redux
  const { error: submitError } = useSelector((state) => state.candidate);
  const { countries, languages } = useSelector((state) => state.general);
  const { nationalId } = useSelector((state) => state.masters);
  const { individualJobPostData } = useSelector((state) => state.jobpost);

  // setting default values
  const defaultValues = {
    name: currentCandidate?.name || '',
    email: currentCandidate?.email || '',
    mobile_code: finderFunction('dial_code', currentCandidate?.mobile_code, countries) || null,
    mobile_no: currentCandidate?.mobile_no || '',
    lang_id: finderFunction('id', currentCandidate?.lang_id, languages) || null,
    idType: nationalId[0] || null,
    uid1_no: currentCandidate?.uid1_no || '',
    fu_cv_id: currentCandidate?.file_resume || null,
  };

  // validation schema
  const candidateSchema = yup.object().shape({
    name: yup
      .string()
      .required('Full Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Only alphabetic characters are allowed'),
    email: yup.string().email('Invalid email').required('Email is required'),
    mobile_code: yup.object().nullable().required('Select Mobile Code'),
    mobile_no: yup
      .string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Invalid phone number'),
    lang_id: yup.object().nullable().required('Language is required'),
    idType: yup.object().nullable().required('Id is required'),
    uid1_no: yup.string().required('Id Details is required'),
    fu_cv_id: resumeFileName
      ? yup.mixed().nullable()
      : yup.mixed().nullable().required('Resume is required'),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(candidateSchema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  // submit function
  const onsubmit = handleSubmit(async (data) => {
    const payload = {
      name: data.name,
      mobile_no: data.mobile_no,
      mobile_code: data.mobile_code.dial_code,
      lang_id: data.lang_id.id,
      uid1_no: data.uid1_no,
    };

    try {
      if (isResumeChanged.value) {
        payload.fu_cv_id = data.fu_cv_id;
      }

      // as we need to send the files hence need to send with formdata
      const formData = new FormData();

      // appending the file to formdata
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      // making an api call
      await dispatch(updateCandidate(currentCandidate?.CAND_Id, formData));

      // getting updated data
      await dispatch(getCandidatesBasedOnJobId(individualJobPostData?.Job_Id));

      isSubmitted.onTrue();
    } catch (err) {
      toast.error('Something Went Wrong');
    }
  });

  // getting updated data when the currentcandidate data changes
  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCandidate, reset]);

  // for showing submitted form error msgs
  useEffect(() => {
    if (isSubmitted.value && submitError) {
      toast.error('Unable to Edit Candidate');
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !submitError) {
      toast.success('Candidate Edited Successfully');
      reset();
      openEdit.onFalse();
      isResumeChanged.onFalse();
      isSubmitted.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, submitError]);

  // handle photo change
  const handleDrop = useCallback(
    (event) => {
      const file = event.target.files[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('fu_cv_id', newFile, { shouldValidate: true });
        setResumeFileName(file.name);
        isResumeChanged.onTrue();
      }
    },
    [isResumeChanged, setValue]
  );

  // setting initial resume
  useEffect(() => {
    if (currentCandidate?.file_resume) {
      setResumeFileName(currentCandidate?.file_resume);
    }
  }, [currentCandidate?.file_resume]);

  // handle close model
  const handleCloseModal = () => {
    openEdit.onFalse();
    reset();
  };

  return (
    <div>
      <Dialog
        open={openEdit.value}
        onClose={openEdit.onFalse}
        PaperProps={{ sx: { borderRadius: 1 } }}
      >
        <Form onSubmit={onsubmit} methods={methods}>
          <Grid container p={3} flexDirection="column" width={600} spacing={3}>
            {/* heading */}
            <Grid item xs={12}>
              <Typography id="transition-modal-title" variant="subtitle1" component="h2">
                Edit Candidate
              </Typography>
            </Grid>

            {/* file input  */}
            <Grid item xs={12}>
              <label htmlFor="file-input">
                <Button
                  variant="outlined"
                  fullWidth
                  component="span"
                  startIcon={<Icon icon="line-md:upload-loop" />}
                  sx={{
                    border: '2px dashed #919EAB',
                    width: '100%',
                    height: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 3,
                    cursor: 'pointer',
                    alignSelf: 'center',
                  }}
                >
                  <input
                    type="file"
                    name="fileUpload"
                    accept=".doc, .pdf"
                    style={{ display: 'none' }}
                    onChange={handleDrop}
                    id="file-input"
                  />
                  Upload Resume
                </Button>
              </label>
              {resumeFileName && (
                <Typography variant="caption" sx={{ mt: 2 }}>
                  <span style={{ color: '#1976D2' }}>{resumeFileName}</span> Uploaded
                </Typography>
              )}
              {errors?.fu_cv_id?.message && (
                <Typography variant="caption" color="error" sx={{ mt: 2 }}>
                  {errors?.fu_cv_id?.message}
                </Typography>
              )}
            </Grid>

            {/* name  */}
            <Grid item xs={12}>
              <Field.Text name="name" label="Full Name" />
            </Grid>

            {/* email  */}
            <Grid item xs={12}>
              <Field.Text name="email" label="Email" readOnly />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={3}>
                {/* mobile code  */}
                <Field.Autocomplete
                  name="mobile_code"
                  options={countries}
                  getOptionLabel={(option) => option?.dial_code}
                  label="Code"
                />

                {/* mobile no  */}
                <Field.Text name="mobile_no" label="Phone Number" />
              </Stack>
            </Grid>

            {/* language  */}
            <Grid item xs={12}>
              <Field.Autocomplete
                name="lang_id"
                options={languages}
                getOptionLabel={(option) => option?.name}
                label="Select language"
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={3}>
                {/* id type  */}
                <Grid item xs={3}>
                  <Field.Autocomplete
                    name="idType"
                    options={nationalId}
                    getOptionLabel={(option) => option?.name}
                    label="National ID"
                  />
                </Grid>

                {/* id number  */}
                <Grid item xs={9}>
                  <Field.Text name="uid1_no" label="ID Number" />
                </Grid>
              </Grid>
            </Grid>

            {/* action buttons  */}
            <Grid item xs={12} display="flex" justifyContent="flex-end" alignItems="center" gap={3}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Dialog>
    </div>
  );
}
