import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import { DateFormat, EvalType, filters, finderFunction } from 'src/utils/helperFunctions';

import { getTechSkillsById } from 'src/redux/slices/jobposts';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

const DetailsTab = () => {
  const { individualJobPostData, technicalSkills } = useSelector((state) => state.jobpost);
  const { languages } = useSelector((state) => state.general);
  const { proficiencies } = useSelector((state) => state.masters);
  const dispatch = useDispatch();

  useEffect(() => {
    if (individualJobPostData?.Job_Id) {
      dispatch(getTechSkillsById(individualJobPostData?.Job_Id));
    }
  }, [dispatch, individualJobPostData?.Job_Id]);

  return (
    <Stack direction="row" spacing={2}>
      <Card sx={{ p: 3, flexGrow: 1 }}>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: individualJobPostData?.jd }} />
      </Card>
      <Stack spacing={2}>
        <Card sx={{ p: 3, minWidth: 345 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Skills
            </Typography>

            <Box>
              {/* <Grid container> */}
              <Stack spacing={1}>
                {technicalSkills.length ? (
                  technicalSkills?.map((item, index) => (
                    <Stack key={index}>
                      <Typography variant="body2" color="#637381" fontWeight={700}>
                        {item?._skillid.name}&nbsp;
                        <Stack direction="row" spacing={2}>
                          <Typography
                            variant="subtitle2"
                            component="span"
                            fontWeight={600}
                            color="black"
                          >
                            {finderFunction('id', item?.prof_mode, proficiencies)?.value}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            component="span"
                            fontWeight={600}
                            color="black"
                          >
                            {finderFunction('id', item?.eval_type, EvalType)?.name}
                          </Typography>
                        </Stack>
                      </Typography>
                    </Stack>
                  ))
                ) : (
                  <Typography variant="caption" color="error">
                    No Skills Found
                  </Typography>
                )}
              </Stack>

              {/* </Grid> */}
            </Box>
            <Box>
              <Typography variant="body2" color="#637381" fontWeight={700}>
                Date posted&nbsp;
                <Typography variant="subtitle2" component="span" fontWeight={600} color="black">
                  {DateFormat(individualJobPostData?.start_date, 'd MMM yyyy')}
                </Typography>
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Iconify icon="solar:calendar-date-bold" />
              <Box>
                <Typography mb={1} variant="body2" color="#637381" fontWeight={400}>
                  Expiration date
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {DateFormat(individualJobPostData?.end_date, 'd MMM yyyy')}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Card>
        <Card sx={{ p: 3, minWidth: 345 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Iconify icon="solar:calendar-date-bold" />
              <Box>
                <Typography mb={1} variant="body2" color="#637381" fontWeight={400}>
                  Date posted
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {DateFormat(individualJobPostData?.start_date, 'd MMM yyyy')}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="solar:calendar-date-bold" />
              <Box>
                <Typography mb={1} variant="body2" color="#637381" fontWeight={400}>
                  Expiration date
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {DateFormat(individualJobPostData?.end_date, 'd MMM yyyy')}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="solar:clock-circle-bold" />
              <Box>
                <Typography mb={1} variant="body2" color="#637381" fontWeight={400}>
                  Status
                </Typography>
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
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="solar:wad-of-money-bold" />
              <Box>
                <Typography mb={1} variant="body2" color="#637381" fontWeight={400}>
                  Language Mode
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {finderFunction('id', individualJobPostData?.lang_id, languages)?.name}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
};

export default DetailsTab;
