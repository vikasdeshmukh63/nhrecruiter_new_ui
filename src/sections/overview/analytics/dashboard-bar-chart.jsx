import { useTheme } from '@emotion/react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import OldChart from 'src/components/chart/oldchart';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

export default function DashboardBarChart({
  graphData,
  extractedData,
  title,
  stacked,
  series,
  subheader,
  chart,
  colors,
  ...other
}) {
  // states

  // using useTheme
  const theme = useTheme();
  console.log(theme);

  // creating custom colors with useTheme
  const { primary } = theme.vars.palette.text;
  const { divider } = theme.vars.palette;
  const grey500 = theme.vars.palette.grey[500];

  // chart options
  const chartOptions = {
    chart: {
      height: 480,
      type: 'bar',
      id: 'bar-chart',
      stacked,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    colors,
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    xaxis: {
      type: 'category',
      categories: extractedData,
      labels: {
        style: {
          colors: [
            primary,
            primary,
            primary,
            primary,
            primary,
            primary,
            primary,
            primary,
            primary,
            primary,
            primary,
            primary,
          ],
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [primary],
        },
      },
    },

    legend: {
      show: true,
      fontFamily: `'Roboto', sans-serif`,
      position: 'bottom',
      offsetX: 20,
      labels: {
        useSeriesColors: false,
        colors: grey500,
      },
      markers: {
        width: 16,
        height: 16,
        radius: 5,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8,
      },
    },
    fill: {
      type: 'solid',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      // show: true,
      borderColor: divider,
    },
    stroke: {
      show: !stacked,
      width: 2,
      colors: ['transparent'],
    },
  };

  return (
    <Card {...other} sx={{ p: 1 }}>
      <CardHeader title={title} subheader={subheader} />

      {series.length ? (
        <OldChart options={chartOptions} series={series} type="bar" width="100%" height={480} />
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
    </Card>
  );
}
