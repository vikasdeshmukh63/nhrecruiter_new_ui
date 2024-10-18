// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

// initial state
const initialState = {
  notifications: [],
  error: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

// ==============================|| SLICE - NOTIFICATION ||============================== //

const notification = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // reducer to set notification
    setNotification(state, action) {
      state.notifications = action.payload;
    },
    // reducer to set pagination values
    setPagination(state, action) {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export default notification.reducer;

export const { setNotification, setPagination, hasError } = notification.actions;

// Thunk Functions

// ! function to get all notifications
export function getNotification() {
  const payload = {
    query: {
      isDeleted: false,
      isActive: true,
      type: 1,
    },
    options: {
      select: ['id', 'title', 'message', 'status', 'createdAt'],
      page: 1,
      paginate: 10,
    },
    isCountOnly: false,
  };
  return async function getNotificationThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.notification.list, payload);
      if (response.status === 200) {
        dispatch(setNotification(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to change notification status (for single)
export function changeNotificationStatus(id, payload) {
  return async function changeNotificationStatusThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.notification.update}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to change notification status (for bulk)
export function changeNotificationStatusBulk() {
  const payload = {
    filter: {
      status: 1,
    },
    data: {
      status: 4,
      read_time: new Date(),
    },
  };
  return async function changeNotificationStatusBulkThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(endpoints.notification.updateBulk, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
