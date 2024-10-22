import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import { Grid, LinearProgress } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';

import { Image } from 'src/components/image';

import ViewCandidateDrawer from '../jobpost/view-candidate-drawer';
import ProgressDailog from '../utils/progressDailog';

// ----------------------------------------------------------------------

export default function UserCard({ info }) {
  const theme = useTheme();

  const openView = useBoolean();
  const openCart = useBoolean();
  return (
    <Card sx={{ textAlign: 'center', mt: 3 }}>
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
      <ListItemText
        sx={{ mt: 3, mb: 1 }}
        primary={info?.name}
        secondary={info?.Job_Title}
        primaryTypographyProps={{ typography: 'subtitle1' }}
        secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
      />
      <ListItemText secondary={info?.email} secondaryTypographyProps={{ component: 'span' }} />

      <Grid container px={4} mt={3}>
        {/* score  */}
        <Grid item xs={6} display="flex" justifyContent="flex-start">
          Score
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="flex-end">
          {info?.final_Score}
        </Grid>
        <Grid item xs={12} mt={1}>
          {/* score indicator  */}
          <LinearProgress
            variant="determinate"
            value={Number(info?.final_Score) * 10}
            color="success"
            style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
          />
        </Grid>
      </Grid>
      {/* action buttons  */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2} mt={3}>
        <IconButton onClick={openCart.onTrue}>
          <Icon icon="ic:twotone-shopping-cart" />
        </IconButton>
        <IconButton onClick={openView.onTrue}>
          <Icon icon="solar:eye-bold-duotone" />
        </IconButton>
      </Box>

      {/* view candidate drawer  */}
      {openView.value && (
        <ViewCandidateDrawer
          openViewCandidate={openView}
          onClose={openView.onFalse}
          profileData={info}
          type="default"
          editable={false}
        />
      )}

      {openCart.value && (
        <ProgressDailog
          title="Notification"
          openAdd={openCart}
          text="We're working on this feature. Stay tuned!"
        />
      )}
    </Card>
  );
}
