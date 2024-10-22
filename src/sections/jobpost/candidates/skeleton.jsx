import React from 'react';

import { Box, Skeleton, Stack } from '@mui/material';

const InterviewStatusSkeleton = () => (
  <Box display="flex" justifyContent="center" alignItems="center">
    <Stack width={700} gap={3}>
      <Stack gap={1}>
        <Stack gap={0.5} direction="row" width="100%">
          <Skeleton height={60} animation="wave" width="50%" variant="rounded" />
          <Skeleton height={60} animation="wave" width="50%" variant="rounded" />
        </Stack>
        <Stack gap={0.5} direction="row">
          {/* <Skeleton height={40} animation="wave" variant="rectangular" /> */}
          <Skeleton height={100} width="50%" animation="wave" variant="rectangular" />
          <Skeleton height={100} width="50%" animation="wave" variant="rectangular" />
        </Stack>
      </Stack>
      <Stack gap={1}>
        <Stack gap={0.5}>
          <Skeleton height={40} animation="wave" variant="rectangular" />
        </Stack>
        <Stack gap={0.5} direction="row">
          <Skeleton height={100} width="50%" animation="wave" variant="rectangular" />
          <Skeleton height={100} width="50%" animation="wave" variant="rectangular" />
        </Stack>
      </Stack>

      <Stack gap={1}>
        <Stack gap={0.5}>
          <Skeleton height={40} animation="wave" variant="rectangular" />
        </Stack>
        <Stack gap={0.5} direction="row" flexWrap="wrap" justifyContent="space-between">
          <Skeleton height={100} width="49%" animation="wave" variant="rectangular" />
          <Skeleton height={100} width="49%" animation="wave" variant="rectangular" />
          <Skeleton height={100} width="49%" animation="wave" variant="rectangular" />
          <Skeleton height={100} width="49%" animation="wave" variant="rectangular" />
        </Stack>
      </Stack>
    </Stack>
  </Box>
);

export default InterviewStatusSkeleton;
