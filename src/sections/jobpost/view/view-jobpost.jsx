'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Container, Pagination, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchOrganizationList } from 'src/redux/slices/organization';
import { fetchAllJobPost, searchJobPost } from 'src/redux/slices/jobposts';

import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import JobPostCard from '../job-post-card';
import JobPostTableToolbar from '../job-post-table-toolbar';

const defaultFilters = {
  title: '',
  role: [],
  status: 'all',
};

const ViewJobPost = () => {
  const [filters, setFilters] = useState(defaultFilters);

  const settings = useSettingsContext();
  const table = useTable({ defaultCurrentPage: 1, defaultRowsPerPage: 10 });
  const { jobPosts, itemCount, individualJobPostData, dashboardFilter } = useSelector(
    (state) => state.jobpost
  );

  const dispatch = useDispatch();

  // filters handle
  const handleFilters = (name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    let timer;
    if (!filters.title) {
      dispatch(fetchAllJobPost(table.page, table.rowsPerPage));
    }
    if (filters.title) {
      timer = setTimeout(() => {
        dispatch(searchJobPost(filters.title));
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [dispatch, filters.title, table.page, table.rowsPerPage]);

  useEffect(() => {
    dispatch(fetchOrganizationList(0, 10));
  }, [dispatch]);
  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={`Job Post - (${itemCount})`}
          links={[
            { name: 'Application', href: paths.application.root },
            { name: 'Job Post', href: paths.application.group.view },
            { name: 'View' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          action={
            <Button
              startIcon={<Iconify icon="mingcute:add-line" />}
              variant="contained"
              type="submit"
              // size="large"
            >
              New Job
            </Button>
          }
        />

        {jobPosts.length === 0 ? (
          <EmptyContent filled sx={{ p: 5, height: '80vh' }} title="No Data Available">
            <Stack direction="row" spacing={3} my={4}>
              <Button variant="contained" component={Link} href="/application/jobpost/create">
                Create
              </Button>
              <Button variant="outlined">Clear Filters</Button>
            </Stack>
          </EmptyContent>
        ) : (
          <>
            {/* filters */}
            <JobPostTableToolbar onFilters={handleFilters} filters={filters} />

            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              {jobPosts.map((jobPost) => (
                <JobPostCard key={jobPost.ext_id} {...jobPost} />
              ))}
            </Box>
            <Box display="flex" justifyContent="center" my={2}>
              <Pagination
                page={table.page}
                shape="circular"
                onChange={table.onChangePage}
                count={Math.ceil(itemCount / table.rowsPerPage)}
                variant="text"
              />
            </Box>
          </>
        )}
      </Container>
    </DashboardContent>
  );
};

export default ViewJobPost;
