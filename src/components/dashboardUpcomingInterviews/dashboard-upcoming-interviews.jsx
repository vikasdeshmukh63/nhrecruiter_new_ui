// next js imports
import Link from 'next/link';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
// project imports
import { useDispatch, useSelector } from 'react-redux';

// mui imports
import { Grid, Button, IconButton, Typography, Stack } from '@mui/material';

import { getAllinterviewsList } from 'src/redux/slices/interviews';

// ! COMPONENT
const DashboardUpcomingInterviews = ({ findColor }) => {
  // using useRouter and useDispatch
  const router = useRouter();
  const dispatch = useDispatch();

  // extracting data from redux store
  const { interviews } = useSelector((state) => state.interview);

  // to fetch initial data
  useEffect(() => {
    dispatch(getAllinterviewsList(5));
  }, [dispatch]);

  // function to navigate to interviews
  const handleNavigateToInterviews = () => {
    router.push('/application/interviews/list');
  };

  return (
    <Grid item lg={12}>
      {/* title  */}
      <Typography variant="h5">Upcoming Interviews</Typography>
      {/* content  */}
      <Grid container spacing={3}>
        {interviews?.slice(0, 3)?.map((item, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Stack
              sx={{
                border: '1px solid #F5F5F5',
                padding: 1,
                borderRadius: 1,
                alignItems: 'flex-start',
                cursor: 'pointer',
              }}
              onClick={handleNavigateToInterviews}
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
                  {item?._candid?.name}
                </Typography>
              </Button>
              <Typography variant="caption" sx={{ fontWeight: 500, ml: 6 }}>
                {item?._jpid?.title || item?._cand_sche_id?._jobtitleid?.name}
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
              href="/application/interviews/list"
              variant="caption"
              color="primary"
              sx={{ fontWeight: 500 }}
            >
              More Interviews
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardUpcomingInterviews;
