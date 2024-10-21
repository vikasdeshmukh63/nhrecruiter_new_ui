import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Grid,
  Stack,
  Button,
  Dialog,
  Accordion,
  IconButton,
  Typography,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Divider,
  LinearProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DateFormat, finderFunction, capitalizeFirstLetter } from 'src/utils/helperFunctions';

import { useAuthContext } from 'src/auth/hooks';
import { fetchMasters } from 'src/redux/slices/masters';
import {
  getVideoUrl,
  setVideoUrl,
  getInterviewStatusEvent,
  setCandidateInterviewData,
  getInterviewDetailsBasedOnId,
} from 'src/redux/slices/candidate';

import { Iconify } from 'src/components/iconify';
import { ReactRadialChart } from 'src/components/chart/radial-chart';
import EmptyContent from 'src/components/empty-content/empty-content';

import '../../css/candidate-score.css';
import ViewCodingResponse from './view-coding-response';
import { CandidateMediaView } from './candidate-media-view';

// default values
const defaultValues = {
  expandDetails: true,
  expandEvaluation: true,
  expandMedia: true,
  expandSoftSkill: true,
};

// function to set color according to the value
const statusColorFinder = (value) => {
  if (value >= 0 && value < 4) {
    return 'error';
  }
  if (value >= 4 && value < 8) {
    return 'warning';
  }
  if (value >= 8 && value <= 10) {
    return 'success';
  }
  return 'primary';
};

// styles fro the default styles
const styles = {
  style: {
    fontSize: '14px',
  },
  varient: 'h6',
  fontWeight: 600,
};

// rendering text
function renderText(data, fallBackText) {
  if (data !== null && data !== undefined) {
    return data;
  }
  return fallBackText ? 'Not Available' : '';
}

// returning a coding text
function renderCodingEvaluationText(res) {
  switch (res) {
    case 1:
      return 'Yes';
    case 0:
      return 'No';
    default:
      return 'Not Available';
  }
}

// to get skills data
function getSkillData(skillname, profmode) {
  // converting string to array
  const skillArray = skillname.split(',');
  const profArray = profmode.split(',');

  // adding into new array
  const returnSkillData = skillArray.map((skill, index) => ({
    skill,
    profId: profArray[index],
  }));
  return returnSkillData;
}
export const CandidateAssesmentView = ({ id, isIdChanged }) => {
  const counts = {
    'Disable full screen': 0,
    'Video Obstruction': 0,
    'Tab Changes': 0,
  };

  const [skillsData, setSkillsData] = useState([]);
  // initial state for accordion
  const [expandAccordion, setExpandAccordion] = useState(defaultValues);
  const [inititalRender, setIntitialRender] = useState(false);
  const openCodingResponse = useBoolean(false);
  const [codingData, setCodingData] = useState(null);

  // extract the data from redux
  const { proficiencies } = useSelector((state) => state.masters);
  const { InterviewEventData, videoUrl, loadingScore } = useSelector((state) => state.candidate);
  const { candidateInterviewData } = useSelector((state) => state.candidate);

  // using useDispatch
  const dispatch = useDispatch();

  // router from next navigation
  const router = useRouter();

  // if user exists from context api
  const { user } = useAuthContext();

  // filtering events
  const filteredEvents = InterviewEventData?.filter((event) => [5, 6, 8].includes(event.type));

  // to get the how many times events fired
  filteredEvents?.forEach((event) => {
    if (event.type === 5 && event.details === 'DISABLED') {
      counts['Disable full screen'] += 1;
    } else if (event.type === 6 && event.details === 'DISABLED') {
      counts['Video Obstruction'] += 1;
    } else if (event.type === 8 && event.details === 'INACTIVE') {
      counts['Tab Changes'] += 1;
    }
  });

  // controlled change accordion
  const handleChangeAccordion = (panel) => (_, isExpanded) => {
    setExpandAccordion((prev) => ({
      ...prev,
      [panel]: isExpanded,
    }));
  };

  // sign into to recruiter page
  const handleSignInRec = () => {
    const searchParams = new URLSearchParams({
      returnTo: window.location.pathname,
    }).toString();
    const href = `${'/auth/login'}?${searchParams}`;
    router.replace(href);
  };

  const handleSignUpRec = () => {
    const searchParams = new URLSearchParams({
      returnTo: window.location.pathname,
    }).toString();
    const href = `${'/auth/register'}?${searchParams}`;
    router.replace(href);
  };

  const handleCodingResponseOpen = async (solution) => {
    await setCodingData(solution);
    openCodingResponse.onTrue();
  };

  // clear redux on inititial render
  useEffect(() => {
    // only it will call first render
    if (isIdChanged) {
      dispatch(setCandidateInterviewData(null));
      setIntitialRender(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // to fetch candidate details based on id
  useEffect(() => {
    if (id && isIdChanged) {
      dispatch(getInterviewDetailsBasedOnId(id, { id_str: user?.id_str }));
      dispatch(fetchMasters());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  // to generate skills from server
  useEffect(() => {
    if (candidateInterviewData?.profmode && candidateInterviewData?.skillname) {
      const { skillname, profmode } = candidateInterviewData;
      setSkillsData(getSkillData(skillname, profmode));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateInterviewData]);

  // to get interview events
  useEffect(() => {
    if (
      candidateInterviewData?.Interview_Id &&
      candidateInterviewData?.userType &&
      inititalRender
    ) {
      dispatch(
        getInterviewStatusEvent(candidateInterviewData?.Interview_Id, {
          userType: candidateInterviewData?.userType,
        })
      );
      if (candidateInterviewData?.filename) {
        dispatch(
          getVideoUrl(candidateInterviewData?.filename, {
            userType: candidateInterviewData?.userType,
          })
        );
      } else {
        dispatch(setVideoUrl(''));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateInterviewData?.Interview_Id]);

  // onloading state
  if (!candidateInterviewData && loadingScore) {
    return (
      <Dialog
        open={loadingScore}
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
          sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
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
    );
  }
  // on link expired
  if (!candidateInterviewData && !loadingScore) {
    return <EmptyContent filled title="Your Link Is Expired" />;
  }

  return (
    <>
      {/* details accordion */}
      <Accordion
        expanded={expandAccordion.expandDetails}
        onChange={handleChangeAccordion('expandDetails')}
      >
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="caption">Job Post/ Job Title</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">
                {`${renderText(candidateInterviewData?.Job_Title_Cand)} ${renderText(
                  candidateInterviewData?.title
                )}`}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption">Skills</Typography>
            </Grid>
            <Grid item xs={9}>
              <Grid container spacing={2}>
                {skillsData?.map((skill, index) => (
                  <Grid item xs={6} key={index}>
                    <Typography variant="body2">{skill.skill}</Typography>
                    <Typography variant="caption">
                      {capitalizeFirstLetter(
                        finderFunction('id', skill.profId, proficiencies)?.name
                      )}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="caption">Interview Date</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">
                {candidateInterviewData?.iv_date &&
                  DateFormat(candidateInterviewData?.iv_date, 'dd/MM/yyyy hh:mm a')}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption">Is Coding Interview</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">
                {renderCodingEvaluationText(candidateInterviewData?.coding_evaluation)}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* evaluation accordion */}
      <Accordion
        expanded={expandAccordion.expandEvaluation}
        onChange={handleChangeAccordion('expandEvaluation')}
      >
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Evaluation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={4}>
            {/* Scores */}
            <Stack>
              <Typography variant="subtitle2">Scores</Typography>
              <Box
                display="grid"
                sx={{
                  gridTemplateColumns: {
                    md:
                      candidateInterviewData?.coding_evaluation_cand !== null
                        ? 'repeat(3,1fr)'
                        : 'repeat(2,1fr)',
                  },
                }}
              >
                <Box>
                  <Stack
                    direction="row"
                    justifyContent={{ xs: 'space-between', md: 'start' }}
                    spacing={1}
                    alignItems="center"
                  >
                    <Box width="40%">
                      <Typography variant="overline">TOTAL SCORE</Typography>
                    </Box>
                    <Box width="50%">
                      <ReactRadialChart
                        series={[Number(candidateInterviewData?.final_score) * 10 || 0]}
                        height={230}
                        size="55%"
                        color={statusColorFinder(candidateInterviewData?.final_score)}
                      />
                    </Box>
                  </Stack>
                </Box>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent={{ xs: 'space-between', md: 'start' }}
                    spacing={1}
                    alignItems="center"
                  >
                    <Box width="40%">
                      <Typography variant="overline">JOB FIT SCORE</Typography>
                    </Box>
                    <Box width="50%">
                      <ReactRadialChart
                        height={230}
                        series={[Number(candidateInterviewData?.job_fit_score) * 10 || 0]}
                        size="55%"
                        color={statusColorFinder(candidateInterviewData?.job_fit_score)}
                      />
                    </Box>
                  </Stack>
                </Box>
                {candidateInterviewData?.coding_evaluation_cand !== null && (
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent={{ xs: 'space-between', md: 'start' }}
                      spacing={1}
                      alignItems="center"
                    >
                      <Box width="40%">
                        <Typography variant="overline">CODING EVALUATION SCORE</Typography>
                      </Box>
                      <Box width="50%">
                        <ReactRadialChart
                          height={230}
                          series={[
                            Number(candidateInterviewData?.coding_evaluation_cand) * 10 || 0,
                          ]}
                          size="55%"
                          color={statusColorFinder(candidateInterviewData?.coding_evaluation_cand)}
                        />
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Box>
            </Stack>
            {/* skill score */}
            <Stack>
              <Typography variant="subtitle2">Scores By Skill</Typography>
              <Grid container spacing={1} p={3}>
                {candidateInterviewData?.result_meta ? (
                  Object.entries(JSON.parse(candidateInterviewData?.result_meta)).map(
                    ([skill, value], index) => (
                      <Grid item md={6} xs={12} key={index}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box width="40%">
                            <Typography variant="overline">{skill}</Typography>
                          </Box>
                          <Box width="50%">
                            <ReactRadialChart
                              series={[value * 10 || 0]}
                              fontSize="1.1rem"
                              color={statusColorFinder(value)}
                              height={180}
                              size="60%"
                            />
                          </Box>
                        </Stack>
                      </Grid>
                    )
                  )
                ) : (
                  <EmptyContent filled title="No Skills Found" />
                )}
              </Grid>
            </Stack>

            <Accordion
              expanded={expandAccordion.expandSoftSkill}
              onChange={handleChangeAccordion('expandSoftSkill')}
            >
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography variant="subtitle1">Soft Skills Scores</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack position="relative">
                  {!user && candidateInterviewData?.userType !== 1 && (
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                      position="absolute"
                      sx={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        zIndex: 100,
                      }}
                    >
                      <Button variant="contained" color="success" onClick={handleSignInRec}>
                        Sign In to View
                      </Button>
                      <Typography variant="caption">or</Typography>

                      <Button variant="contained" onClick={handleSignUpRec}>
                        Sign Up to View
                      </Button>
                    </Stack>
                  )}

                  <Grid container spacing={1} p={3}>
                    {candidateInterviewData?.soft_skills_score ? (
                      Object.entries(JSON.parse(candidateInterviewData?.soft_skills_score)).map(
                        ([skill, value], index) => (
                          <Grid
                            key={index}
                            item
                            md={6}
                            xs={12}
                            className={
                              user || candidateInterviewData?.userType === 1 ? '' : 'events'
                            }
                            sx={{ userSelect: 'none' }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box width="40%">
                                <Typography variant="overline">{skill}</Typography>
                              </Box>
                              <Box width="50%">
                                <ReactRadialChart
                                  series={[
                                    user || candidateInterviewData?.userType === 1 ? value * 10 : 0,
                                  ]}
                                  fontSize="1.1rem"
                                  color={statusColorFinder(value)}
                                  height={180}
                                  size="60%"
                                />
                              </Box>
                            </Stack>
                          </Grid>
                        )
                      )
                    ) : (
                      <EmptyContent filled title="No Soft Skills Found" />
                    )}
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Feedback */}
            <Stack spacing={2}>
              <Typography variant="subtitle2">Feedback</Typography>
              <Typography variant="caption">
                {renderText(candidateInterviewData?.iv_analysis, true)}
              </Typography>
            </Stack>
            {/* events */}
            <Stack>
              <Typography variant="subtitle2">Events</Typography>
              <Grid
                container
                spacing={2}
                p={4}
                className={!user && candidateInterviewData?.userType !== 1 ? 'events' : ''}
                sx={{ userSelect: 'none' }}
              >
                {Object.entries(counts).map(([eventType, value], index) => (
                  <Grid item xs={6} key={index}>
                    <Grid container alignItems="center">
                      <Grid item xs={8}>
                        <Typography variant="subtitle2">{eventType}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Stack direction="row" alignItems="center" justifyContent="center">
                          <Typography variant="subtitle2">{value}</Typography>
                          <IconButton disabled>
                            <Iconify icon="material-symbols:info" />
                          </IconButton>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Stack>
            {!user && candidateInterviewData?.userType !== 1 && (
              <Stack direction="row" justifyContent="center" spacing={2} alignItems="center">
                <Button variant="contained" color="success" onClick={handleSignInRec}>
                  Sign In to View
                </Button>
                <Typography variant="caption">or</Typography>

                <Button variant="contained" onClick={handleSignUpRec}>
                  Sign Up to View
                </Button>
              </Stack>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
      {/* coding questions  */}
      {candidateInterviewData.coding_questions.length > 0 && (
        <Accordion borderTop="1px solid #D6E6F2" borderBottom="1px solid #D6E6F2" py={2}>
          <AccordionSummary
            expandIcon={<Icon icon="solar:alt-arrow-down-outline" />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="subtitle1">Coding Evaluation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box width="50%">
                <Typography variant="body1" fontSize="15px" fontWeight={600}>
                  Questions
                </Typography>
              </Box>
              <Box width="50%">
                <Typography variant="body1" fontSize="15px" fontWeight={600}>
                  Comments
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mt: 2 }} />
            {candidateInterviewData.coding_questions.map((ques, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                borderBottom="0.5px solid rgba(145, 158, 171, 0.2)"
              >
                <Box width="50%" my={2}>
                  <Typography variant="body1" fontSize="15px" sx={{ color: '#757575' }}>
                    {ques.question}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={Number(ques?.score) * 10}
                      color="primary"
                      style={{
                        height: 10,
                        borderRadius: '20px',
                        backgroundColor: '#E3F2FD',
                        width: '80%',
                      }}
                    />
                    <Typography {...styles}>{`${ques?.score}/10`}</Typography>
                  </Box>
                </Box>
                <Box width="50%" my={2}>
                  {!ques.comments ? (
                    <Typography variant="body1" fontSize="15px" color="error" align="center">
                      Not Available
                    </Typography>
                  ) : (
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                      <Typography
                        variant="body1"
                        fontSize="15px"
                        align="justify"
                        sx={{ color: '#757575' }}
                      >
                        {ques.comments}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          handleCodingResponseOpen(ques);
                        }}
                      >
                        <Icon icon="solar:eye-bold-duotone" color="#3aaad8" />
                      </IconButton>
                    </Stack>
                  )}
                </Box>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
      {/* media */}
      <Accordion
        expanded={expandAccordion.expandMedia}
        onChange={handleChangeAccordion('expandMedia')}
      >
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Media</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CandidateMediaView handleSignInRec={handleSignInRec} handleSignUpRec={handleSignUpRec} />
        </AccordionDetails>
      </Accordion>

      {openCodingResponse.value && codingData && (
        <ViewCodingResponse
          openCodingResponse={openCodingResponse}
          codingData={codingData}
          setCodingData={setCodingData}
        />
      )}
    </>
  );
};
