import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  interviews: [],
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
  error: null,
  viewSharedInterviewHistory: [],
};

const interviews = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    // to set interviews data
    setInterviews(state, action) {
      state.interviews = action.payload;
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
    setViewSharedInterviewsHistory(state, action) {
      state.viewSharedInterviewHistory = action.payload;
    },
  },
});

export const { setInterviews, setPagination, hasError, setViewSharedInterviewsHistory } =
  interviews.actions;

export default interviews.reducer;

// ! function to fetch the interview list
export function fetchInterviewList(page, rowsPerPage, status, jpid) {
  page += 1;
  const payload = {
    query: {},
    options: {
      sort: {
        createdAt: -1,
      },
      select: [],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };

  if (status !== undefined || status !== null) {
    payload.query.status = status;
  }

  if (jpid !== undefined || jpid !== null) {
    payload.query.jpid = jpid;
  }

  return async function fetchInterviewListThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.interview.list, payload);
      if (response.status === 200) {
        dispatch(setInterviews(response.data.data.data));
        dispatch(setPagination(response.data.data));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function getAllinterviewsList(
  rowsPerPage,
  active = true,
  page = 1,
  value = null,
  jobid = null
) {
  let q = { isActive: active, isDeleted: false };
  if (jobid) {
    q = { ...q, jpid: jobid };
  } else if (value) {
    q = { ...q, status: value };
  }
  const payload = {
    query: q,
    options: {
      sort: {
        createdAt: -1,
      },
      select: [],
      include: [
        {
          model: 'job_posts',
          as: '_jpid',
        },
        {
          model: 'candidates',
          as: '_candid',
        },
      ],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  return async function getAllinterviewsListThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.interview.list, payload);
      if (response.status === 200) {
        const sortedData = response.data.data.data.sort(
          (a, b) => new Date(b.iv_date) - new Date(a.iv_date)
        );
        dispatch(setInterviews(sortedData));
        dispatch(setPagination(response.data.data));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function getAllViewSharedinterviewHistory(page, rowsPerPage) {
  page += 1;
  const payload = {
    query: {
      isDeleted: false,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };

  return async function getAllViewSharedinterviewHistoryThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.interview.sharedInterviews, payload);
      if (response.status === 200) {
        dispatch(setViewSharedInterviewsHistory(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
