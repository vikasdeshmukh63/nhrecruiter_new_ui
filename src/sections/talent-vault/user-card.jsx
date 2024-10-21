import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import { Button, Grid, LinearProgress, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

export default function UserCard({ info }) {
  const theme = useTheme();

  const openView = useBoolean();
  const openCart = useBoolean();
  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ position: 'relative' }}>
        {/* image  */}
        <Image
          src={
            info?.Profile_Pic
              ? `https://nhcandidatepics.s3.ap-south-1.amazonaws.com/${info?.Profile_Pic}`
              : '/assets/user.svg'
          }
          alt={info?.name}
          ratio="16/9"
          overlay={alpha(theme.palette.grey[900], 0.48)}
        />
      </Box>

      {/* basic info  */}
      <Box px={3}>
        <ListItemText
          sx={{ my: 1 }}
          primary="Jayvion xxxxxx"
          secondary="kott.krishna@gmail.com"
          primaryTypographyProps={{ typography: 'subtitle1' }}
          secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
        />
        <ListItemText secondary="+91 7676878987" secondaryTypographyProps={{ component: 'span' }} />
        <Typography mt={2} mb={1} variant="body2" color="#637381">
          Sql, C#, Java, Android, XML, AI, ML...
        </Typography>
        <Typography variant="body2" color="#637381">
          Bengaluru
        </Typography>
        <Stack my={1} direction="row" justifyContent="space-between">
          <Button
            variant="soft"
            color="success"
            startIcon={<Iconify icon="material-symbols:add" />}
          >
            Source
          </Button>
          <Button variant="soft" color="info" startIcon={<Iconify icon="mdi:eye" />}>
            Profile
          </Button>
        </Stack>

        <Grid mb={1} container spacing={1} alignItems="center">
          <Grid item xs={4}>
            <Typography variant="caption" color="#637381">
              Profile Age
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <LinearProgress
              variant="determinate"
              value={Number(info?.final_Score) * 10}
              color="success"
              style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
