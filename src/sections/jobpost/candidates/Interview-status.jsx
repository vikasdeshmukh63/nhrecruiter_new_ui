import JSPDF from 'jspdf';
import { Icon } from '@iconify/react';
import html2canvas from 'html2canvas';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// mui imports
import {
  Grid,
  Divider,
  Accordion,
  IconButton,
  Typography,
  LinearProgress,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DateFormat } from 'src/utils/helperFunctions';

import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content/empty-content';

import ViewCodingResponse from 'src/sections/candidate-score/view-coding-response';
import { ShareInterviewLinkModal } from 'src/sections/interviews/share-interview-link-modal';

import InterviewStatusSkeleton from './skeleton';

// interview filters
const interviewfilters = [
  { id: 1, label: 'Scheduled' },
  { id: 2, label: 'Completed' },
  { id: 3, label: 'Evaluation Pending' },
  { id: 4, label: 'Cancelled' },
  { id: 5, label: 'ReScheduled' },
];

// schedule filters
const schedulefilters = [
  { id: 1, label: 'Sent Request' },
  { id: 2, label: 'Cancelled Request' },
  { id: 3, label: 'Accepted' },
  { id: 4, label: 'Resend' },
  { id: 5, label: 'Interview Scheduled' },
];

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
  if (value >= 0 && value < 40) {
    return 'error';
  }
  if (value >= 40 && value < 80) {
    return 'warning';
  }
  if (value >= 80 && value <= 100) {
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

// default values
const defaultValuesForAccordion = {
  coding_evalution: false,
  soft_skill_score: false,
  evaluation_feedback: false,
};

const expandAllAccordion = {
  coding_evalution: true,
  soft_skill_score: true,
  evaluation_feedback: true,
};
// ! component
const InterviewStatus = ({ profileData, type }) => {
  const candId = type === 'default' ? profileData?.CAND_Id : profileData?.id_str;

  // states
  const [skills, setSkills] = useState(null);
  const [softSkills, setSoftSkills] = useState(null);
  const [codingData, setCodingData] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(defaultValuesForAccordion);

  const openCodingResponse = useBoolean(false);
  const openModal = useBoolean();

  // snackbar from notistack
  const { enqueueSnackbar } = useSnackbar();

  // to extract data from redux
  const { individualJobPostData } = useSelector((state) => state.jobpost);

  // extracting data from redux store
  const { interviewStatus, InterviewEventData, loading } = useSelector((state) => state.candidate);

  // function to find status
  const statusFinder = (data, value) => data.find((item) => item.id === value)?.label;

  // function to generate readable date
  function generateReadableDate(date) {
    if (date) {
      return DateFormat(date, 'd MMM yyyy, h:mm a');
    }
    return null;
  }
  // function to convert data as code will accept
  const convertData = (Interview_Result, soft_skills_score) => {
    if (Interview_Result || soft_skills_score) {
      const parsedDataSkill = JSON.parse(Interview_Result);
      const parsedDataSoftSkill = JSON.parse(soft_skills_score);
      setSkills(parsedDataSkill);
      setSoftSkills(parsedDataSoftSkill);
    }
  };

  // to parse the data
  useEffect(() => {
    convertData(interviewStatus?.Interview_Result, interviewStatus?.soft_skills_score);
  }, [interviewStatus]);

  // for events filter

  const filteredEvents = InterviewEventData?.filter((event) => [5, 6, 8].includes(event.type));
  const counts = {
    'Disable full screen': 0,
    'Video Obstruction': 0,
    'Tab Changes': 0,
  };

  filteredEvents?.forEach((event) => {
    if (event.type === 5 && event.details === 'DISABLED') {
      counts['Disable full screen'] += 1;
    } else if (event.type === 6 && event.details === 'DISABLED') {
      counts['Video Obstruction'] += 1;
    } else if (event.type === 8) {
      counts['Tab Changes'] += 1;
    }
  });

  const handleCodingResponseOpen = async (solution) => {
    await setCodingData(solution);
    openCodingResponse.onTrue();
  };

  // function to save pdf
  const saveAsPDF = async () => {
    try {
      enqueueSnackbar('Downloading');

      const capture = document.querySelector('.interview-status');

      const canvas = await html2canvas(capture, {
        scale: 2,
        onclone: (document) => {
          const printElement = document.getElementById('print');
          const shareBtn = document.getElementById('share');
          if (printElement) {
            printElement.style.visibility = 'hidden';
            shareBtn.style.visibility = 'hidden';
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');

      const doc = new JSPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate the ratio to fit image within the page size while maintaining aspect ratio
      const widthRatio = pageWidth / imgWidth;
      const heightRatio = pageHeight / imgHeight;
      // Use the smaller ratio to contain image
      const ratio = Math.min(widthRatio, heightRatio);

      const width = imgWidth * ratio;
      const height = imgHeight * ratio;

      // Calculate the offset to center the image if it doesn’t cover the entire page
      const xOffset = (pageWidth - width) / 2;
      const yOffset = (pageHeight - height) / 2;

      doc.addImage(imgData, 'PNG', xOffset, yOffset, width, height);

      // console.log(profileData);

      doc.save(
        `${profileData.name.replaceAll(' ', '_')}_${individualJobPostData.title.replaceAll(
          ' ',
          '_'
        )}.pdf`
      );
    } catch (error) {
      enqueueSnackbar('Download Failed...', { variant: 'error' });
      console.error('Error occurred while generating PDF:', error);
    }
  };

  // console.log(individualJobPostData);

  // downloading interview status
  const downloadPDF = async () => {
    setIsAccordionOpen(expandAllAccordion);
    await new Promise((res) => setTimeout(res, 0));
    saveAsPDF();
  };

  const handleShare = async () => {
    openModal.onTrue();
  };

  const handleChange = (panel) => (event, isExpand) => {
    // setIsAccordionOpen((prev) => {
    //   const object = prev;
    //   const newObject = {};
    //   Object.keys(object).forEach((ele) => {
    //     newObject[ele] = false;
    //   });
    //   return {
    //     ...newObject,
    //     [panel]: isExpand,
    //   };
    // });

    setIsAccordionOpen((prev) => ({
      ...prev,
      [panel]: isExpand,
    }));
  };

  if (interviewStatus && !loading) {
    return (
      <Stack
        width={700}
        className="interview-status"
        container
        pt={2}
        sx={{ border: '1px solid #D6E6F2', borderRadius: 1 }}
      >
        <Stack direction="row" gap={1} position="relative">
          {openModal.value && (
            <ShareInterviewLinkModal
              openModal={openModal}
              ext_share_links={interviewStatus.ext_share_links}
              candId={candId}
              // table={table}
              id_str={interviewStatus.Inerview_Id}
            />
          )}
          <Box position="absolute" right={0} id="share">
            <IconButton
              color={
                interviewStatus.ext_share_links?.length &&
                !interviewStatus.ext_share_links[0]?.isDeleted &&
                interviewStatus.ext_share_links[0]?.isActive
                  ? 'success'
                  : 'secondary'
              }
              sx={{ visibility: interviewStatus.Interview_Status === 2 ? 'visible' : 'hidden' }}
              onClick={handleShare}
            >
              <Icon icon="material-symbols:share" />
            </IconButton>
          </Box>

          <Box position="absolute" right={50} id="print" onClick={downloadPDF}>
            <IconButton color="primary" disableRipple>
              <Icon icon="material-symbols:file-download" />
            </IconButton>
          </Box>

          <Box width="50%" display="flex" flexDirection="column" gap={2}>
            <Box px={2}>
              <Typography {...styles}>Interview</Typography>
            </Box>
            <Box>
              <Divider sx={{ borderBottom: '1px solid #D6E6F2' }} />
            </Box>
            <Box px={2} display="flex" flexDirection="column" gap={3}>
              <Box display="flex" justifyContent="space-between">
                <Box width="50%">
                  <Typography {...styles}>Status</Typography>
                </Box>
                <Box width="50%">
                  {interviewStatus?.Interview_Status ? (
                    <Typography {...styles} color="#888888" fontWeight={400}>
                      {statusFinder(interviewfilters, interviewStatus?.Interview_Status)}
                    </Typography>
                  ) : (
                    <Typography {...styles} color=" error" fontWeight={400}>
                      Not Available
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box mb={2} display="flex" justifyContent="space-between">
                <Box width="50%">
                  <Typography {...styles}>Start & End</Typography>
                </Box>
                <Box width="50%" display="flex" justifyContent="space-between">
                  {interviewStatus?.Interview_Date ? (
                    <Typography {...styles} color="#888888" fontWeight={400}>
                      {generateReadableDate(interviewStatus?.Interview_Date)}
                    </Typography>
                  ) : (
                    <Typography {...styles} color=" error" fontWeight={400}>
                      Not Available
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box width="50%" display="flex" flexDirection="column" gap={2}>
            <Box>
              <Typography {...styles}>Schedule</Typography>
            </Box>
            <Box>
              <Divider sx={{ borderBottom: '1px solid #D6E6F2' }} />
            </Box>
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" justifyContent="space-between">
                <Box width="50%">
                  <Typography {...styles}>Status</Typography>
                </Box>
                <Box width="50%">
                  {interviewStatus?.Schedule_Status ? (
                    <Typography {...styles} color="#888888" fontWeight={400}>
                      {statusFinder(schedulefilters, interviewStatus?.Schedule_Status)}
                    </Typography>
                  ) : (
                    <Typography {...styles} color=" error" fontWeight={400}>
                      Not Available
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Box width="50%">
                  <Typography {...styles}>Last Updated</Typography>
                </Box>
                <Box width="50%" display="flex" justifyContent="space-between">
                  {interviewStatus?.Interview_UpdatedAt ? (
                    <Typography {...styles} color="#888888" fontWeight={400}>
                      {generateReadableDate(interviewStatus?.Interview_UpdatedAt)}
                    </Typography>
                  ) : (
                    <Typography {...styles} color=" error" fontWeight={400}>
                      Not Available
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>

        <Box borderTop="1px solid #D6E6F2" borderBottom="1px solid #D6E6F2" py={2}>
          <Box px={2}>
            <Typography {...styles}>Evaluation Details</Typography>
          </Box>
        </Box>
        <Stack px={2} direction="row" gap={5} py={2}>
          <Box width="50%">
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}
            >
              <Typography variant="body1" fontSize="15px" sx={{ color: '#757575' }}>
                Total Score
              </Typography>

              {profileData?.final_Score ? (
                <Typography {...styles}>{profileData?.final_Score}</Typography>
              ) : (
                <Typography {...styles} color=" error" fontWeight={400}>
                  Not Available
                </Typography>
              )}
            </Box>
            {!!profileData?.final_Score && (
              <LinearProgress
                variant="determinate"
                value={profileData.final_Score * 10}
                color={statusColorFinder(profileData?.final_Score)}
                style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
              />
            )}
          </Box>
          <Box width="50%">
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}
            >
              <Typography variant="body1" fontSize="15px" sx={{ color: '#757575' }}>
                Job Fit Score
              </Typography>
              {interviewStatus?.job_fit_score ? (
                <Typography {...styles}>{interviewStatus?.job_fit_score}</Typography>
              ) : (
                <Typography {...styles} color=" error" fontWeight={400}>
                  Not Available
                </Typography>
              )}
            </Box>
            {!!interviewStatus?.job_fit_score && (
              <LinearProgress
                variant="determinate"
                value={interviewStatus.job_fit_score * 10}
                color={statusColorFinder(interviewStatus?.job_fit_score)}
                style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
              />
            )}
          </Box>
        </Stack>
        <Stack borderTop="1px solid #D6E6F2" borderBottom="1px solid #D6E6F2" py={2}>
          <Typography px={2} {...styles}>
            Expertise Evaluation
          </Typography>
          {interviewStatus?.Interview_Result ? (
            // if results available
            <Box display="flex" flexWrap="wrap" mb={1}>
              {skills &&
                Object.keys(skills)
                  .map((key) => ({ label: key, value: skills[key] }))
                  .map((skill, index) => (
                    <Box width="50%" sx={{ py: 1, px: 2 }} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 2,
                        }}
                      >
                        <Typography variant="body1" fontSize="15px" sx={{ color: '#757575' }}>
                          {skill?.label}
                        </Typography>
                        <Typography {...styles}>{`${skill?.value}/10`}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={skill.value * 10}
                        color={statusColorFinder(skill.value * 10)}
                        style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
                      />
                    </Box>
                  ))}
            </Box>
          ) : (
            // in results are not available
            <Grid item xs={12} sx={{ p: 2 }}>
              <Typography variant="caption" color="error">
                No Data is Available
              </Typography>
            </Grid>
          )}

          <Typography variant="h6" style={{ fontSize: '12px' }} color="#919191" px={2}>
            * Results will be available once the interviews are concluded and AI analysis has been
            performed
          </Typography>
          {/* coding evaluation  */}
          {interviewStatus.coding_questions.length > 0 && (
            <Accordion
              borderTop="1px solid #D6E6F2"
              borderBottom="1px solid #D6E6F2"
              py={2}
              disableGutters
              expanded={isAccordionOpen.coding_evalution}
              onChange={handleChange('coding_evalution')}
              sx={{
                '& .MuiAccordion-root': {
                  backgroundColor: '#fff', // Change this to your desired color
                },
                '& .MuiAccordionSummary-root': {
                  backgroundColor: '#fff', // Change this to your desired color
                },
                '& .MuiAccordionDetails-root': {
                  backgroundColor: '#fff', // Change this to your desired color
                },
              }}
            >
              <AccordionSummary
                expandIcon={<Icon icon="solar:alt-arrow-down-outline" />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography {...styles}>Coding Evaluation</Typography>
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
                {interviewStatus.coding_questions.map((ques, index) => (
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
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="center"
                          alignItems="center"
                        >
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

          {/* soft skill score */}
          <Accordion
            borderTop="1px solid #D6E6F2"
            borderBottom="1px solid #D6E6F2"
            disableGutters
            py={2}
            expanded={isAccordionOpen.soft_skill_score}
            onChange={handleChange('soft_skill_score')}
            sx={{
              '& .MuiAccordion-root': {
                backgroundColor: '#fff', // Change this to your desired color
              },
              '& .MuiAccordionSummary-root': {
                backgroundColor: '#fff', // Change this to your desired color
              },
              '& .MuiAccordionDetails-root': {
                backgroundColor: '#fff', // Change this to your desired color
              },
            }}
          >
            <AccordionSummary
              expandIcon={<Icon icon="solar:alt-arrow-down-outline" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography {...styles}>Soft Skill Score</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Divider sx={{ mb: 2 }} />
              <Box>
                {interviewStatus?.soft_skills_score ? (
                  // if results available
                  <Box display="flex" flexWrap="wrap" borderBottom="1px solid #D6E6F2">
                    {softSkills &&
                      Object.keys(softSkills)
                        .map((key) => ({ label: key, value: softSkills[key] }))
                        .map((softSkill, index) => (
                          <Box width="50%" sx={{ py: 1, px: 2 }} key={index}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                py: 2,
                              }}
                            >
                              <Typography variant="body1" fontSize="15px" sx={{ color: '#757575' }}>
                                {softSkill?.label}
                              </Typography>
                              <Typography {...styles}>{`${softSkill?.value}/10`}</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={softSkill.value * 10}
                              color={statusColorFinder(softSkill.value * 10)}
                              style={{
                                height: 10,
                                borderRadius: '20px',
                                backgroundColor: '#E3F2FD',
                              }}
                            />
                          </Box>
                        ))}
                  </Box>
                ) : (
                  <Typography variant="caption" color="error">
                    No Data is Available
                  </Typography>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* evaluation Feedback */}
          <Accordion
            borderTop="1px solid #D6E6F2"
            borderBottom="1px solid #D6E6F2"
            disableGutters
            py={2}
            expanded={isAccordionOpen.evaluation_feedback}
            onChange={handleChange('evaluation_feedback')}
            sx={{
              '& .MuiAccordion-root': {
                backgroundColor: '#fff', // Change this to your desired color
              },
              '& .MuiAccordionSummary-root': {
                backgroundColor: '#fff', // Change this to your desired color
              },
              '& .MuiAccordionDetails-root': {
                backgroundColor: '#fff', // Change this to your desired color
              },
            }}
          >
            <AccordionSummary
              expandIcon={<Icon icon="solar:alt-arrow-down-outline" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography {...styles}>Evaluation Feedback</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Divider sx={{ mb: 2 }} />
              <Box>
                {interviewStatus?.iv_analysis ? (
                  <Typography
                    variant="h6"
                    style={{ fontSize: '12px' }}
                    color="#888888"
                    textAlign="justify"
                  >
                    {interviewStatus?.iv_analysis}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="error">
                    No Data is Available
                  </Typography>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Box borderTop="1px solid #D6E6F2">
            <Box py={2} px={2}>
              <Typography {...styles}>Events</Typography>
            </Box>
            <Box
              px={2}
              borderTop="1px solid #D6E6F2"
              borderBottom="1px solid #D6E6F2"
              display="flex"
              flexWrap="wrap"
              py={1}
            >
              {Object.entries(counts)
                ?.map(([eventType, value]) => ({ eventType, value }))
                .map((event, index) => (
                  <Box key={index} width="50%" display="flex" alignItems="center">
                    <Box width="60%">
                      <Typography {...styles}>{event.eventType}</Typography>
                    </Box>
                    <Box
                      width="30%"
                      justifyContent="space-between"
                      display="flex"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        style={{
                          fontSize: '14px',
                        }}
                        color="#888888"
                      >
                        {event.value}
                      </Typography>
                      <IconButton style={{ color: '#683bb7' }}>
                        <Icon icon="material-symbols:info" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
            </Box>
            <Stack px={2} direction="row" gap={5} py={2}>
              <Box width="50%">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ color: '#757575' }}>
                    Plagarism Score
                  </Typography>
                  {interviewStatus?.plag_score ? (
                    <Typography {...styles}>
                      {(interviewStatus.plag_score * 100).toFixed(0)}%
                    </Typography>
                  ) : (
                    <Typography {...styles} color=" error" fontWeight={400}>
                      Not Available
                    </Typography>
                  )}
                </Box>
                {!!interviewStatus?.plag_score && (
                  <LinearProgress
                    variant="determinate"
                    value={interviewStatus.plag_score * 100}
                    color={statusColorFinder(interviewStatus.plag_score * 100)}
                    style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
                  />
                )}
              </Box>
              <Box width="50%">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ color: '#757575' }}>
                    AI Content Score
                  </Typography>
                  {interviewStatus?.ai_plag_score ? (
                    <Typography {...styles}>
                      {(interviewStatus.ai_plag_score * 100).toFixed(0)}%
                    </Typography>
                  ) : (
                    <Typography {...styles} color=" error" fontWeight={400}>
                      Not Available
                    </Typography>
                  )}
                </Box>
                {!!interviewStatus?.ai_plag_score && (
                  <LinearProgress
                    variant="determinate"
                    value={interviewStatus.ai_plag_score * 100}
                    color={statusColorFinder(Number(interviewStatus?.ai_plag_score) * 100)}
                    style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
                  />
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>

        {openCodingResponse.value && codingData && (
          <ViewCodingResponse
            openCodingResponse={openCodingResponse}
            codingData={codingData}
            setCodingData={setCodingData}
          />
        )}
      </Stack>
    );
  }
  if (interviewStatus === null && loading) {
    return <InterviewStatusSkeleton />;
  }
  return (
    <EmptyContent
      filled
      title="No Data"
      sx={{
        py: 35,
      }}
    />
  );
};

export default InterviewStatus;
