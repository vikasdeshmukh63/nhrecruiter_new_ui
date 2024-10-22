import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Pagination } from '@mui/material';

import EmptyContent from 'src/components/empty-content/empty-content';

import UserCard from './user-card';

// ----------------------------------------------------------------------

const ViewInstantHireBody = ({ filtersObj, setFiltersObj }) => {
  const dispatch = useDispatch();

  const { itemCount, candidates } = useSelector((state) => state.instantHire);

  const handleChangePage = (event, newPage) => {
    setFiltersObj((prev) => ({ ...prev, page: newPage }));
  };

  if (candidates.length === 0) {
    return (
      <EmptyContent
        filled
        sx={{ p: 1, height: '100vh' }}
        title="No candidates found!"
        description="Filter candidates based on job fit score, overall score, and relevant skills to identify the best matches for the role."
      />
    );
  }

  return (
    <Grid container spacing={3}>
      {candidates?.map((item, index) => (
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <UserCard info={item} />
        </Grid>
      ))}

      {/* pagination */}
      <Grid item={12} width="100%" display="flex" justifyContent="center" alignItems="center">
        <Pagination
          count={Math.ceil(itemCount / filtersObj.rowsPerPage)}
          page={filtersObj.page}
          onChange={handleChangePage}
        />
      </Grid>
    </Grid>
  );
};

export default ViewInstantHireBody;
