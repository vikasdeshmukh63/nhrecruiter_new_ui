'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import { Box, Grid } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { setIndividualJobPostData, setJobPostDataToEdit } from 'src/redux/slices/jobposts';

import AppWidget from '../app-widget';

const CreateJobPost = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRouting = () => {
    router.push('/application/jobposts/create/newjob/');
    dispatch(setJobPostDataToEdit({}));
    dispatch(setIndividualJobPostData(null));
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          width: '100%',
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4} md={12}>
            <AppWidget
              topText="Sync from external sources"
              title="Import from ATS"
              bottomText="Now you can connect to your favorite ATS"
              color="info"
              icon="icon-park-twotone:robot-one"
              sx={{ cursor: 'pointer' }}
            />
          </Grid>
          <Grid item xs={12} lg={4} md={12}>
            <AppWidget
              topText="Start a new post"
              title="Create New Post"
              bottomText="Create New Post"
              icon="mdi:post-it-note-edit"
              color="secondary"
              onClick={handleRouting}
              sx={{ cursor: 'pointer' }}
            />
          </Grid>
          <Grid item xs={12} lg={4} md={12}>
            <AppWidget
              topText="Sync from external sources"
              title="Import from ATS"
              bottomText="Now you can connect to your favorite ATS"
              icon="icon-park-twotone:excel"
              color="primary"
              sx={{ cursor: 'pointer' }}
            />
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
};

export default CreateJobPost;
