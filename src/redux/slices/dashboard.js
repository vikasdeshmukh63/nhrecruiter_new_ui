// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

// initial state
const initialState = {
  cardData: null,
  graphData: null,
  error: null,
  timeDuration: 1,
};

// ==============================|| SLICE - CART||============================== //

const dashboard = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // reducer to set card data
    setCardData(state, action) {
      state.cardData = action.payload;
    },
    // reducer to set graph data
    setGraphData(state, action) {
      state.graphData = action.payload;
    },
    // reducer to set error
    hasError(state, action) {
      state.error = action.payload;
    },
    setTimeDuration(state, action) {
      state.timeDuration = action.payload;
    },
  },
});

export const { setCardData, setGraphData, hasError, setTimeDuration } = dashboard.actions;

export default dashboard.reducer;

// Thunk Functions
// ! function to get counts for dashboard
export function getDashboardCounts(from, to, org_id) {
  const payload = {
    query: {
      org_id,
      from_date: from,
      to_date: to,
    },
  };
  return async function getDashboardCountsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.dashboard.dashboardCount, payload);
      if (response.status === 200) {
        dispatch(setCardData(response.data.data[0]));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get dashboard data
export function getDashboardData(duration) {
  const payload = {
    query: {
      timeFrame: duration,
    },
  };
  return async function getDashboardDataThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.dashboard.dashboardData, payload);
      if (response.status === 200) {
        dispatch(setGraphData(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
