// next js imports
import Link from 'next/link';
// project imports
import { useDispatch, useSelector } from 'react-redux';

// mui imports
import { Grid, Button, Typography, Stack } from '@mui/material';

// assets

import { Icon } from '@iconify/react';

const DashboardNotification = ({ findColor }) => {
  // using useDispatch
  const dispatch = useDispatch();

  // fetching initial data
  // useEffect(() => {
  //   dispatch(getNotification());
  // }, []);

  // extracting data from redux store
  const { notifications } = useSelector((state) => state.notification);

  return (
    <Grid item lg={6} sm={12}>
      <Grid container>
        <Grid item lg={12}>
          {/* title  */}
          <Typography variant="h5" sx={{ mb: 3, mt: 3 }}>
            Recent Notifications
          </Typography>
          {/* content  */}
          <Grid container spacing={3}>
            {notifications.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body" align="center" color="error" fontSize={15}>
                  No New Notifications are Available
                </Typography>
              </Grid>
            ) : (
              <>
                {notifications?.slice(0, 3)?.map((item, index) => (
                  <Grid item xs={12} sm={12} md={12} key={index}>
                    <Stack
                      sx={{
                        border: '1px solid #F5F5F5',
                        padding: 1,
                        borderRadius: 3,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Icon
                        icon="ic:twotone-work"
                        style={{ fontSize: '18px', position: 'absolute', mt: 0.3 }}
                        color={findColor(index)}
                      />
                      <Button
                        variant="text"
                        color="inherit"
                        size="small"
                        sx={{
                          ':hover': { backgroundColor: 'transparent' },
                          '&:active': { backgroundColor: 'transparent' },
                        }}
                      >
                        <Typography color="inherit" sx={{ fontWeight: 500, ml: 3 }} align="left">
                          {item?.title}
                        </Typography>
                      </Button>
                      <Typography variant="caption" sx={{ fontWeight: 500, ml: 3.6 }}>
                        {item?.message}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </>
            )}

            {/* divider  */}

            {/* go to button  */}
            {!notifications.length === 0 && (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                sx={{ display: 'flex', alignItems: 'flex-end', justifyItems: 'flex-end' }}
              >
                <Button
                  fullWidth
                  variant="text"
                  color="inherit"
                  size="small"
                  disableRipple
                  disableFocusRipple
                  endIcon={<Icon icon="ep:arrow-right" color="primary" />}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    '&:hover': { backgroundColor: 'inherit' },
                  }}
                >
                  <Typography
                    component={Link}
                    href="#"
                    variant="caption"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  >
                    More Notifications
                  </Typography>
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardNotification;
