import { memo } from 'react';
import dynamic from 'next/dynamic';

import { styled } from '@mui/material/styles';
import { bgBlur, varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const OldChart = styled(ApexChart)(({ theme }) => {
  console.log(theme.vars);

  return {
    '& .apexcharts-canvas': {
      // Tooltip
      '& .apexcharts-tooltip': {
        ...bgBlur({
          color: theme.vars.palette.background.defaultChannel,
        }),
        color: theme.vars.palette.text.primary,
        boxShadow: theme.vars.customShadows.dropdown,
        borderRadius: theme.vars.shape.borderRadius * 1.25,
        '&.apexcharts-theme-light': {
          borderColor: 'transparent',
          ...bgBlur({
            color: theme.vars.palette.background.default,
          }),
        },
      },
      '& .apexcharts-xaxistooltip': {
        ...bgBlur({
          color: theme.vars.palette.background.default,
        }),
        borderColor: 'transparent',
        color: theme.vars.palette.text.primary,
        boxShadow: theme.vars.customShadows.dropdown,
        borderRadius: theme.vars.shape.borderRadius * 1.25,
        '&:before': {
          borderBottomColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.24),
        },
        '&:after': {
          borderBottomColor: varAlpha(theme.vars.palette.background.default, 0.8),
        },
      },
      '& .apexcharts-tooltip-title': {
        textAlign: 'center',
        fontWeight: 500,
        backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.08),
        color:
          theme.vars.palette.text[theme.vars.palette.mode === 'light' ? 'secondary' : 'primary'],
      },

      // LEGEND
      '& .apexcharts-legend': {
        padding: 0,
      },
      '& .apexcharts-legend-series': {
        display: 'inline-flex !important',
        alignItems: 'center',
      },
      '& .apexcharts-legend-marker': {
        marginRight: 8,
      },
      '& .apexcharts-legend-text': {
        lineHeight: '18px',
        textTransform: 'capitalize',
      },
    },
  };
});

export default memo(OldChart);
