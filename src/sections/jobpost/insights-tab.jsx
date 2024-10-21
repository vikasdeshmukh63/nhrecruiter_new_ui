import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Grid, Skeleton, Typography, CardContent, Box } from '@mui/material';

import { candidateInsightJobData } from 'src/redux/slices/jobposts';
import { fetchPlatformConstantsIfNeeded } from 'src/redux/slices/general';

import EmptyContent from 'src/components/empty-content/empty-content';

import '../../css/insights.css';

const ReactApexChartPie = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <BarChartSkeleton />,
});

const Piecharts = ({ chartData, title }) => (
  <Box height="100%" display="flex" flexDirection="column">
    <Box>
      <Typography mb={2} variant="subtitle1">
        {title}
      </Typography>
    </Box>
    {chartData && chartData.options && chartData.series && (
      <ReactApexChartPie
        options={chartData.options}
        series={chartData.series}
        type="pie"
        height={300}
        width={500}
      />
    )}
  </Box>
);

const ReactApexChartDataLabel = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <BarChartSkeleton />,
});

export const DataLabelChart = ({ barChartData, title }) => (
  <Box height="100%" display="flex" flexDirection="column">
    <Box>
      <Typography mb={2} variant="subtitle1">
        {title}
      </Typography>
    </Box>
    {barChartData && barChartData.options && barChartData.series && (
      <ReactApexChartDataLabel
        options={barChartData.options}
        series={barChartData.series}
        type="bar"
        height={300}
        width={500}
      />
    )}
  </Box>
);

export const BarChartSkeleton = () => (
  <Card>
    <CardContent>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between" spacing={3}>
            <Grid item xs zeroMinWidth>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Skeleton variant="text" />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={20} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Skeleton variant="rectangular" height={50} width={80} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={530} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// options for pie chart
const pieChartOptions = {
  options: {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: [
      'Scheduled',
      'Completed',
      'Evaluation Pending',
      'Cancelled',
      'ReScheduled',
      'Pending',
      'Pending',
      'Pending',
      'Coding Evaluation Pending',
    ],
    colors: [
      '#87CEEB',
      '#90EE90',
      '#FFFF99',
      '#D3D3D3',
      '#FFA500',
      '#FFDAB9',
      '#FFDAB9',
      '#FFDAB9',
      '#E0FFFF',
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  },
};
// options for bar chart
const barChartOptions = {
  options: {
    chart: {
      height: 350,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${val}%`;
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    xaxis: {
      categories: ['0-4', '5-7', '8-10'],
      position: 'bottom',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
  },
};
const InsightsTab = () => {
  const dispatch = useDispatch();

  const { IV_Status } = useSelector((state) => state.general);
  const { candidateInsightData } = useSelector((state) => state.jobpost);

  const [chartData, setChartData] = useState(pieChartOptions);
  const [barChartData, setBarChartData] = useState(barChartOptions);
  const { individualJobPostData } = useSelector((state) => state.jobpost);

  // function for extracting pie chart series
  function extractedData() {
    const series = [];
    if (IV_Status && candidateInsightData) {
      candidateInsightData?.interviewsByStatusData?.forEach((item) => {
        Object.keys(IV_Status).forEach((key) => {
          if (IV_Status[key] === item.status) {
            series.push(item?.interview_count);
          }
        });
      });
    }
    return series;
  }

  // to get candidatesInsightJobdata
  useEffect(() => {
    if (individualJobPostData?.Job_Id) {
      dispatch(fetchPlatformConstantsIfNeeded('IV_Status'));
      dispatch(candidateInsightJobData(individualJobPostData?.Job_Id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [individualJobPostData?.Job_Id]);

  useEffect(() => {
    if (candidateInsightData && IV_Status) {
      setChartData((prev) => ({
        ...prev,
        series: extractedData(),
      }));
      setBarChartData((prev) => ({
        ...prev,
        series: [
          {
            name: 'Candidates Score Range',
            data: [
              Number(candidateInsightData?.candidatesscoresData[0]?.score_0_4) ?? 0,
              Number(candidateInsightData?.candidatesscoresData[0]?.score_5_7) ?? 0,
              Number(candidateInsightData?.candidatesscoresData[0]?.score_8_10) ?? 0,
            ],
          },
        ],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateInsightData]);
  return (
    <Grid container spacing={3}>
      <Grid item lg={6} md={12} sm={12}>
        {chartData?.series?.length ? (
          <Piecharts title="Candidates Interview Status" chartData={chartData} />
        ) : (
          <EmptyContent
            filled
            title="No Data"
            sx={{
              py: 10,
              mt: 1,
            }}
          />
        )}
      </Grid>
      <Grid item lg={6} md={12} sm={12}>
        {barChartData?.series?.length ? (
          <DataLabelChart title="Candidates Score Ranges" barChartData={barChartData} />
        ) : (
          <EmptyContent
            filled
            title="No Data"
            sx={{
              py: 10,
              mt: 1,
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};
export default InsightsTab;
