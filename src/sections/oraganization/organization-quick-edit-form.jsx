import * as yup from 'yup';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import { Box, Stack, Button, Dialog, Typography } from '@mui/material';

import { fData } from 'src/utils/format-number';
import { finderFunction, getValidationError } from 'src/utils/helperFunctions';

import { updateOrganization, fetchOrganizationList } from 'src/redux/slices/organization';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const style = {
  width: 600,
  boxShadow: 24,
  p: 4,
};

const imageInputStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 3,
};

// ----------------------------------------------------------------------

export function OrganizationQuickEditForm({ currentOrg, open, onClose }) {
  const dispatch = useDispatch();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(currentOrg?._prof_id?.path || null);
  const [isPhotoChanged, setIsPhotoChanged] = useState(false);
  const [errorState, setErrorState] = useState('');

  // extracting data from the redux
  const { error: submitError } = useSelector((state) => state.organization);
  const { countries } = useSelector((state) => state.general);

  const defaultValues = {
    name: currentOrg?.name || '',
    email: currentOrg?.email || '',
    mobile_code: finderFunction('dial_code', currentOrg?.mobile_code, countries) || null,
    mobile_no: currentOrg?.mobile_no || '',
    houseno: currentOrg?.houseno || '',
    street: currentOrg?.street || '',
    city: currentOrg?.city || '',
    state: currentOrg?.state || '',
    zipcode: currentOrg?.zipcode || '',
    country: finderFunction('name', currentOrg?.country, countries) || null,
    prof_id: profilePhoto,
  };
  const industrySchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().required('Email is required'),
    mobile_code: yup.object().nullable().required('Code is required'),
    mobile_no: yup.string().required('Phone Number is required'),
    houseno: yup.string().required('House no is required'),
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipcode: yup.string().required('Zipcode is required'),
    country: yup.object().nullable().required('Country is required'),
    prof_id: yup.mixed().required('Profile Pic is required'),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(industrySchema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onsubmit = handleSubmit(async (data) => {
    const payload = {
      name: data.name,
      mobile_code: data.mobile_code.dial_code,
      mobile_no: data.mobile_no,
      email: data.email || currentOrg?.email,
      street: data.street,
      city: data.city,
      state: data.state,
      zipcode: Number(data.zipcode),
      houseno: data.houseno,
      country: data.country.name,
    };

    try {
      if (isPhotoChanged) {
        payload.prof_id = data.prof_id;
      }

      // as we need to send the files hence need to send with formdata
      const formData = new FormData();

      // appeding the file to formdata
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      // making an api call
      await dispatch(updateOrganization(currentOrg?.id_str, formData));
      setTimeout(async () => {
        await dispatch(fetchOrganizationList(0, 10));
        setIsSubmitted(true);
      }, 500);
    } catch (err) {
      toast.error('Something Went Wrong');
    }
  });

  // for showing submitted form error msgs
  useEffect(() => {
    if (isSubmitted && submitError) {
      setErrorState(getValidationError(submitError));
      toast.error('Unable to edit Organization!');
      setIsSubmitted(false);
    }
    if (isSubmitted && !submitError) {
      toast.success('Organization edited Successfully');
      // reset();
      onClose();
      setIsSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, submitError]);

  // handle photo change
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('prof_id', newFile, { shouldValidate: true });
        setIsPhotoChanged(true);
      }
    },
    [setValue]
  );

  // setting initial img
 useEffect(() => {
    if (currentOrg?._prof_id?.path) {
      setProfilePhoto(currentOrg?._prof_id?.path);
    }
  }, [currentOrg]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 1 } }}>
        <Form onSubmit={onsubmit} methods={methods}>
          <Box sx={style}>
            {/* heading */}
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Edit Organization
            </Typography>
            <Stack my={2} spacing={2}>
              {/* image input  */}
              <Box sx={imageInputStyle}>
                <Field.UploadAvatar
                  name="prof_id"
                  label="upload Logo"
                  maxSize={128000}
                  onDrop={handleDrop}
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
                      <br /> max size of {fData(128000)}
                    </Typography>
                  }
                />
              </Box>

              {/* name  */}
              <Box>
                <Field.Text name="name" label="Organization Name" />
              </Box>

              {/* email  */}
              <Box>
                <Field.Text name="email" label="Email Address" />
              </Box>

              <Box display="flex" gap={2}>
                {/* mobile code */}
                <Field.Autocomplete
                  name="mobile_code"
                  options={countries}
                  getOptionLabel={(option) => option?.dial_code}
                  label="Code"
                />

                {/* mobile number */}
                <Field.Text name="mobile_no" label="Mobile Number" />
              </Box>

              {/* building number */}
              <Box>
                <Field.Text name="houseno" label="Building No./Name" />
              </Box>

              {/* street  */}
              <Box>
                <Field.Text name="street" label="Street" />
              </Box>

              {/* city  */}
              <Box>
                <Field.Text name="city" label="City" />
              </Box>

              {/* state  */}
              <Box>
                <Field.Text name="state" label="State" />
              </Box>

              {/* country  */}
              <Box>
                <Field.Autocomplete
                  name="country"
                  options={countries}
                  getOptionLabel={(option) => option?.name}
                  label="Search Country"
                />
              </Box>

              {/* zipcode  */}
              <Box>
                <Field.Text name="zipcode" label="Area Code" />
              </Box>
            </Stack>

            {errorState && (
              <Box my={2}>
                <Typography variant="caption" color="error">
                  Error! {errorState}
                </Typography>
              </Box>
            )}

            {/* action buttons  */}
            <Stack direction="row" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Stack>
          </Box>
        </Form>
      </Dialog>
    </div>
  );
}

