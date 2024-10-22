import { toast } from 'sonner';
import { m } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { getNotification, changeNotificationStatusBulk } from 'src/redux/slices/notification';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { Scrollbar } from 'src/components/scrollbar';

import NotificationList from './notification-list';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'all',
    label: 'All',
    count: 22,
  },
  {
    value: 'unread',
    label: 'Unread',
    count: 12,
  },
  {
    value: 'archived',
    label: 'Archived',
    count: 10,
  },
];

// ----------------------------------------------------------------------

export function NotificationsDrawer() {
  const [currentTab, setCurrentTab] = useState('all');
  const [notificationCount, setNotificationCount] = useState(0);
  const [click, setClick] = useState(false);

  // redux for extracting notifications
  const dispatch = useDispatch();
  const { notifications, error } = useSelector((state) => state.notification);

  // custom hooks
  const drawer = useBoolean();
  const smUp = useResponsive('up', 'sm');

  // changing tab disabled
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // to count total unread notifications
  const totalUnRead = useCallback(() => {
    setNotificationCount(0);
    notifications.forEach((item) => {
      if (item.status === 3) {
        setNotificationCount((prevCount) => prevCount + 1);
      }
    });
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    if (notifications.length !== 0) {
      await dispatch(changeNotificationStatusBulk());
      await dispatch(getNotification());
      setClick(true);
    } else {
      toast.error('No notifications to mark as read');
    }
  };

  useEffect(() => {
    if (click && error) {
      toast.error('Something Went Wrong', { variant: 'error' });
      setClick(false);
    }
    if (click && !error) {
      setClick(false);
    }
  }, [click, error]);

  // to fetch total notifications
  useEffect(() => {
    totalUnRead();
  }, [notifications, totalUnRead]);

  useEffect(() => {
    if (notifications.length === 0) {
      dispatch(getNotification());
    }
  }, [dispatch, notifications.length]);
  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      <Tooltip title="Mark all as read">
        <IconButton color="primary" onClick={handleMarkAllAsRead}>
          <Iconify icon="eva:done-all-fill" />
        </IconButton>
      </Tooltip>

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'unread' && 'info') ||
                (tab.value === 'archived' && 'success') ||
                'default'
              }
            >
              {tab.count}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        <NotificationList />
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={notificationCount} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {/* {renderTabs} */}
          {/* <IconButton onClick={handleMarkAllAsRead}>
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton> */}
        </Stack>

        <Divider />

        {renderList}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large">
            View All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
