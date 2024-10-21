import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Dialog, IconButton, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fetchInterviewList } from 'src/redux/slices/interviews';
import { createShareURL, getInterviewStatus } from 'src/redux/slices/candidate';

import Iconify from 'src/components/iconify';
import { toast } from 'sonner';

const style = {
  width: 500,
  boxShadow: 24,
  p: 4,
};
export const ShareInterviewLinkModal = ({ table, openModal, candId, ext_share_links, id_str }) => {
  // redux to extract url

  const { error, shareUrl } = useSelector((state) => state.candidate);
  const dispatch = useDispatch();

  const isSubmitted = useBoolean();

  const handlShare = async () => {
    await dispatch(
      createShareURL({
        ivid: id_str,
      })
    );
    isSubmitted.onTrue();
  };

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied successfully ');
      isSubmitted.onFalse();
      if (table) {
        dispatch(fetchInterviewList(table.page, table.rowsPerPage, undefined));
      } else {
        dispatch(getInterviewStatus(candId));
      }
      openModal.onFalse();
    } catch (err) {
      toast.error('Unable to Copy URL ');
      isSubmitted.onFalse();
      openModal.onFalse();
    }
  };

  useEffect(() => {
    if (isSubmitted.value && error) {
      toast.error('Unable to create Share URL');
      isSubmitted.onFalse();
      openModal.onFalse();
    }
    if (isSubmitted.value && !error) {
      copyUrl(shareUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitted]);
  // console.log(ext_share_links[0]?.isDeleted);

  return (
    <Dialog
      open={openModal.value}
      onClose={openModal.onFalse}
      PaperProps={{ sx: { borderRadius: '16px' } }}
    >
      <Stack sx={style} spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Box display="flex" alignItems="center" justifyContent="center">
            <IconButton sx={{ color: 'black' }}>
              <Icon icon="solar:trash-bin-trash-bold" fontSize="25px" />
            </IconButton>
            <Typography variant="h6">Share Interview</Typography>
          </Box>
          <IconButton onClick={openModal.onFalse}>
            <Iconify icon="iconoir:cancel" />
          </IconButton>
        </Stack>
        <Box px={1}>
          <Typography variant="body1" color="#637381">
            {ext_share_links?.length &&
            !ext_share_links[0]?.isDeleted &&
            ext_share_links[0]?.isActive
              ? 'Your interview link has been created already. To copy the link or delete the interview please visit ‘Shared Interviews’ link from the menu or by clicking on ‘Shared Interviews’ button below.'
              : 'Now you can easily share your NovelHire Interviews with recruiters, post it on your LinkedIn bio or any other way. Please click on ‘Share Interview’ to create a shared link for your interview.'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} justifyContent="right">
          <Button variant="outlined" onClick={openModal.onFalse}>
            Cancel
          </Button>
          {ext_share_links?.length &&
          !ext_share_links[0]?.isDeleted &&
          ext_share_links[0]?.isActive ? (
            <Button
              variant="contained"
              color="info"
              href="/application/interviews/view-shared-interviews/"
            >
              Go to Shared Interviews
            </Button>
          ) : (
            <Button variant="contained" onClick={handlShare}>
              Share Interview
            </Button>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
};
