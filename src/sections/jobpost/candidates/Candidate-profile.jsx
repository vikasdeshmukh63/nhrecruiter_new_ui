import { useDispatch, useSelector } from 'react-redux';

import { Button, Grid, Typography } from '@mui/material';

import { DateFormat } from 'src/utils/helperFunctions';
import { useEffect } from 'react';
import { fetchLanguages } from 'src/redux/slices/general';
import { Icon } from '@iconify/react';

// styles fro the default styles
const styles = {
  style: {
    fontSize: '14px',
  },
  varient: 'h6',
  fontWeight: 600,
};

// ! component
const CandidateProfile = ({ profileData, canDownload }) => {
  // using useDispatch
  const dispatch = useDispatch();

  // extracting data from redux store
  const { individualJobPostData } = useSelector((state) => state.jobpost);
  const { languages } = useSelector((state) => state.general);

  // function to find the language
  const findLanguage = (value) => languages.find((lang) => lang.id === value)?.name;

  // function to generate readable date
  function generateReadableDate(date) {
    if (date) {
      return DateFormat(date, 'd MMM yyyy, h:mm a');
    }
    return null;
  }

  const handleDownload = () => {
    const url = `https://nhcandidatepics.s3.ap-south-1.amazonaws.com/${profileData?.file_resume}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = profileData?.file_resume;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (languages.length === 0) {
      dispatch(fetchLanguages());
    }
  }, [dispatch, languages.length]);

  return (
    <Grid container sx={{ border: '1px solid #D6E6F2', borderRadius: 1, width: 500 }}>
      {/* job post  */}
      <Grid item xs={6} sx={{ px: 2, pt: 2 }}>
        <Typography {...styles}>Job Post</Typography>
      </Grid>
      <Grid item xs={6} sx={{ px: 2, pt: 2 }}>
        <Typography variant="caption">
          {individualJobPostData?.title ? individualJobPostData?.title : 'Not Available'}
        </Typography>
      </Grid>
      {/* full name */}
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography {...styles}>Full Name</Typography>
      </Grid>
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography variant="caption">
          {profileData?.name ? profileData?.name : 'Not Available'}
        </Typography>
      </Grid>
      {/* email */}
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography {...styles}>Email</Typography>
      </Grid>
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography variant="caption">
          {profileData?.email ? profileData?.email : 'Not Available'}
        </Typography>
      </Grid>
      {/* phone */}
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography {...styles}>Phone</Typography>
      </Grid>
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography variant="caption">
          {profileData?.mobile_no
            ? `${profileData?.mobile_code} ${profileData?.mobile_no}`
            : 'Not Available'}
        </Typography>
      </Grid>
      {/* create on */}
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography {...styles}>Created On</Typography>
      </Grid>
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography variant="caption">
          {profileData?.createdAt ? generateReadableDate(profileData?.createdAt) : 'Not Available'}
        </Typography>
      </Grid>
      {/* language */}
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography {...styles}>Language</Typography>
      </Grid>
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography variant="caption">
          {findLanguage(profileData?.lang_id)
            ? findLanguage(profileData?.lang_id)
            : 'Not Available'}
        </Typography>
      </Grid>
      {/* verification id */}
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography {...styles}>Verification Id</Typography>
      </Grid>
      <Grid item xs={6} sx={{ px: 2, py: 1 }}>
        <Typography variant="caption">
          {profileData?.uid1_no ? profileData?.uid1_no : 'Not Available'}
        </Typography>
      </Grid>
      {/* status */}
      <Grid item xs={6} sx={{ px: 2, pb: 2 }}>
        <Typography {...styles}>Status</Typography>
      </Grid>
      <Grid item xs={6} sx={{ px: 2, pb: 2 }}>
        <Typography variant="caption">
          {profileData?.IsActive === 1 ? 'Active' : 'In-Active'}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ px: 2, pb: 2 }}>
        {canDownload && (
          <Button
            onClick={handleDownload}
            variant="contained"
            fullWidth
            startIcon={<Icon icon="line-md:download-loop" />}
          >
            Download Resume
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default CandidateProfile;
