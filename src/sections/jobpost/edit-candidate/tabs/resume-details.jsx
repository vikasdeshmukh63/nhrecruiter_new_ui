import * as yup from 'yup';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';

import { Alert, Card, Divider, Grid, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DateFormat } from 'src/utils/helperFunctions';

import { editCandidateResume, getCandidatePersonalDetails } from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import { Field, Form } from 'src/components/hook-form';
import CustomLabel from 'src/components/hook-form/label/custom-label';

const ResumeDetails = ({ type }) => {
  // states
  const [isFileSize, setIsFileSize] = useState(false);
  const [isFileTypeInvalid, setIsFileTypeInvalid] = useState(false);
  const [isResumeChanged, setIsResumeChanged] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: '',
    variant: '',
  });
  const isSubmitted = useBoolean();

  const {
    error: formErr,
    candidateData,
    editCandidateId,
    isLoading,
  } = useSelector((state) => state.jobpost);

  const dispatch = useDispatch();

  const resumeSchema = yup.object().shape({
    fu_cv_id: yup.mixed().nullable().required('Resume is required'),
  });

  // default values
  const defaultValues = {
    fu_cv_id: candidateData?.fu_cv_id || null,
  };

  // methods
  const methods = useForm({
    defaultValues,

    resolver: yupResolver(resumeSchema),
  });

  const { watch, setValue, reset, handleSubmit } = methods;
  // form submit
  const onSubmit = handleSubmit(async (data) => {
    const values = {
      ...data,
    };

    const filteredObj = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== undefined && value !== '')
    );

    try {
      const objFormData = new FormData();
      Object.keys(filteredObj).forEach((key) => {
        objFormData.append(key, values[key]);
      });

      await dispatch(editCandidateResume(editCandidateId, objFormData));
      isSubmitted.onTrue();
    } catch (err) {
      console.log(err);
      toast.error('something went wrong', { variant: 'error' });
    }
  });

  // resume adding
  const handleDropResume = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      // List of supported formats
      const supportedFormats = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
        'application/rtf',
      ];

      // Check if the file format is supported
      if (!supportedFormats.includes(file.type)) {
        setIsFileTypeInvalid(true);
        setValue('fu_cv_id', null);
        return;
      }

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        const size = Math.ceil(newFile.size / (1024 * 1024));
        if (size > 2) {
          setIsFileSize(true);
          setIsFileTypeInvalid(false);
          setValue('fu_cv_id', null);
          return;
        }
        setIsResumeChanged(true);
        setValue('fu_cv_id', newFile, { shouldValidate: true });
        setIsFileSize(false);
        setIsFileTypeInvalid(false);
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (isResumeChanged) {
      onSubmit();
      setIsResumeChanged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResumeChanged]);

  // show the alert
  useEffect(() => {
    let timer;
    if (showAlert.show) {
      timer = setTimeout(() => {
        setShowAlert({
          show: false,
          message: '',
          variant: '',
        });
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert.show]);

  useEffect(() => {
    if (candidateData) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateData]);

  useEffect(() => {
    if (isSubmitted.value && formErr) {
      setShowAlert({
        show: true,
        message: formErr?.message || 'Something Went Wrong',
        variant: 'error',
      });
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !formErr) {
      setShowAlert({
        show: true,
        message: 'Profile saved successfully!',
        variant: 'success',
      });
      dispatch(getCandidatePersonalDetails(editCandidateId));

      isSubmitted.onFalse();
      // reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErr, isSubmitted]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h6">Resume</Typography>
        {watch()?.fu_cv_id?.updatedAt && (
          <Typography variant="subtitle2" color="#4B5565">
            Last Updated on {DateFormat(watch()?.fu_cv_id?.updatedAt, 'd MMM yyyy')}
          </Typography>
        )}
      </Stack>
      <Divider sx={{ mt: 3 }} />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomLabel title="Latest Resume" />
            <Stack px={2} pt={3}>
              <Stack spacing={2}>
                {watch().fu_cv_id && (
                  <Typography variant="subtitle2">{watch().fu_cv_id.path}</Typography>
                )}

                <Stack direction="row" spacing={1}>
                  <Field.UploadBox
                    name="fu_cv_id"
                    onDrop={handleDropResume}
                    placeholder={
                      <Stack spacing={0.5} alignItems="center">
                        <Iconify icon="eva:cloud-upload-fill" color="#00a76f" width={40} />
                        <Typography variant="body2">Upload Resume</Typography>
                      </Stack>
                    }
                    sx={{ flexGrow: 1, height: 'auto', py: 2.5, mb: 3 }}
                  />
                </Stack>
              </Stack>

              {isFileTypeInvalid && (
                <Typography variant="caption" color="error">
                  Please upload valid file
                </Typography>
              )}
              {isFileSize && (
                <Typography variant="caption" color="error">
                  File size is more than 2 mb
                </Typography>
              )}

              <Typography variant="body2" color="#919EAB">
                Supported Formats: doc, docx, rtf, pdf, up to 2 MB
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            {showAlert.show && (
              <Alert
                sx={{ width: 1 }}
                variant="outlined"
                severity={showAlert.variant}
                onClose={() => setShowAlert({ show: false, message: '', variant: '' })}
              >
                {showAlert.message}
              </Alert>
            )}
          </Grid>
        </Grid>
      </Form>
    </Card>
  );
};

export default ResumeDetails;
