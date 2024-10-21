import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { filters, finderFunction } from 'src/utils/helperFunctions';

import {
  deleteSingleJob,
  fetchAllJobPost,
  getTechSkillsById,
  setEvaluationSwitch,
  setIndividualJobPostData,
  setJobPostDataToEdit,
} from 'src/redux/slices/jobposts';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

const JobPostConfirmDeleteModal = ({
  handleSingleDelete,
  isDelete,
  id,
  openConfirmDeleteModal,
}) => {
  const handleDeleteJobPost = async () => {
    if (id) {
      await handleSingleDelete(id);
      await isDelete.onTrue();
      openConfirmDeleteModal.onFalse();
    }
  };

  return (
    <Dialog
      open={openConfirmDeleteModal.value}
      onClose={openConfirmDeleteModal.onFalse}
      PaperProps={{ sx: { borderRadius: 1, p: 3 } }}
    >
      <Typography variant="h5" mb={3}>
        Do you Really Want to Delete This Job Post
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
        <Button variant="outlined" onClick={openConfirmDeleteModal.onFalse}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDeleteJobPost}>
          Delete
        </Button>
      </Stack>
    </Dialog>
  );
};

const JobPostCard = ({ ...jobPost }) => {
  const isEditJobPost = useBoolean();
  const isDelete = useBoolean();
  const openConfirmDeleteModal = useBoolean();
  const popover = usePopover();
  const { jobPosts, error, technicalSkills } = useSelector((state) => state.jobpost);
  const { languages } = useSelector((state) => state.general);

  const { organizations } = useSelector((state) => state.organization);
  const { companies } = useSelector((state) => state.company);

  const dispatch = useDispatch();
  const router = useRouter();

  const dataBuilder = () => {
    const dataToSave = {
      jobTitle: jobPost?.title,
      jobDescription: jobPost?.jd,
      organization: finderFunction('id_str', jobPost?.Org_Id, organizations),
      company: finderFunction('id_str', jobPost?.Company_Id, companies) || {
        name: jobPost?.Company_Name,
        id_str: jobPost?.Company_Id,
      },
      personalEvaluation: jobPost?.req_personal === 1 ? String(jobPost?.personal_mode) : '',
      behavioralEvaluation: jobPost?.req_behavioural === 1 ? String(jobPost?.behavioural_mode) : '',
      backgroundEvaluation: jobPost?.req_background === 1 ? String(jobPost?.background_mode) : '',
      technicalEvaluation: jobPost?.req_technical === 1 ? String(jobPost?.technical_mode) : '',
      from: jobPost?.start_date,
      to: jobPost?.end_date,
      language: finderFunction('id', jobPost?.lang_id, languages),
    };

    dataToSave.skills = technicalSkills.map((item) => ({
      id: item._skillid.id,
      name: item._skillid.name,
      isDeleted: item._skillid.isDeleted,
      isActive: item._skillid.isActive,
      createdAt: item._skillid.createdAt,
      updatedAt: item._skillid.updatedAt,
      addedBy: item._skillid.addedBy,
      updatedBy: item._skillid.updatedBy,
      skillLevel: item.prof_mode,
      skillEvalType: item.eval_type,
    }));

    dispatch(
      setEvaluationSwitch({ key: 'personalEvaluation', value: dataToSave.personalEvaluation })
    );
    dispatch(
      setEvaluationSwitch({ key: 'behavioralEvaluation', value: dataToSave.behavioralEvaluation })
    );
    dispatch(
      setEvaluationSwitch({ key: 'backgroundEvaluation', value: dataToSave.backgroundEvaluation })
    );
    dispatch(
      setEvaluationSwitch({ key: 'technicalEvaluation', value: dataToSave.technicalEvaluation })
    );

    return dataToSave;
  };

  // function to redirect to edit page
  const handleEditPage = async () => {
    await dispatch(getTechSkillsById(jobPost?.Job_Id));
    isEditJobPost.onTrue();
  };

  const handleShowJobPostDetails = (data) => {
    dispatch(setIndividualJobPostData(data));
    router.push('/application/jobposts/details');
  };

  useEffect(() => {
    if (error && isDelete.value) {
      toast.error('Something Went Wrong');
      isDelete.onFalse();
    }
    if (!error && isDelete.value) {
      dispatch(fetchAllJobPost(1, 10));
      toast.success('Job Post Deleted Successfully');
      isDelete.onFalse();
    }
  }, [dispatch, error, isDelete, isDelete.value]);

  useEffect(() => {
    if (technicalSkills && isEditJobPost.value) {
      dispatch(setJobPostDataToEdit(dataBuilder()));
      dispatch(setIndividualJobPostData(jobPost));
      router.push('/application/jobposts/edit/');
      isEditJobPost.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isEditJobPost.value, router, technicalSkills]);

  const handleSingleDelete = async (id) => {
    // calling delete function
    await dispatch(deleteSingleJob(id));
  };

  return (
    <Card>
      <Stack spacing={1} px={4} py={2}>
        {openConfirmDeleteModal.value && (
          <JobPostConfirmDeleteModal
            handleSingleDelete={handleSingleDelete}
            isDelete={isDelete}
            id={jobPost?.Job_Id}
            openConfirmDeleteModal={openConfirmDeleteModal}
          />
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="start">
          <Box pt={2}>
            <Avatar
              src={organizations[0]?._prof_id?.path}
              variant="square"
              sx={{ width: 48, height: 48, borderRadius: '12px' }}
            />

            {/* <Box
              component="img"
              alt="empty content"
              src={organizations[0]?._prof_id?.path}
              sx={{ maxWidth: 48, height: 48, borderRadius: '12px' }}
            /> */}
          </Box>

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>

          <CustomPopover
            open={popover.open}
            onClose={popover.onClose}
            anchorEl={popover.anchorEl}
            arrow="right-top"
            sx={{ width: 140 }}
          >
            <MenuItem onClick={handleEditPage}>
              <Iconify icon="ic:outline-edit" />
              Edit
            </MenuItem>

            <MenuItem onClick={openConfirmDeleteModal.onTrue}>
              <Iconify icon="material-symbols:delete" />
              Delete
            </MenuItem>
          </CustomPopover>
        </Stack>
        <Typography variant="subtitle1">{jobPost.title}</Typography>
        <Typography variant="caption" color="#919EAB">
          {jobPost.ext_id}
        </Typography>
        <Stack direction="row" spacing={4}>
          <Stack direction="row" spacing={1}>
            <Icon icon="solar:users-group-rounded-bold" color="#00A76F" />
            <Typography variant="caption" color="#00A76F">
              {jobPost.Candidate_Count} candidates
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Icon icon="solar:users-group-rounded-bold" color="#8E33FF" />

            <Typography variant="caption" color="secondary">
              {jobPost.Interview_Count} interviews
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Stack p={1} direction="row" justifyContent="space-around" alignItems="center">
        <Label
          variant="soft"
          color={
            (jobPost?.status === 1 && 'warning') ||
            (jobPost?.status === 2 && 'success') ||
            (jobPost?.status === 3 && 'info') ||
            (jobPost?.status === 4 && 'secondary') ||
            (jobPost?.status === 5 && 'error') ||
            (jobPost?.status === 6 && 'success') ||
            'default'
          }
        >
          {finderFunction('id', jobPost?.status, filters)?.label}
        </Label>
        <Button
          size="medium"
          sx={{ px: 5, py: 1 }}
          onClick={() => handleShowJobPostDetails(jobPost)}
          startIcon={<Iconify icon="mdi:eye" />}
          variant="contained"
          color="info"
        >
          View
        </Button>
      </Stack>
    </Card>
  );
};

export default JobPostCard;
