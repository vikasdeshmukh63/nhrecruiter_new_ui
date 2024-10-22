// next js imports
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// project imports

// mui imports
import { Grid, Button, IconButton, Typography, Stack } from '@mui/material';
// assets

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

import { fetchAllJobPost } from 'src/redux/slices/jobposts';

// ! COMPONENT
const DashboardRecentJobPost = ({ findColor }) => {
  // using useRouter and useDispatch
  const router = useRouter();
  const dispatch = useDispatch();

  // extracting data from redux store
  const { jobPosts } = useSelector((state) => state.jobpost);
  // function to handle navigate to jobpos t
  const handleNavigateToJobpost = (data) => {
    const jobid = data.Job_Id;
    const query = {
      jobid,
    };
    router.push(`/application/jobposts/view/?${new URLSearchParams(query)}`);
  };

  // to fetch jobpost data initially
  useEffect(() => {
    dispatch(fetchAllJobPost(1, 3));
  }, [dispatch]);

  return (
    <Grid item lg={12}>
      {/* title  */}
      <Typography variant="h5">Recent Job Posts</Typography>
      {/* content  */}
      <Grid container spacing={3}>
        {jobPosts?.slice(0, 3)?.map((item, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Stack
              sx={{
                border: '1px solid #F5F5F5',
                padding: 1,
                borderRadius: 1,
                alignItems: 'flex-start',
                cursor: 'pointer',
              }}
              onClick={() => {
                handleNavigateToJobpost(item);
              }}
            >
              <Button
                variant="text"
                color="inherit"
                size="small"
                startIcon={
                  <IconButton color={findColor(index)}>
                    <Icon icon="ic:twotone-work" />
                  </IconButton>
                }
                sx={{
                  ':hover': { backgroundColor: 'transparent' },
                  '&:active': { backgroundColor: 'transparent' },
                }}
              >
                <Typography color="inherit" sx={{ fontWeight: 500 }}>
                  {item?.title}
                </Typography>
              </Button>
              <Typography variant="caption" sx={{ fontWeight: 500, ml: 6 }}>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: item?.jd.substring(0, 100) }} />
              </Typography>
            </Stack>
          </Grid>
        ))}

        {/* go to button  */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{ display: 'flex', alignItems: 'flex-end', justifyItems: 'flex-end' }}
        >
          <Button
            fullWidth
            variant="text"
            color="inherit"
            size="small"
            disableRipple
            disableFocusRipple
            endIcon={
              <IconButton color="primary">
                <Icon fontSize="12px" icon="ep:arrow-right" />
              </IconButton>
            }
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              '&:hover': { backgroundColor: 'inherit' },
            }}
          >
            <Typography
              component={Link}
              href="/application/jobposts/view/"
              variant="caption"
              color="primary"
              sx={{ fontWeight: 500 }}
            >
              More Job Posts
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardRecentJobPost;
