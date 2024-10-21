import { useTheme } from '@mui/material';
import { useSettingsContext } from '../settings';
import { Chart } from './chart';

export const ReactRadialChart = ({
  chart,
  series,
  color,
  height,
  fontSize = '1.5rem',
  symbol = '/10',
  outOf = 10,
  size,
  ...other
}) => {
  const theme = useTheme();
  const settings = useSettingsContext();

  const colors = [theme.palette[color].light, theme.palette[color].main];

  const chartOptions = {
    stroke: { width: 3, curve: 'smooth', lineCap: 'round' },
    legend: {
      show: false,
    },
    // grid: {
    //   padding: { top: -32, bottom: -32 },
    // },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },

    plotOptions: {
      radialBar: {
        hollow: {
          size,
        },

        dataLabels: {
          name: {
            show: false,
          },
          value: {
            // show: false,
            offsetY: 8,
            color: settings.themeMode === 'dark' ? 'white' : 'black',
            fontSize,
            fontWeight: 700,
            lineHeight: 1.5,
            formatter(val) {
              return `${val / outOf}${symbol}`;
            },
          },
        },
      },
    },
  };

  return (
    <Chart
      dir="ltr"
      type="radialBar"
      series={series}
      options={chartOptions}
      width="100%"
      height={height}
    />
  );
};
