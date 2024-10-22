'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Stack, MenuItem, ButtonBase, CardHeader } from '@mui/material';

import { graphDataExtractor } from 'src/utils/helperFunctions';

import { fetchMasters } from 'src/redux/slices/masters';
import { DashboardContent } from 'src/layouts/dashboard';
import { fetchOrganizationList } from 'src/redux/slices/organization';
import {
  setJobPosts,
  setDashboardFilter,
  setIndividualJobPostData,
} from 'src/redux/slices/jobposts';
import {
  fetchCountries,
  fetchLanguages,
  fetchPlatformConstantsIfNeeded,
} from 'src/redux/slices/general';
import {
  setGraphData,
  setTimeDuration,
  getDashboardData,
  getDashboardCounts,
} from 'src/redux/slices/dashboard';

import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import DashboardNotification from 'src/components/dashboardNotification/dashboard-notification';
import DashboardRecentJobPost from 'src/components/dashboardRecentJobPost/dashboard-recent-jobpost';
import DashboardUpcomingInterviews from 'src/components/dashboardUpcomingInterviews/dashboard-upcoming-interviews';

import { useAuthContext } from 'src/auth/hooks';

import DashboardBarChart from '../dashboard-bar-chart';
import DashboardPieChart from '../dashboard-pie-chart';
import DashboardWidgetSummary from '../dashboard-widget-summary';

const EarningIcon = '/assets/icons/earning.svg';

// ----------------------------------------------------------------------

const TIME_DURATION = [
  {
    value: 1,
    duration: 'This Week',
  },
  {
    value: 2,
    duration: 'This Month',
  },
  {
    value: 3,
    duration: 'This Year',
  },
];
// function to change the color of icons according to there order
const findColor = (value) => {
  if (value === 0) {
    return 'secondary';
  }
  if (value === 1) {
    return 'primary';
  }
  if (value === 2) {
    return 'warning';
  }
  if (value === 3) {
    return 'success';
  }
  if (value === 4) {
    return 'error';
  }
  return 'default';
};
// function to calculate start and end dates based on selected time duration
const calculateDateRange = (duration) => {
  const now = new Date();
  let startDate;
  let endDate;
  switch (duration) {
    case 1: // Week
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
      break;
    case 2: // Month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 3: // Year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    default:
      startDate = new Date();
      endDate = new Date();
  }
  return { startDate, endDate };
};
// dummy data
const stackedChartData = [
  {
    name: 'Attended',
    data: [35, 125, 35, 35, 35, 80],
  },
  {
    name: 'Completed',
    data: [35, 15, 15, 35, 65, 40],
  },
  {
    name: 'Pending',
    data: [35, 145, 35, 35, 20, 105],
  },
  {
    name: 'No Show',
    data: [0, 0, 75, 0, 0, 115],
  },
];

export default function DashboardView() {
  // custom hooks
  const settings = useSettingsContext();
  const dispatch = useDispatch();
  const popover = usePopover();

  // get user
  const { user } = useAuthContext();

  // to extract data from redux
  const { graphData, cardData, error, timeDuration } = useSelector((state) => state.dashboard);
  const { IV_Status, JP_Status, languages, countries } = useSelector((state) => state.general);
  const { organizations } = useSelector((state) => state.organization);
  const { proficiencies } = useSelector((state) => state.masters);

  const platformConstants = useMemo(
    () => ({
      IV_Status,
      JP_Status,
    }),
    [IV_Status, JP_Status]
  );

  const [extractedData, setExtractedData] = useState(
    graphDataExtractor(graphData, platformConstants, timeDuration)
  );
  const foundTimeDuration = TIME_DURATION.find((time) => time.value === timeDuration).duration;

  // setting extracted data
  useEffect(() => {
    dispatch(setGraphData(null));
  }, [dispatch]);

  useEffect(() => {
    if (graphData && platformConstants && timeDuration) {
      setExtractedData(graphDataExtractor(graphData, platformConstants, timeDuration));
    }
  }, [timeDuration, graphData, platformConstants]);

  // fetching initial values and store it in redux
  useEffect(() => {
    if (timeDuration) {
      const { startDate, endDate } = calculateDateRange(timeDuration);
      dispatch(getDashboardCounts(startDate, endDate, user?.org_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, timeDuration]);

  // handlig the menu items
  const handleDuration = async (value) => {
    popover.onClose();
    dispatch(setTimeDuration(value));
    dispatch(setGraphData(null));
  };

  // getting initial data and on time duration change
  useEffect(() => {
    dispatch(getDashboardData(timeDuration));
  }, [dispatch, timeDuration]);

  // fetching initial values and store it in redux
  useEffect(() => {
    dispatch(fetchPlatformConstantsIfNeeded('IV_Status'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IV_Status]);

  useEffect(() => {
    if (proficiencies.length === 0) {
      dispatch(fetchMasters());
    }
    if (organizations.length === 0) {
      dispatch(fetchOrganizationList(0, 10));
    }
  }, [dispatch, organizations.length, proficiencies]);

  // on click of active job it should need to be move particular job post based on status
  const handleClickActiveJob = () => {
    dispatch(setJobPosts({ data: [] }));
    dispatch(setIndividualJobPostData(null));
    dispatch(
      setDashboardFilter({
        activeJobStatus: 2,
      })
    );
  };

  // on click of interview completed it should need to be move particular job post based on status

  const handleClickInterviewCompleted = () => {
    dispatch(
      setDashboardFilter({
        interviewsCompletedStatus: 'completed',
      })
    );
  };

  useEffect(() => {
    if (languages.length === 0) {
      dispatch(fetchLanguages());
    }
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [countries.length, dispatch, languages.length]);

  console.log(extractedData?.extractedJobPostData);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
          <Typography variant="h4">Welcome back {user?.firstname}</Typography>
          {/* select menu */}
          <CardHeader
            sx={{
              p: 0,
            }}
            // title={title}
            // subheader={subheader}
            action={
              <ButtonBase
                onClick={popover.onOpen}
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {foundTimeDuration}

                <Iconify
                  width={16}
                  icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
            }
          />
          {/* opening of menu items */}
          <CustomPopover
            open={popover.open}
            anchorEl={popover.anchorEl}
            onClose={popover.onClose}
            sx={{ width: 140 }}
          >
            {TIME_DURATION.map((time) => (
              <MenuItem
                key={time.duration}
                selected={time.value === timeDuration}
                onClick={() => handleDuration(time.value)}
              >
                {time.duration}
              </MenuItem>
            ))}
          </CustomPopover>
        </Stack>
        {/* total jobs */}
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <Link href="/application/jobposts/view/" style={{ textDecoration: 'none' }}>
              <DashboardWidgetSummary
                title="Total Jobs"
                value={cardData?.Total_Jobs ? Number(cardData?.Total_Jobs) : 0}
                icon={<img alt="icon" src={EarningIcon} width={50} />}
              />
            </Link>
          </Grid>
          {/* active jobs */}
          <Grid xs={12} sm={6} md={3}>
            {/* <Button sx={{ width: '100%' }} onClick={handleClick}> */}
            <Link
              onClick={handleClickActiveJob}
              href="/application/jobposts/view/"
              style={{ textDecoration: 'none' }}
            >
              <DashboardWidgetSummary
                title="Active Jobs"
                value={cardData?.Active_Jobs ? Number(cardData?.Active_Jobs) : 0}
                icon={<img alt="icon" src={EarningIcon} width={50} />}
              />
            </Link>
            {/* </Button> */}
          </Grid>
          {/* total interviews */}
          <Grid xs={12} sm={6} md={3}>
            <Link href="/application/interviews/list" style={{ textDecoration: 'none' }}>
              <DashboardWidgetSummary
                title="Total Interviews"
                value={cardData?.Total_Interviews ? Number(cardData?.Total_Interviews) : 0}
                color="secondary"
                icon={<Icon fontSize="50px" icon="material-symbols:local-mall-outline" />}
              />
            </Link>
            {/* Completed_Interviews */}
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Link
              onClick={handleClickInterviewCompleted}
              href="/application/interviews/list"
              style={{ textDecoration: 'none' }}
            >
              <DashboardWidgetSummary
                title="Interviews Completed"
                value={cardData?.Completed_Interviews ? Number(cardData?.Completed_Interviews) : 0}
                color="secondary"
                icon={<Icon fontSize="50px" icon="material-symbols:local-mall-outline" />}
              />
            </Link>
          </Grid>
          <Grid xs={12} md={6} lg={8}>
            {/* interview insights data */}
            <DashboardBarChart
              graphData={graphData}
              stacked
              colors={[
                '#673AB7',
                '#90CAF9',
                '#D84315',
                '#2196F3',
                '#E58061',
                '#FFC107',
                '#00C853',
                '#EDE7F6',
                '#EB9F87',
              ]}
              series={extractedData?.extractedInterviewData?.series}
              extractedData={extractedData?.extractedInterviewData?.labels}
              title="Interview Insights"
            />
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <Stack
              direction={{ lg: 'column', md: 'column', xs: 'row' }}
              justifyContent="space-between"
            >
              {/* job by status */}
              <DashboardPieChart
                chart={extractedData?.extractedJobPostData}
                colors={[
                  '#673AB7',
                  '#2196F3',
                  '#FFC107',
                  '#EDE7F6',
                  '#D84315',
                  '#E58061',
                  '#90CAF9',
                  '#00C853',
                  '#EB9F87',
                ]}
                title="Jobs by Status"
              />
              {/* recent notifications */}
              <DashboardNotification findColor={findColor} />
            </Stack>
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            {/* interview scores */}
            <DashboardBarChart
              graphData={graphData}
              series={extractedData?.extractedInterviewScores?.series}
              extractedData={extractedData?.extractedInterviewScores?.labels}
              stacked={false}
              colors={[
                '#2196F3',
                '#673AB7',
                '#FFC107',
                '#90CAF9',
                '#00C853',
                '#EDE7F6',
                '#D84315',
                '#E58061',
                '#EB9F87',
              ]}
              title="Interview Scores"
            />
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            {/* Fraud Detection Report */}
            <DashboardBarChart
              graphData={graphData}
              series={stackedChartData}
              extractedData={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
              stacked
              colors={['#EDE7F6', '#2196F3', '#673AB7', '#90CAF9']}
              title="Fraud Detection Report"
            />
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            {/* recent job post */}
            <DashboardRecentJobPost findColor={findColor} />
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            {/* Upcoming interview */}
            <DashboardUpcomingInterviews findColor={findColor} />
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}
