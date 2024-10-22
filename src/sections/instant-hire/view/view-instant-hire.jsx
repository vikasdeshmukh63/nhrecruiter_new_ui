'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { setCandidate, setPagination } from 'src/redux/slices/instantHire';

import { useSettingsContext } from 'src/components/settings';

import { Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import FilterDrawer from '../filter-drawer';
import ViewInstantHireBody from '../view-instant-hire-body';
import ViewInstantHireToolbar from '../view-instant-hire-toolbar';

// ----------------------------------------------------------------------

const InstantHire = () => {
  const dispatch = useDispatch();
  const settings = useSettingsContext();
  const filtersDrawer = useBoolean();
  const isFilterApplied = useBoolean();

  // states
  const [filtersObj, setFiltersObj] = useState({
    isactive: true,
    skills: [],
    jobtitleid: [],
    experience: [],
    jobfitscore: [],
    finalscore: [],
    iscodingevaluation: false,
    sort: 'name',
    order: '-1',
    page: 1,
    rowsPerPage: 6,
  });

  // on initially render clearing instantant hire candidates
  useEffect(() => {
    dispatch(setCandidate([]));
    dispatch(
      setPagination({
        paginator: {
          itemCount: 0,
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Instant Hire"
          links={[
            { name: 'Admin', href: paths.admin.instantHire },
            { name: 'Instant Hire', href: paths.admin.instantHire },
            { name: 'View' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {/* toolbar  */}
        <ViewInstantHireToolbar
          filtersDrawer={filtersDrawer}
          setFiltersObj={setFiltersObj}
          isFilterApplied={isFilterApplied}
          filtersObj={filtersObj}
        />

        {/* body */}
        <ViewInstantHireBody filtersObj={filtersObj} setFiltersObj={setFiltersObj} />

        {/* filters drawer  */}
        {filtersDrawer.value && (
          <FilterDrawer filtersDrawer={filtersDrawer} setFiltersObj={setFiltersObj} />
        )}
      </Container>
    </DashboardContent>
  );
};

export default InstantHire;
