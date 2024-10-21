'use client';

import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import { Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AppWidget({
  title,
  topText,
  bottomText,
  icon,
  color = 'primary',
  sx,
  ...other
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        color: 'common.white',
        bgcolor: `${color}.dark`,
        ...sx,
      }}
      {...other}
    >
      <ListItemText
        sx={{ ml: 3 }}
        primary={topText}
        secondary={
          <>
            <Typography sx={{ typography: 'h4', component: 'span', color: 'white' }}>
              {title}
            </Typography>
            <Typography
              sx={{
                color: 'white',
                component: 'span',
                typography: 'caption',
                fontSize: 14,
                fontWeight: 100,
              }}
            >
              {bottomText}
            </Typography>
          </>
        }
        primaryTypographyProps={{
          component: 'span',
          typography: 'caption',
          fontSize: 14,
          fontWeight: 100,
        }}
      />
      <Iconify
        icon={icon}
        sx={{
          width: 112,
          right: -32,
          height: 112,
          opacity: 0.15,
          position: 'absolute',
        }}
      />
    </Stack>
  );
}
