import React from 'react';

import { Box, Typography } from '@mui/material';

const NovelHireCopyRight = ({ ...other }) => (
  <Box {...other} textAlign="center">
    <Typography variant="caption">&copy; 2024 NovelHire. All rights reserved</Typography>
  </Box>
);

export default NovelHireCopyRight;
