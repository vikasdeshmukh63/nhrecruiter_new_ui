import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  candidates: [],
  jobTitles: [],
  itemCount:0,
  perPage:0,
  pageCount:0,
  currentPage:0,
  error: null,
};

// ==============================|| SLICE - INSTANT HIRE ||============================== //

const instantHire = createSlice({
  name: 'instantHire',
  initialState,
  reducers: {
    // to set candidate
    setCandidate(state, action) {
      state.candidates = action.payload;
    },
    // to set the job titles
    setJobTitles(state, action) {
      state.jobTitles = action.payload;
    },
    // to set pagination values
    setPagination(state, action) {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },
    // to set error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setCandidate, setJobTitles, setPagination, hasError } = instantHire.actions;

export default instantHire.reducer;

// ! function to get credit balance
export function searchJobTitles(query) {
  const payload = {
    query: {
      name: query,
    },
    options: {
      select: [],
    },
    isCountOnly: false,
  };
  return async function searchJobTitlesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.instantHire.jobSearch, payload);
      if (response.status === 200) {
        dispatch(setJobTitles(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get data according to filter
export function filtersForInstantHire(filters) {
  const {
    isactive,
    skills,
    jobtitleid,
    experience,
    jobfitscore,
    finalscore,
    iscodingevaluation,
    sort,
    order,
    page,
    rowsPerPage,
  } = filters;
  const payload = {
    query: {
      isDeleted: false,
      isactive,
    },
    options: {
      sort: {},
      select: [],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };

  if (skills.length !== 0) {
    payload.query.skills = skills;
  }
  if (jobtitleid.length !== 0) {
    payload.query.jobtitleid = jobtitleid?.join(',');
  }
  if (experience.length !== 0) {
    payload.query.experience = experience?.join(',');
  }
  if (jobfitscore.length !== 0) {
    payload.query.jobfitscore = jobfitscore?.join(',');
  }
  if (finalscore.length !== 0) {
    payload.query.finalscore = finalscore?.join(',');
  }
  if (iscodingevaluation !== null || iscodingevaluation !== undefined) {
    payload.query.iscodingevaluation = iscodingevaluation;
  }
  if (sort === 'finalscore') {
    payload.options.sort.finalscore = order;
  }
  if (sort === 'jobfitscore') {
    payload.options.sort.jobfitscore = order;
  }
  if (sort === 'ivdate') {
    payload.options.sort.ivdate = order;
  }
  if (sort === 'name') {
    payload.options.sort.name = order;
  }
  return async function filtersForInstantHireThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.instantHire.filters, payload);
      if (response.status === 200) {
        dispatch(setCandidate(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
