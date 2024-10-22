import { Icon } from '@iconify/react';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import {
  Card,
  Grid,
  Button,
  Dialog,
  Divider,
  Checkbox,
  IconButton,
  Typography,
  CircularProgress,
  FormControlLabel,
  Stack,
  Box,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DateFormat, EvalType } from 'src/utils/helperFunctions';

import { setNewSkill } from 'src/redux/slices/skills';
import { getUserData } from 'src/redux/slices/userAccount';
import { setIsCandidateEdited } from 'src/redux/slices/candidate';
import {
  resetSteps,
  createJobPost,
  updateJobPost,
  removeLastMainStep,
  setMainCurrentSteps,
  setPreferanceCurrentSteps,
} from 'src/redux/slices/jobposts';

const SuccessModal = ({ openModal, handleNavigate, type }) => (
  <Dialog
    open={openModal.value}
    onClose={openModal.onFalse}
    PaperProps={{ sx: { borderRadius: 1, px: 3, py: 5, width: 500 } }}
  >
    <Stack spacing={2}>
      <Typography fontSize="24px" variant="subtitle1" align="center" color="green" mb={2}>
        Great
      </Typography>
      <Typography variant="body2" fontSize="16px" align="center" mb={2}>
        {`Your job post has been ${type === 'create' ? 'created' : 'updated'} !!`}
      </Typography>
      <Button variant="contained" onClick={handleNavigate}>
        Close
      </Button>
    </Stack>
  </Dialog>
);

const VerifyJobPosting = ({ type }) => {
  // states
  const dispatch = useDispatch();
  const router = useRouter();
  const agree = useBoolean();
  const openModal = useBoolean();
  const isExpanded = useBoolean();
  const formSubmitted = useBoolean();
  const loading = useBoolean();
  const initialLength = 500;

  // function to make button clickable after agree to terms and conditions
  const handleCheckBox = () => {
    agree.onToggle();
  };

  // accessing data from redux store
  const { jobData, individualJobPostData } = useSelector((state) => state.jobpost);

  const { userData } = useSelector((state) => state.userAccount);
  const { mainStepsDone, mainCurrentStep, preferenceStepsDone, preferenceCurrentStep, error } =
    useSelector((state) => state.jobpost);
  const { proficiencies } = useSelector((state) => state.masters);

  // function to handle go back to previous page function
  const handleBack = () => {
    // if mainCurrentStep is not zero then only we have to go back or reduce steps
    if (mainCurrentStep >= 0) {
      dispatch(setMainCurrentSteps(mainCurrentStep - 1));
      dispatch(removeLastMainStep());
    }
  };

  // function to handle navigation to other page
  const handleNavigateToJobDetails = () => {
    dispatch(setMainCurrentSteps(0));
  };

  // function to handle navigation to other page
  const handleNavigateToEvaluation = () => {
    dispatch(setMainCurrentSteps(1));
    dispatch(setPreferanceCurrentSteps(0));
  };

  // function to find respective proficiency according to id
  const findProficiencies = (id) => proficiencies.find((item) => item.id === id)?.value;

  // function to find respective evaluation type according to id

  const findEvaluationType = (id) => EvalType.find((item) => item.id === id)?.name;

  // function to extract id of skill from jobData
  const skillIdExtractor = (data) => {
    const idArray = data.map((item) => item.id);
    const idString = idArray.join(',');
    return idString;
  };

  // function to extract id of the selected proficiencies
  const skillProficiencyExtractor = (data) => {
    const idArray = data.map((item) => item.skillLevel);
    const idString = idArray.join(',');
    return idString;
  };

  const skillEvalTypeExtractor = (data) => {
    const idArray = data.map((item) => item.skillEvalType);
    const idString = idArray.join(',');
    return idString;
  };
  // function to set evaluation values
  function setEvaluationValues(evaluationId) {
    if (evaluationId === '1') {
      return 'Beginner';
    }
    if (evaluationId === '2') {
      return 'Intermediate';
    }
    if (evaluationId === '3') {
      return 'Advanced';
    }
    return '';
  }

  // setting or creating payload
  const payload = useMemo(
    () => ({
      title: jobData?.jobTitle,
      jd: jobData?.jobDescription,
      req_personal: !!jobData?.personalEvaluation,
      personal_mode: Number(jobData?.personalEvaluation) || 0,
      req_behavioural: !!jobData?.behavioralEvaluation,
      behavioural_mode: Number(jobData?.behavioralEvaluation) || 0,
      req_background: !!jobData?.backgroundEvaluation,
      background_mode: Number(jobData?.backgroundEvaluation) || 0,
      req_technical: !!jobData?.technicalEvaluation,
      technical_mode: Number(jobData?.technicalEvaluation) || 0,
      coding_evaluation: !!jobData?.codingEvaluation,
      lang_id: jobData?.language?.id,
      start_date: jobData?.from,
      end_date: jobData?.to,
      org_id: userData?._org_id?.id_str,
      comp_id: Number(jobData?.company?.id_str),
    }),
    [jobData, userData]
  );

  // function to post or create job
  const createJob = async () => {
    if (type === 'edit') {
      loading.onTrue();
      // calling api to create jobPost
      await dispatch(updateJobPost(individualJobPostData?.Job_Id, payload));
      await dispatch(setNewSkill(null));
      loading.onFalse();
      await formSubmitted.onTrue();
      dispatch(setIsCandidateEdited(true));
    }
    if (type === 'create') {
      loading.onTrue();
      // calling api to create jobPost
      await dispatch(createJobPost(payload));
      await dispatch(setNewSkill(null));
      loading.onFalse();
      await formSubmitted.onTrue();
      dispatch(setIsCandidateEdited(true));
    }
  };

  useEffect(() => {
    if (jobData?.skills) {
      payload.skills = skillIdExtractor(jobData?.skills);
      payload.prof_mode = skillProficiencyExtractor(jobData?.skills);
      payload.eval_type = skillEvalTypeExtractor(jobData?.skills);
    }

    if (payload.eval_type) {
      const arr = payload.eval_type.split(',');
      if (arr.includes('2')) {
        payload.coding_evaluation = true;
      } else {
        payload.coding_evaluation = false;
      }
    }
  }, [jobData?.skills, payload]);

  // function to handle navigating to other page
  const handleNavigate = () => {
    // navigating user to jobpost list page
    router.push('/application/jobposts/view/');
    dispatch(resetSteps());
    openModal.onFalse();
    formSubmitted.onFalse();
  };

  // showing modal
  useEffect(() => {
    if (!error && formSubmitted.value) {
      openModal.setValue(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, formSubmitted]);

  // function to view more or view less the job description
  const toggleView = () => {
    isExpanded.onToggle();
  };

  // substring
  const text = jobData?.jobDescription;
  const truncatedText = isExpanded.value ? text : `${text?.substring(0, initialLength)}...`;

  // getting userdata if not available
  useEffect(() => {
    if (!userData) {
      dispatch(getUserData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <>
      {jobData && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
            flexDirection: 'column',
            mt: 5,
          }}
        >
          <Typography align="left" width="100%" variant="subtitle1">
            Verify Job Posting
          </Typography>
          <Divider sx={{ width: '100%' }} />
          <Card sx={{ p: 3, width: '100%' }}>
            <Stack width="100%" justifyContent="space-between" direction="row" p={1}>
              <Typography variant="subtitle2">Job Details</Typography>
              <IconButton onClick={handleNavigateToJobDetails}>
                <Icon icon="ic:outline-edit" />
              </IconButton>
            </Stack>
            <Divider />
            <Grid container pt={3} px={1}>
              <Grid item xs={6} md={6}>
                <Stack>
                  <Typography variant="subtitle2">Job Title</Typography>
                  <Typography variant="caption">Master Degree</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="subtitle2">{jobData?.jobTitle}</Typography>
              </Grid>
              <Grid item xs={6} md={6} sx={{ mt: 3 }}>
                <Stack>
                  <Typography variant="subtitle2">Job Description</Typography>
                  <Typography variant="caption">Master Degree</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6} md={6} sx={{ mt: 3 }}>
                {/* eslint-disable-next-line react/no-danger */}
                <div style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: truncatedText }} />
                <button
                  type="button"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#1e88e5',
                    padding: '0',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                  onClick={toggleView}
                >
                  {!isExpanded.value && text?.length > initialLength ? 'View More' : 'View Less'}
                </button>
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 3, width: '100%' }}>
            <Stack width="100%" justifyContent="space-between" direction="row" p={1}>
              <Typography variant="subtitle2">Job Details</Typography>
              <IconButton onClick={handleNavigateToEvaluation}>
                <Icon icon="ic:outline-edit" />
              </IconButton>
            </Stack>
            <Divider />
            {/* <Grid container pt={3} px={1}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  pb: { xs: 3 },
                }}
              >
                <Typography variant="subtitle2">Evaluation</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container>
                  <Grid item xs={6} md={6}>
                    {jobData?.personalEvaluation && (
                      <Stack>
                        <Typography variant="subtitle2">Personal Evaluation</Typography>
                        <Typography variant="caption">
                          {setEvaluationValues(jobData?.personalEvaluation)}
                        </Typography>
                      </Stack>
                    )}
                  </Grid>
                  <Grid item xs={6} md={6}>
                    {jobData?.behavioralEvaluation && (
                      <Stack>
                        <Typography variant="subtitle2">Behavioral Evaluation</Typography>
                        <Typography variant="caption">
                          {setEvaluationValues(jobData?.behavioralEvaluation)}
                        </Typography>
                      </Stack>
                    )}
                  </Grid>
                  <Grid item xs={6} md={6} sx={{ mt: 3 }}>
                    {jobData?.backgroundEvaluation && (
                      <Stack>
                        <Typography variant="subtitle2">Background Evaluation</Typography>
                        <Typography variant="caption">
                          {setEvaluationValues(jobData?.backgroundEvaluation)}
                        </Typography>
                      </Stack>
                    )}
                  </Grid>
                  <Grid item xs={6} md={6} sx={{ mt: 3 }}>
                    {jobData?.technicalEvaluation && (
                      <Stack>
                        <Typography variant="subtitle2">Technical Evaluation</Typography>
                        <Typography variant="caption">
                          {setEvaluationValues(jobData?.technicalEvaluation)}
                        </Typography>
                      </Stack>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid> */}
            <Grid container pt={3} px={1}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  pb: { xs: 3 },
                }}
              >
                <Stack>
                  <Typography variant="subtitle2">Technical Skills</Typography>
                  <Typography variant="caption">Master Degree</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container>
                  {jobData &&
                    jobData.skills &&
                    jobData.skills.map((item, index) => (
                      <Grid key={index} item xs={6} md={4} sx={{ mt: 3 }}>
                        <Stack>
                          <Typography variant="subtitle2">{item.name}</Typography>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="caption">
                              {findProficiencies(item.skillLevel)}
                            </Typography>
                            <Typography variant="caption">
                              {findEvaluationType(item.skillEvalType)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid container pt={3} px={1}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  pb: { xs: 3 },
                }}
              >
                <Stack>
                  <Typography variant="subtitle2">Start & End Date</Typography>
                  <Typography variant="caption">Master Degree</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container>
                  <Grid item xs={6} md={6}>
                    <Typography variant="caption">
                      {DateFormat(jobData?.from, 'MM/dd/yyyy hh:mm a')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography variant="caption">
                      {DateFormat(jobData?.to, 'MM/dd/yyyy hh:mm a')}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Stack>
                    <Typography variant="subtitle2">Language Mode</Typography>
                    <Typography variant="caption">Master Degree</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption">{jobData?.language?.name}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <Box sx={{ mt: 3, width: '100%' }}>
            <FormControlLabel
              control={<Checkbox checked={agree.value} onClick={handleCheckBox} />}
              label="Agree with Terms & Condition"
            />
          </Box>
          {error && (
            <Typography variant="caption" color="red" align="left" width="100%">
              Something Went Wrong Please Try Again Later
            </Typography>
          )}
          <Divider sx={{ width: '100%' }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button
              startIcon={<Icon icon="solar:layers-bold-duotone" />}
              disabled={!agree.value || loading.value} // disable the button when 'agree' is true or when loading is true
              variant="contained"
              type="submit"
              onClick={createJob}
            >
              {/* eslint-disable-next-line no-nested-ternary */}
              {loading.value ? ( // show loading spinner when 'loading' is true
                <CircularProgress size={24} />
              ) : type === 'edit' ? (
                'Update Job Post'
              ) : (
                'Create Job Post'
              )}
            </Button>
          </Box>
        </Box>
      )}
      {/* success modal  */}
      <SuccessModal openModal={openModal} handleNavigate={handleNavigate} type={type} />
    </>
  );
};

export default VerifyJobPosting;
