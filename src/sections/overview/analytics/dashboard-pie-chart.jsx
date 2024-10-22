import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { ChartPie } from 'src/components/chart/chart-pie';
import EmptyContent from 'src/components/empty-content/empty-content';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function DashboardPieChart({ chart, colors, title, subheader, ...other }) {
  console.log(chart);

  return (
    <Card {...other} sx={{ p: 1 }}>
      <CardHeader title={title} subheader={subheader} />
      {chart?.series?.length === 0 ? (
        <EmptyContent
          filled
          title="No Data"
          sx={{
            py: 10,
            mt: 1,
          }}
        />
      ) : (
        <ChartPie
          chart={chart}
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
        />
      )}
    </Card>
  );
}
