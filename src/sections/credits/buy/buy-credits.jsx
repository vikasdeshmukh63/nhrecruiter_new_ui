'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Grid, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchCreditBalance } from 'src/redux/slices/credit';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';

import PricingCard from '../pricing-card';
import DashboardWidgetSummary from '../dashboard-widget-summery';

const userIcon = '/assets/images/glass/ic_glass_users.png';

const BuyCredits = () => {
  const dispatch = useDispatch();

  const { user } = useAuthContext();

  // extracting data from redux
  const { credits } = useSelector((state) => state.credit);

  // getting the credits count
  useEffect(() => {
    dispatch(fetchCreditBalance(user?.id_str));
  }, [dispatch, user?.id_str]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Buy Credits"
        links={[
          { name: 'Admin', href: paths.admin.credits.group.buy },
          { name: 'Credits', href: paths.admin.credits.group.buy },
          { name: 'Buy' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Grid
        container
        spacing={3}
        height="80vh"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
      >
        {/* credit balance  */}
        <Grid item lg={3} md={6} sm={4} xs={12}>
          <Card sx={{ p: 1 }}>
            <Typography mb={1}>Your Credits</Typography>
            <DashboardWidgetSummary
              title="Current Credits"
              value={credits}
              icon={<img alt="icon" src={userIcon} width={50} />}
            />
          </Card>
        </Grid>
        {/* credit but card  */}
        <Grid item lg={3.5} md={6} sm={4} xs={12}>
          <PricingCard />
        </Grid>
      </Grid>
    </DashboardContent>
  );
};

export default BuyCredits;
