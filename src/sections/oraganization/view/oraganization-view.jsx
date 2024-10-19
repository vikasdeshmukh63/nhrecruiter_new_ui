'use client';

import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import { fetchOrganizationList } from 'src/redux/slices/organization';
import { paths } from 'src/routes/paths';
import { finderFunction } from 'src/utils/helperFunctions';
import { OrganizationQuickEditForm } from '../organization-quick-edit-form';

// ----------------------------------------------------------------------

const flex = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 3,
  p: 2,
};

// ----------------------------------------------------------------------

const OrganizationView = () => {
  const [upgradeBtn, setUpgradeBtn] = useState(true);

  const dispatch = useDispatch();

  const quickEdit = useBoolean();

  const { organizations } = useSelector((state) => state.organization);
  const { countries } = useSelector((state) => state.general);

  // to fetch organization initially
  useEffect(() => {
    dispatch(fetchOrganizationList(0, 10));
  }, [dispatch]);

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [countries, dispatch]);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading={`Organization - ${organizations[0]?.name}`}
        links={[
          { name: 'Admin', href: paths.admin.organization },
          { name: 'Organization', href: paths.admin.organization },
          { name: 'View' },
        ]}
        action={
          <Label
            variant="soft"
            color={
              (organizations[0]?.isActive === false && 'error') ||
              (organizations[0]?.isActive === true && 'primary') ||
              'default'
            }
          >
            {organizations[0]?.isActive === true ? 'Active' : 'InActive'}
          </Label>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Grid container spacing={3}>
        {/* left card  */}
        <Grid item md={12} lg={6}>
          <Card>
            <Box sx={flex}>
              {/* heading  */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar src={organizations[0]?._prof_id?.path} />
                <Typography variant="body1" fontWeight={700}>
                  My Account
                </Typography>
              </Stack>

              {/* edit button  */}
              <Tooltip title="Edit" placement="top" arrow>
                <IconButton
                  color={quickEdit.value ? 'inherit' : 'default'}
                  onClick={quickEdit.onTrue}
                >
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider />
            <Grid container spacing={3} p={2} width="100%">
              {/* name  */}
              <Grid item md={6}>
                <Typography variant="subtitle2">Name</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body2">{organizations[0]?.name}</Typography>
              </Grid>
              {/* email  */}
              <Grid item md={6}>
                <Typography variant="subtitle2">Email</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body2">{organizations[0]?.email}</Typography>
              </Grid>
              {/* mobile number  */}
              <Grid item md={6}>
                <Typography variant="subtitle2">Account Mobile No</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body2">{`${organizations[0]?.mobile_code} ${organizations[0]?.mobile_no}`}</Typography>
              </Grid>
              {/* address  */}
              <Grid item md={6}>
                <Typography variant="subtitle2">Address</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body2">{`${organizations[0]?.houseno}, ${
                  organizations[0]?.street
                }, ${organizations[0]?.city}, ${organizations[0]?.state}, ${
                  finderFunction('name', organizations[0]?.country, countries)?.name
                }`}</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* right card  */}
        <Grid item md={12} lg={6} width="100%">
          <Card>
            <Box sx={{ ...flex, p: 3 }}>
              {/* heading  */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body1" fontWeight={700}>
                  My Plan
                </Typography>
              </Stack>
            </Box>
            <Divider />
            <Grid container spacing={3} p={2}>
              {/* name  */}
              <Grid item md={6}>
                <Typography variant="subtitle2">Current Plan</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body2">Free Trial</Typography>
              </Grid>
              {/* email  */}
              <Grid item md={6}>
                <Typography variant="subtitle2">Plan Period</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body2">Ending on 04/12/2024</Typography>
              </Grid>
              {/* note */}
              <Grid item md={12}>
                <Typography variant="caption">
                  Your have a trial account and have limited access to features. Try one of our
                  plans to suit your needs and enjoy unlimited* benefits & features.
                </Typography>
              </Grid>

              <Grid item md={12} display="flex" justifyContent="center" alignItems="center">
                {upgradeBtn && (
                  <Button variant="contained" size="large" href="/admin/subscriptionplans/">
                    Upgrade
                  </Button>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* organization edit modal  */}
      {quickEdit.value && (
        <OrganizationQuickEditForm
          currentOrg={organizations[0]}
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
        />
      )}
    </DashboardContent>
  );
};

export default OrganizationView;
