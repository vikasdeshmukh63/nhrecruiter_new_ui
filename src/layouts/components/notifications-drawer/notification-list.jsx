import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Chip, Divider, Grid, ListItemText, Typography } from '@mui/material';

import { changeNotificationStatus, getNotification } from 'src/redux/slices/notification';

import EmptyContent from 'src/components/empty-content/empty-content';
import { toast } from 'sonner';

// function to set color as per status
const getColor = (status) => {
  if (status === 3) {
    return { backgroundColor: '#ffcdd2', color: '#b71c1c', text: 'Unread' };
  }
  if (status === 4) {
    return { backgroundColor: '#a5d6a7', color: '#009688', text: 'Read' };
  }
  return null;
};
const NotificationList = () => {
  // states
  const [click, setClick] = useState(false);

  // extract data from redux
  const { notifications, error } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  // custom hooks

  // function to mark the notification as read
  const handleMarkSingleNotificationAsRead = async (id, status) => {
    // making api call to update status of notification as 4 (read)
    await dispatch(changeNotificationStatus(id, { status }));
    await dispatch(getNotification());
    // changing state
    setClick(true);
  };

  // notification for single mark as read
  useEffect(() => {
    if (click && error) {
      toast.error('Something Went Wrong');
    }
    if (click && !error) {
      setClick(false);
    }
  }, [click, error]);

  return (
    <>
      {notifications.length ? (
        notifications.map((item) => (
          <Box key={item.id}>
            <Box
              sx={{
                p: 2,
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: '#dddfe2',
                },
              }}
            >
              <ListItemText
                disableTypography
                secondary={
                  <Grid
                    container
                    direction="column"
                    className="list-container"
                    onClick={() => handleMarkSingleNotificationAsRead(item?.id, 4)}
                  >
                    <Grid item xs={12} sx={{ pb: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {item?.title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight={200}>
                        {item?.message}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item>
                          {item?.status === 3 && (
                            <Chip
                              label="Unread"
                              sx={{
                                background: getColor(item?.status).backgroundColor,
                                color: getColor(item?.status).color,
                              }}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              />
            </Box>
            <Divider />
          </Box>
        ))
      ) : (
        <EmptyContent
          filled
          title="No Notifications"
          sx={{
            py: 35,
            m: 1,
          }}
        />
      )}
    </>
  );
};

export default NotificationList;
