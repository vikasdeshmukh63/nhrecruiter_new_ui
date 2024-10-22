'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Tab,
  Card,
  Tabs,
  Stack,
  Button,
  MenuItem,
  IconButton,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { filters, finderFunction } from 'src/utils/helperFunctions';

import { getCandidatesBasedOnJobId } from 'src/redux/slices/candidate';
import { fetchCandidateListForInviteTab } from 'src/redux/slices/invites';
import {
  candidateInsightJobData,
  getTechSkillsById,
  setEvaluationSwitch,
  setJobPostDataToEdit,
} from 'src/redux/slices/jobposts';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useTable } from 'src/components/table';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { DashboardContent } from 'src/layouts/dashboard';

import InvitesTab from '../invites-tab';
import InsightsTab from '../insights-tab';
import DetailsTab from './tabs/details-tab';
import JobPostAddCandidateModal from './job-post-add-candidate-modal';
import JobPostAddCandidatesList from './tabs/job-post-add-candidates-list';

const TABS = [
  {
    value: 'candidates',
    label: 'Candidates',
    icon: <Iconify icon="mdi:user-outline" width={24} />,
  },
  {
    value: 'insights',
    label: 'Insights',
    icon: <Iconify icon="tabler:chart-arcs" width={24} />,
  },
  {
    value: 'invites',
    label: 'Invites',
    icon: <Iconify icon="material-symbols:call-outline" width={24} />,
  },
  {
    value: 'details',
    label: 'Details',
    icon: <Iconify icon="material-symbols:info-outline" width={24} />,
  },
];
const JobPostDetails = () => {
  const popover = usePopover();
  const [currentTab, setCurrentTab] = useState('candidates');
  const table = useTable({ defaultRowsPerPage: 25 });
  const openCandidateModal = useBoolean();
  const isEditJobPost = useBoolean();

  const { individualJobPostData, technicalSkills } = useSelector((state) => state.jobpost);
  const { languages } = useSelector((state) => state.general);
  const { organizations } = useSelector((state) => state.organization);
  const { companies } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const dataBuilder = () => {
    const dataToSave = {
      jobTitle: individualJobPostData?.title,
      jobDescription: individualJobPostData?.jd,
      organization: finderFunction('id_str', individualJobPostData?.Org_Id, organizations),
      company: finderFunction('id_str', individualJobPostData?.Company_Id, companies) || {
        name: individualJobPostData?.Company_Name,
        id_str: individualJobPostData?.Company_Id,
      },
      personalEvaluation:
        individualJobPostData?.req_personal === 1
          ? String(individualJobPostData?.personal_mode)
          : '',
      behavioralEvaluation:
        individualJobPostData?.req_behavioural === 1
          ? String(individualJobPostData?.behavioural_mode)
          : '',
      backgroundEvaluation:
        individualJobPostData?.req_background === 1
          ? String(individualJobPostData?.background_mode)
          : '',
      technicalEvaluation:
        individualJobPostData?.req_technical === 1
          ? String(individualJobPostData?.technical_mode)
          : '',
      from: individualJobPostData?.start_date,
      to: individualJobPostData?.end_date,
      language: finderFunction('id', individualJobPostData?.lang_id, languages),
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

  // refresh each tabs
  const handleRefresh = async () => {
    if (currentTab === 'candidates') {
      if (individualJobPostData?.Job_Id) {
        await dispatch(
          getCandidatesBasedOnJobId(individualJobPostData?.Job_Id, table.page, table.rowsPerPage)
        );
      }
    }
    if (currentTab === 'details') {
      await dispatch(getTechSkillsById(individualJobPostData?.Job_Id));
    }
    if (currentTab === 'invites') {
      await dispatch(fetchCandidateListForInviteTab(0, 50, individualJobPostData?.Job_Id));
    }
    if (currentTab === 'insights') {
      dispatch(candidateInsightJobData(individualJobPostData?.Job_Id));
    }
  };

  const handleEditJobPost = async () => {
    await dispatch(getTechSkillsById(individualJobPostData?.Job_Id));
    isEditJobPost.onTrue();
  };

  useEffect(() => {
    if (technicalSkills && isEditJobPost.value) {
      dispatch(setJobPostDataToEdit(dataBuilder()));
      router.push('/application/jobposts/edit/');
      isEditJobPost.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isEditJobPost.value, router, technicalSkills]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Stack spacing={2}>
        {/* close section */}
        <Stack direction="row">
          <Box flexGrow={1}>
            <Button
              onClick={() => {
                router.back();
              }}
              startIcon={<Iconify icon="weui:back-filled" />}
            >
              Back
            </Button>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              color="success"
              variant="contained"
              startIcon={<Iconify icon="zondicons:add-outline" />}
              onClick={openCandidateModal.onTrue}
            >
              Add Candidate
            </Button>
            <Button
              variant="outlined"
              onClick={handleEditJobPost}
              startIcon={<Iconify icon="fluent:edit-12-filled" />}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                router.back();
              }}
              startIcon={<Iconify icon="material-symbols:close" />}
            >
              Close
            </Button>
          </Box>
        </Stack>

        {openCandidateModal.value && (
          <JobPostAddCandidateModal openCandidateModal={openCandidateModal} />
        )}

        {/* job title */}
        <Card sx={{ p: 2 }}>
          <Stack direction="row">
            <Stack spacing={1} flexGrow={1}>
              <Typography fontSize={25} fontWeight={700} variant="subtitle2">
                {individualJobPostData?.title}
              </Typography>
              <Typography variant="subtitle2" fontWeight={300}>
                # {individualJobPostData?.ext_id}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Label
                variant="soft"
                color={
                  (individualJobPostData?.status === 1 && 'warning') ||
                  (individualJobPostData?.status === 2 && 'success') ||
                  (individualJobPostData?.status === 3 && 'info') ||
                  (individualJobPostData?.status === 4 && 'secondary') ||
                  (individualJobPostData?.status === 5 && 'error') ||
                  (individualJobPostData?.status === 6 && 'success') ||
                  'default'
                }
              >
                {finderFunction('id', individualJobPostData?.status, filters)?.label}
              </Label>
              <IconButton onClick={handleRefresh}>
                <Iconify icon="basil:refresh-solid" />
              </IconButton>
              <IconButton onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>

              {/* popover */}
              <CustomPopover
                anchorEl={popover.anchorEl}
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
              >
                <MenuItem
                  onClick={() => {
                    popover.onClose();
                  }}
                >
                  <Iconify icon="solar:printer-minimalistic-bold" />
                  Print
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    popover.onClose();
                  }}
                >
                  <Iconify icon="solar:import-bold" />
                  Import
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    popover.onClose();
                  }}
                >
                  <Iconify icon="solar:export-bold" />
                  Export
                </MenuItem>
              </CustomPopover>
            </Stack>
          </Stack>
        </Card>

        <Stack>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {currentTab === 'candidates' && <JobPostAddCandidatesList table={table} />}
          {currentTab === 'invites' && <InvitesTab />}
          {currentTab === 'insights' && <InsightsTab />}
          {currentTab === 'details' && <DetailsTab />}
        </Stack>
      </Stack>
    </DashboardContent>
  );
};

export default JobPostDetails;
