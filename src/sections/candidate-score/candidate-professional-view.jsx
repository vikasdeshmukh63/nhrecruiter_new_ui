import { toast } from 'sonner';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { getCandidateResume } from 'src/redux/slices/candidate';

import EmptyContent from 'src/components/empty-content/empty-content';

import { useAuthContext } from 'src/auth/hooks';

function renderText(data, fallBackText) {
  if (data !== null && data !== undefined) {
    return data;
  }
  return fallBackText ? 'Not Available' : '';
}

export const CandidateProfessionalView = () => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const isSubmitted = useBoolean();
  const { candidateInterviewData, loadingScore, error, candidateResume } = useSelector(
    (state) => state.candidate
  );

  // click handler for download resume
  const hadleDownloadCV = async () => {
    await dispatch(
      getCandidateResume(
        { filename: candidateInterviewData?.CV },
        {
          userType: candidateInterviewData?.userType,
        }
      )
    );
    isSubmitted.onTrue();
  };

  // function for downloading resume
  const downloadFile = async (URL) => {
    try {
      const anchorEle = document.createElement('a');
      anchorEle.href = URL;
      anchorEle.download = 'resume.pdf';
      document.body.appendChild(anchorEle);
      anchorEle.click();
      document.body.removeChild(anchorEle);
      toast.success('CV Downloding...');
    } catch (err) {
      toast.error('Unable to Download CV');
      isSubmitted.onFalse();
    }
  };

  // error handling
  useEffect(() => {
    if (isSubmitted.value && error) {
      toast.error('Unable to Download CV');
      isSubmitted.onFalse();
    }
    if (isSubmitted.value && !error) {
      downloadFile(candidateResume);
      isSubmitted.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitted]);

  if (!candidateInterviewData && !loadingScore) {
    return <EmptyContent filled title="Your Link Is Expired" />;
  }
  return (
    <Stack spacing={2}>
      <Card sx={{ p: 2 }}>
        <Stack spacing={2} sx={{ userSelect: 'none' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1">Personal</Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="caption">Full Name</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="subtitle2">
                {renderText(candidateInterviewData?.CAND_Name, true)}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="caption">Email</Typography>
            </Grid>
            <Grid
              item
              xs={9}
              className={!user && candidateInterviewData?.userType !== 1 ? 'events' : ''}
            >
              <Typography variant="subtitle2">
                {renderText(candidateInterviewData?.email, true)}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption">Mobile No</Typography>
            </Grid>
            <Grid
              item
              xs={9}
              className={!user && candidateInterviewData?.userType !== 1 ? 'events' : ''}
            >
              <Typography variant="subtitle2">{`${renderText(
                candidateInterviewData?.mobile_code
              )} ${renderText(candidateInterviewData?.mobile_no, true)}`}</Typography>
            </Grid>
          </Grid>
        </Stack>
      </Card>
      <Card sx={{ p: 2 }}>
        <Stack spacing={2} sx={{ userSelect: 'none' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1">Professional</Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="caption">Current Job Role</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="subtitle2">
                {`${renderText(candidateInterviewData?.Job_Title_Cand)} ${renderText(
                  candidateInterviewData?.title
                )}`}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption">Resume/CV</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography
                onClick={hadleDownloadCV}
                variant="subtitle2"
                sx={{
                  color: '#00A76F',
                  textDecoration:
                    user || candidateInterviewData?.userType === 1 ? 'underline' : 'none',
                  cursor: 'pointer',
                  pointerEvents: user || candidateInterviewData?.userType === 1 ? 'auto' : 'none',
                }}
              >
                {renderText(candidateInterviewData?.CV, true)}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
};
