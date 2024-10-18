import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  schedules: [],
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
  error: null,
};

const schedules = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    // to set schedules data
    scheduleList(state, action) {
      state.schedules = action.payload;
    },

    // to set pagination values
    setPagination(state, action) {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },

    // to has error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { scheduleList, setPagination, hasError } = schedules.actions;

export default schedules.reducer;

// ! function to fetch the schedules list
export function fetchScheduleseList(page, rowsPerPage, status, jpid) {
  page += 1;
  const payload = {
    query: { isActive: true, isDeleted: false },
    options: {
      sort: { createdAt: -1 },
      select: ['id', 'status', 'contact_mode', 'int_sch_date'],
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

  if (status !== undefined && status !== null) {
    payload.query.status = status;
  }

  if (jpid !== undefined && jpid !== null) {
    payload.query.jpid = jpid;
  }
  return async function fetchScheduleseListThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.schedule.list, payload);
      if (response.status === 200) {
        dispatch(scheduleList(response.data.data.data));
        dispatch(setPagination(response.data.data));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
