import * as yup from 'yup';
import * as React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Stack, Dialog } from '@mui/material';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';
import { finderFunction, getValidationError } from 'src/utils/helperFunctions';

import { CONSTANTS } from 'src/constants';
import { createCompany, updateCompany, fetchCompaniesList } from 'src/redux/slices/company';

import { Form, Field } from 'src/components/hook-form';

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

export default function CompaniesQuickEditForm({
  currentCompany,
  open,
  onClose,
  type,
  page,
  rowsPerPage,
  Status,
}) {
  const dispatch = useDispatch();

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [profilePhoto, setProfilePhoto] = React.useState(currentCompany?._prof_id?.path || null);
  const [isPhotoChanged, setIsPhotoChanged] = React.useState(false);
  const [errorState, setErrorState] = React.useState('');

  // extracting data from the redux
  const { error: submitError } = useSelector((state) => state.company);
  const { countries } = useSelector((state) => state.general);

  const defaultValues = {
    name: currentCompany?.name || '',
    email: currentCompany?.email || '',
    houseno: currentCompany?.houseno || '',
    street: currentCompany?.street || '',
    city: currentCompany?.state || '',
    state: currentCompany?.state,
    zipcode: currentCompany?.zipcode,
    country: finderFunction('name', currentCompany?.country, countries) || null,
    prof_id: profilePhoto,
  };

  const industrySchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email:
      type === CONSTANTS.EDIT
        ? yup.string().email('Enter valid email')
        : yup.string().required('Email is required').email('Enter valid email'),
    houseno: yup.string().required('House no is required'),
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipcode: yup.number().required('Zipcode is required'),
    country: yup.object().nullable().required('Country is required'),
    prof_id: yup.mixed().nullable().required('Profile Pic is required'),
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
      email: data.email || currentCompany?.email,
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
      if (type === CONSTANTS.EDIT) {
        await dispatch(updateCompany(currentCompany?.id_str, formData));
      }
      if (type === CONSTANTS.CREATE) {
        await dispatch(createCompany(formData));
      }
      setIsSubmitted(true);
    } catch (err) {
      toast.error('Something Went Wrong');
    }
  });

  // for showing submitted form error msgs
  React.useEffect(() => {
    if (isSubmitted && submitError) {
      setErrorState(getValidationError(submitError, 'Company'));
      toast.error(`Unable to ${type === CONSTANTS.CREATE ? 'add' : 'edit'} Company!`);
      setIsSubmitted(false);
    }
    if (isSubmitted && !submitError) {
      toast.success(`Company ${type === CONSTANTS.CREATE ? 'added' : 'edited'} Successfully`);
      dispatch(fetchCompaniesList(page, rowsPerPage, Status));
      onClose();
      setIsSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, submitError]);

  // handle photo change
  const handleDrop = React.useCallback(
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
  React.useEffect(() => {
    if (currentCompany?._prof_id?.path && type === CONSTANTS.EDIT) {
      setProfilePhoto(currentCompany?._prof_id?.path);
    }
  }, [currentCompany, type]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 1 } }}>
        <Form onSubmit={onsubmit} methods={methods}>
          <Box sx={style}>
            {/* heading */}
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {type === CONSTANTS.EDIT ? 'Edit Company' : 'Add Company'}
            </Typography>
            <Stack my={2} spacing={2}>
              {/* image input  */}
              <Box sx={imageInputStyle}>
                <Field.UploadAvatar
                  name="prof_id"
                  label="upload Logo"
                  maxSize={5242880}
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
                      <br /> max size of {fData(5242880)}
                    </Typography>
                  }
                />
              </Box>

              {/* name  */}
              <Box>
                <Field.Text name="name" label="Company Name" />
              </Box>

              {/* email  */}
              <Box>
                <Field.Text
                  name="email"
                  label="Email Address"
                  disabled={type === CONSTANTS.EDIT}
                />
              </Box>

              {/* house no  */}
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
