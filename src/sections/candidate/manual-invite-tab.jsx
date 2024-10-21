import * as yup from 'yup';

import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { manuallyAddCandidate } from 'src/redux/slices/invites';

import { toast } from 'sonner';
import { Field, Form } from 'src/components/hook-form';

// ! component
const ManualInviteCandidate = ({ openAdd }) => {
  // using useDispatch
  const dispatch = useDispatch();
  const { user } = useAuthContext();

  // states
  const submit = useBoolean();
  const [customErrorObj, setCustomErrorObj] = useState(null);

  // extracing data from redux store
  const { individualJobPostData } = useSelector((state) => state.jobpost);
  const { error: submitError } = useSelector((state) => state.invites);

  // generating dynamic schema
  const validationSchema = yup.object().shape(
    Array.from({ length: 10 })
      .map((_, index) => {
        const nameKey = `candidateName${index + 1}`;
        const emailKey = `candidateEmail${index + 1}`;

        return {
          [nameKey]: yup.string(),
          [emailKey]: yup.string().when(nameKey, {
            is: (name) => !!name && name.length > 0,
            then: () => yup.string().email('Invalid email').required('Candidate Email is required'),
            otherwise: () => yup.string().email('Invalid email'),
          }),
        };
      })
      .reduce((acc, obj) => ({ ...acc, ...obj }), {})
  );

  // function to convert data as per api requirement
  const convertData = (values) => {
    // to get key value pair as array
    const filteredData = Object.entries(values)

      // filtering the value in whcih the key starts with candidate and value is
      .filter(([key, value]) => key.startsWith('candidate') && value !== '')

      // to convert the fitlered array in new array
      .reduce((acc, [key, value]) => {
        // getting index from key to identify teh pair
        const index = key.replace('candidateName', '');

        // pushing obj into accumulator only when email or name is not undefined
        if (
          values[`candidateName${index}`] !== undefined &&
          values[`candidateEmail${index}`] !== undefined
        ) {
          acc.push({
            name: values[`candidateName${index}`],
            email: values[`candidateEmail${index}`],
          });
        }

        return acc;
      }, []);

    // creating final payload
    const finalData = {
      data: filteredData.map((item, index) => ({
        jpid: individualJobPostData?.Job_Id,
        email: item.email,
        name: item.name,
        userType: user?.userType === 2 ? 1 : 2,
      })),
    };

    return finalData;
  };

  // setting initial values
  const initialValues = Array.from({ length: 10 })
    .map((_, index) => {
      const nameKey = `candidateName${index + 1}`;
      const emailKey = `candidateEmail${index + 1}`;

      return {
        [nameKey]: '',
        [emailKey]: '',
      };
    })
    .reduce((acc, obj) => ({ ...acc, ...obj }), {});

  // passing initial values and validationSchema in to form object
  const methods = useForm({
    initialValues,
    resolver: yupResolver(validationSchema),
  });

  // extracting required variables from methods
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // submit function
  const onsubmit = handleSubmit(async (data) => {
    try {
      // checking that values field is empty or not
      const isAtLeastOneCandidateEntered = Object.values(data).some(
        (value, index) => index % 2 === 0 && value.trim() !== ''
      );

      // if its empty then setting error
      if (!isAtLeastOneCandidateEntered) {
        // Set error for the first field (candidateName1)
        setValue('candidateName1', 'You must enter at least one candidate detail');
        return;
      }

      // making api call with modifieded data
      await dispatch(manuallyAddCandidate(convertData(data)));

      // setting submit state as true
      submit.onTrue();
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  });

  // notifying user about success or failure
  useEffect(() => {
    // failure scenario
    if (submitError && submit.value) {
      // setting custom error in custom error obj
      setCustomErrorObj('Something Went Wrong Please Try Again Later');

      // changing submit state
      submit.onFalse();
    }
    // success scenario
    if (!submitError && submit.value) {
      toast.success('Candidate Added successfully');

      // closing modal
      openAdd.onFalse();

      // changing submit state
      submit.onFalse();

      // reseting form
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitError, submit, dispatch]);

  // function to render text fields dyamically
  const renderFields = () =>
    Array.from({ length: 10 }).map((item, index) => (
      <React.Fragment key={index + 1}>
        {/* candidate name  */}
        <Grid item sm={12} lg={6}>
          <Field.Text name={`candidateName${index + 1}`} label="Candidate Name" />
        </Grid>
        {/* candidate email  */}
        <Grid item sm={12} lg={6}>
          <Field.Text name={`candidateEmail${index + 1}`} label="Candidate Email" />
        </Grid>
      </React.Fragment>
    ));

  return (
    <Form onSubmit={onsubmit} methods={methods}>
      <Grid container spacing={2}>
        {renderFields()}
        {/* custom error when error occurred  */}
        <Grid item md={6}>
          {customErrorObj && submitError && (
            <>
              <Typography variant="caption" color="error">
                Cannot upload candidates
              </Typography>
              <Typography variant="caption" color="error">
                <ul>
                  <li>
                    <Typography variant="caption" color="error">
                      {customErrorObj}
                    </Typography>
                  </li>
                </ul>
              </Typography>
            </>
          )}
        </Grid>
        {/* action buttons  */}
        <Grid
          item
          md={6}
          width="100%"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={3}
        >
          <Button variant="outlined" onClick={openAdd.onFalse}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Add Candidates
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};

export default ManualInviteCandidate;
