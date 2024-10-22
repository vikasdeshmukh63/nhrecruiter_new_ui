import { Icon } from '@iconify/react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

export default function ProgressDailog({ openAdd, title, text }) {
  return (
    <div>
      <Dialog
        open={openAdd.value}
        onClose={openAdd.onFalse}
        PaperProps={{ sx: { borderRadius: 1, p: 3, width: '500px' } }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon icon="eva:alert-circle-outline" color="red" width={24} height={24} />

            <Typography variant="h6">{title}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{text}</Typography>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={openAdd.onFalse} variant="outlined">
              Cancel
            </Button>
            <Button onClick={openAdd.onFalse} variant="contained">
              Ok
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  );
}
