import * as yup from 'yup';
import { toast } from 'sonner';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { parsePhoneNumber } from 'react-phone-number-input';

import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';
import { DateFormat } from 'src/utils/helperFunctions';

import { fetchMasters } from 'src/redux/slices/masters';
import { fetchPlatformConstants } from 'src/redux/slices/general';
import {
  getLocationData,
  setCandidateData,
  addCandidatePersonalDetails,
} from 'src/redux/slices/jobposts';

import { Iconify } from 'src/components/iconify';
import { Field, Form } from 'src/components/hook-form';
import CustomLabel from 'src/components/hook-form/label/custom-label';

const PersonalDetails = () => {
  const { constants } = useSelector((state) => state.general);

  // states
  const [isFileSize, setIsFileSize] = useState(false);
  const [isFileTypeInvalid, setIsFileTypeInvalid] = useState(false);
  const [isResumeChanged, setIsResumeChanged] = useState(false);
  const [isProfileChanged, setIsProfileChanged] = useState(false);

  const [formData, setFormData] = useState(null);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: '',
    variant: '',
  });
  const isSubmitted = useBoolean();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  //  redux
  const {
    error: formErr,
    candidateData,
    locationData,
    isLoading,
  } = useSelector((state) => state.jobpost);
  const { individualJobPostData } = useSelector((state) => state.jobpost);
  const { nationalId } = useSelector((state) => state.masters);
  const dispatch = useDispatch();

  // schema
  const personalDetailsSchema = yup.object().shape({
    prof_id: yup.mixed().nullable().required('Profile photo is required'),
    first_name: yup.string().required('First Name is required'),
    middle_name: yup.string(),
    last_name: yup.string().required('Last Name is required'),
    email: yup.string().required('Email is required').email('Enter valid email'),
    phoneNumber: yup.string().required('Phone number is required'),
    gender: yup.object().required('Gender is required'),
    idv1Type: yup.object().required('Prop Type required'),
    idv1: yup.string().required('document number is required'),
    idv2Type: yup
      .object()
      .nullable()
      .test('proof-type-check', 'Document Prop is required', function (value) {
        // eslint-disable-next-line react/no-this-in-sfc
        const { idv2 } = this.parent; // Get the value of idv2
        if (idv2 && idv2.length) {
          return !!value;
        }
        return true;
      }),
    idv2: yup
      .string()
      .nullable()
      .test('proof-type-number-check', 'Document number is required', function (value) {
        // eslint-disable-next-line react/no-this-in-sfc
        const { idv2Type } = this.parent; // Get the value of idv2Type

        if (idv2Type && idv2Type.length && idv2Type[0] !== null) {
          return !!value;
        }
        return true;
      }),
    marital_status: yup.object().required('Maritial status is required'),
    fu_cv_id: yup.mixed().nullable().required('Resume is required'),
    dob: yup.date().required('DOB is required'),
  });

  // default values
  const defaultValues = {
    prof_id: candidateData?.prof_id || null,
    first_name: candidateData?.first_name || '',
    middle_name: candidateData?.middle_name || '',
    last_name: candidateData?.last_name || '',
    email: candidateData?.email || '',
    phoneNumber: candidateData?.phoneNumber || '',
    dob: candidateData?.dob ? new Date(candidateData?.dob) : null,
    gender: candidateData?.gender || null,
    marital_status: candidateData?.marital_status || null,
    fu_cv_id: candidateData?.fu_cv_id || null,
    idv1Type: candidateData?.idv1Type || null,
    idv2Type: candidateData?.idv2Type || null,
    idv1: candidateData?.idv1 || '',
    idv2: candidateData?.idv2 || '',
  };

  // methods
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(personalDetailsSchema),
  });

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // form submit
  const onSubmit = handleSubmit(async (data) => {
    const phoneNumber = parsePhoneNumber(data.phoneNumber);
    const values = {
      ...data,
      jp_id: individualJobPostData?.Job_Id,
      mobile_code: `+${phoneNumber.countryCallingCode}`,
      mobile_no: phoneNumber.nationalNumber,
      gender: data.gender.id,
      marital_status: data?.marital_status?.id,
      idv1Type: data?.idv1Type?.id,
      idv2Type: data?.idv2Type?.id,
    };
    if (!isResumeChanged) {
      delete values.fu_cv_id;
    }
    if (!isProfileChanged) {
      delete values.prof_id;
    }
    delete values.phoneNumber;

    const filteredObj = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== undefined && value !== '')
    );

    try {
      const objFormData = new FormData();
      Object.keys(filteredObj).forEach((key) => {
        objFormData.append(key, values[key]);
      });
      setFormData(data);
      await dispatch(addCandidatePersonalDetails(objFormData));
      isSubmitted.onTrue();
    } catch (err) {
      console.log(err);
      toast.error('something went wrong', { variant: 'error' });
    }
  });

  // handle drop photo
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('prof_id', newFile, { shouldValidate: true });
        setIsProfileChanged(true);
      }
    },
    [setValue]
  );

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

  // form submitting error handling
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
      setDisableSaveBtn(true);
      setShowAlert({
        show: true,
        message: 'Profile saved successfully!',
        variant: 'success',
      });

      dispatch(setCandidateData(formData));
      setIsButtonDisabled(true);
      isSubmitted.onFalse();
      // reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErr, isSubmitted]);

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

  const handleInputChange = () => {
    setIsButtonDisabled(false); // Re-enable the button on input change
  };
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h6">Personal Details</Typography>
        <Typography variant="body2" color="#637381">
          Title, short description, image...
        </Typography>
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

      <Form methods={methods} onSubmit={onSubmit} onChange={handleInputChange}>
        <Grid container mt={2} spacing={2} justifyContent="flex-end">
          <Grid item xs={12}>
            <Field.UploadAvatar
              name="prof_id"
              maxSize={3250585}
              onDrop={handleDrop}
              label="Update Photo"
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3250585)}
                </Typography>
              }
            />
          </Grid>

          <Grid item xs={4}>
            <Stack spacing={1}>
              <CustomLabel title="First Name" required />
              <Field.Text name="first_name" placeholder="Enter First Name" />
            </Stack>
          </Grid>

          <Grid item xs={4}>
            <Stack spacing={1}>
              <CustomLabel title="Middle Name" />

              <Field.Text name="middle_name" placeholder="Enter Middle Name" />
            </Stack>
          </Grid>

          <Grid item xs={4}>
            <Stack spacing={1}>
              <CustomLabel title="Last Name" required />

              <Field.Text name="last_name" placeholder="Enter Last Name" />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Email" required />

              <Stack gap={2}>
                <Field.Text name="email" placeholder="Enter Your mail" />
                <Box display="flex" gap={1} color="#637381">
                  <Iconify icon="material-symbols:info" width={18} />
                  <Typography variant="caption"> Enter official mail</Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <CustomLabel title="Mobile No" required />

              <Field.Phone name="phoneNumber" placeholder="Enter your phone number" />
            </Stack>
          </Grid>

          <Grid item xs={4}>
            <Stack spacing={1}>
              <CustomLabel title="DOB" required />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="DOB"
                      format="dd/MM/yyyy"
                      maxDate={new Date()}
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

          <Grid item xs={4}>
            <Stack spacing={1}>
              <CustomLabel title="Gender" required />

              <Field.Autocomplete
                options={constants?.gender}
                getOptionLabel={(option) => option.variant}
                name="gender"
                placeholder="Select Gender"
              />
            </Stack>
          </Grid>

          <Grid item xs={4}>
            <Stack spacing={1}>
              <CustomLabel title="Maritial Status" required />
              <Field.Autocomplete
                options={constants?.marital_status}
                getOptionLabel={(option) => option.variant}
                name="marital_status"
                placeholder="Maritial Status"
              />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <CustomLabel title="Identity Proof 1" required mb={1} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field.Autocomplete
                  options={nationalId}
                  getOptionLabel={(option) => option.value}
                  name="idv1Type"
                  placeholder="Proof Type"
                />
              </Grid>
              <Grid item xs={6}>
                <Field.Text name="idv1" placeholder="Document number" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <CustomLabel title="Identity Proof 2" mb={1} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field.Autocomplete
                  options={nationalId}
                  getOptionLabel={(option) => option.value}
                  name="idv2Type"
                  placeholder="Proof Type"
                />
              </Grid>
              <Grid item xs={6}>
                <Field.Text name="idv2" placeholder="Document number" />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <CustomLabel title="Latest Resume" required />
            <Stack px={2} pt={3}>
              <Stack spacing={2}>
                {watch().fu_cv_id && (
                  <Typography variant="subtitle2">{watch().fu_cv_id.path}</Typography>
                )}
                {watch()?.fu_cv_id?.updatedAt && (
                  <Typography variant="subtitle2" color="#4B5565">
                    Last Updated on {DateFormat(watch()?.fu_cv_id?.updatedAt, 'd MMM yyyy, h:mm a')}
                  </Typography>
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

          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
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

              <Grid item xs={6}>
                <Box display="flex" justifyContent="end">
                  <LoadingButton
                    color="success"
                    type="submit"
                    startIcon={<Iconify icon="bxs:file" />}
                    disabled={isButtonDisabled || isSubmitting}
                    // disabled={disableSaveBtn}
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Save
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </Card>
  );
};
export default PersonalDetails;
