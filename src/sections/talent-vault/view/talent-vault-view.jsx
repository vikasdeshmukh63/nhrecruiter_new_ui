'use client';

import * as yup from 'yup';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { searchSkills } from 'src/redux/slices/skills';
import { searchLocation } from 'src/redux/slices/jobposts';

import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { Field, Form } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomLabel from 'src/components/hook-form/label/custom-label';

import UserCard from '../user-card';

export default function TalentVaultView() {
  const router = useRouter();
  const settings = useSettingsContext();
  const dispatch = useDispatch();
  const itemCount = 80;
  const table = useTable({ defaultCurrentPage: 1, defaultRowsPerPage: 10 });
  const { constants } = useSelector((state) => state.general);
  const { skills } = useSelector((state) => state.skills);
  const { foundLocationData } = useSelector((state) => state.jobpost);

  const defaultValues = {
    skills: [],
    minExperience: '',
    maxExperience: '',
    currentLocation: [],
    preferredLocation: [],
    noticePeriod: [],
  };
  const schema = yup.object().shape({
    skills: yup.array(),
    minExperience: yup.string(),
    maxExperience: yup.string(),
    preferredLocation: yup.array(),
    currentLocation: yup.array(),
    noticePeriod: yup.array(),
  });
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, control, watch, setValue } = methods;

  const onsubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  // search location
  const handleKeySearchSkills = (event) => {
    const skill = event.target.value;
    if (skill.length > 1) {
      dispatch(searchSkills(skill));
    }
  };

  const handleKeySearchCurrentLocation = (event) => {
    const location = event.target.value;
    if (location.length > 1) {
      dispatch(searchLocation(location));
    }
  };
  const handleKeySearchPreferredLocation = (event) => {
    const location = event.target.value;
    if (location.length > 1) {
      dispatch(searchLocation(location));
    }
  };

  const handleAddCandidate = () => {
    router.push('/application/jobposts/add-candidate/');
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Instant Hire"
        links={[
          { name: 'Admin', href: paths.admin.talentVault },
          { name: 'Talent Vault', href: paths.admin.talentVault },
          { name: 'View' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <Button
            onClick={handleAddCandidate}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Candidate
          </Button>
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card sx={{ p: 3 }}>
            <Form methods={methods} onSubmit={onsubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Filters</Typography>
                    <IconButton>
                      <Iconify icon="basil:refresh-outline" />
                    </IconButton>
                  </Stack>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <CustomLabel mb={1} title="Skills" />
                  <Stack spacing={2}>
                    <Controller
                      name="skills"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          options={skills}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            setValue('skills', newValue, { shouldValidate: true });
                          }}
                          onKeyUp={handleKeySearchSkills}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search for skills"
                              error={!!error}
                              helperText={error && error.message}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password',
                              }}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => <span />)
                          }
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>{option.name}</li>
                          )}
                        />
                      )}
                    />
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {watch().skills.map((skill) => (
                        <Chip
                          key={skill.id}
                          color="info"
                          variant="soft"
                          size="small"
                          label={skill.name}
                          onDelete={() => {
                            const newSkills = watch().skills.filter((s) => s.id !== skill.id);
                            setValue('skills', newSkills, { shouldValidate: true });
                          }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <CustomLabel mb={1} title="Experience" />
                  <Stack direction="row" spacing={1}>
                    <Field.Text type="number" placeholder="Min" name="minExperience" />
                    <Field.Text type="number" placeholder="Max" name="maxExperience" />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <CustomLabel mb={1} title="Current Location" />
                  <Stack spacing={2}>
                    <Controller
                      name="currentLocation"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          options={foundLocationData}
                          getOptionLabel={(option) => option.city}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            setValue('currentLocation', newValue, { shouldValidate: true });
                          }}
                          onKeyUp={handleKeySearchCurrentLocation}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search for Current Location"
                              error={!!error}
                              helperText={error && error.message}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password',
                              }}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => <span />)
                          }
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>{option.city}</li>
                          )}
                        />
                      )}
                    />
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {watch().currentLocation.map((location) => (
                        <Chip
                          key={location.id}
                          color="info"
                          size="small"
                          variant="soft"
                          label={location.city}
                          onDelete={() => {
                            const newlocations = watch().currentLocation.filter(
                              (s) => s.id !== location.id
                            );
                            setValue('currentLocation', newlocations, { shouldValidate: true });
                          }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <CustomLabel mb={1} title="Preferred Location" />
                  <Stack spacing={2}>
                    <Controller
                      name="preferredLocation"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          options={foundLocationData}
                          getOptionLabel={(option) => option.city}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            setValue('preferredLocation', newValue, { shouldValidate: true });
                          }}
                          onKeyUp={handleKeySearchPreferredLocation}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search for Preferred Location"
                              error={!!error}
                              helperText={error && error.message}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password',
                              }}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => <span />)
                          }
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>{option.city}</li>
                          )}
                        />
                      )}
                    />
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {watch()?.preferredLocation?.map((location) => (
                        <Chip
                          key={location.id}
                          color="info"
                          variant="soft"
                          size="small"
                          label={location.city}
                          onDelete={() => {
                            const newlocations = watch().preferredLocation.filter(
                              (s) => s.id !== location.id
                            );
                            setValue('preferredLocation', newlocations, { shouldValidate: true });
                          }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <CustomLabel mb={1} title="Notice Period" />
                  <Stack spacing={2}>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {watch()?.noticePeriod?.map((notice) => (
                        <Chip
                          key={notice.id}
                          color="info"
                          size="small"
                          variant="soft"
                          label={notice.name}
                          onDelete={() => {
                            const newlocations = watch().noticePeriod.filter(
                              (s) => s.id !== notice.id
                            );
                            setValue('noticePeriod', newlocations, { shouldValidate: true });
                          }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Button type="submit" color="info" fullWidth variant="contained">
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body1" color="#637381">
                Found <span style={{ color: 'green', fontWeight: 800 }}>{0}</span> candidates
              </Typography>
            </Box>
            <Box>
              <Button endIcon={<Icon icon="ep:arrow-down-bold" />}>Sort By: Last Updated</Button>
            </Box>
          </Stack>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            <UserCard info={{ name: 'amith', mobno: '+91 9206336544' }} />
            <UserCard info={{ name: 'amith', mobno: '+91 9206336544' }} />
            <UserCard info={{ name: 'amith', mobno: '+91 9206336544' }} />
            <UserCard info={{ name: 'amith', mobno: '+91 9206336544' }} />
            <UserCard info={{ name: 'amith', mobno: '+91 9206336544' }} />
          </Box>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Pagination
            page={table.page}
            shape="circular"
            onChange={table.onChangePage}
            count={Math.ceil(itemCount / table.rowsPerPage)}
            variant="text"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
