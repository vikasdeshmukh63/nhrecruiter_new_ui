// third-party
import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  credits: 0,
  error: null,
};

// ==============================|| SLICE - CREDITS ||============================== //

const credits = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    // to set credits
    setCredits(state, action) {
      state.credits = action.payload;
    },
    // to set credit history
    setCreditHistory(state, action) {
      state.creditHistory = action.payload;
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

export const { setCredits, hasError, setCreditHistory, setPagination } = credits.actions;

export default credits.reducer;

// ! function to get credit balance
export function fetchCreditBalance(id_str) {
  return async function fetchCreditBalanceThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(`${endpoints.credit.balance}${id_str}`);
      if (response.status === 200) {
        dispatch(setCredits(response.data.data.credits_bal));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get credit history
export function fetchCreditHistory(page, rowsPerPage, status) {
  page += 1;
  const payload = {
    query: {
      isDeleted: false,
    },
    options: {
      select: [
        'id_str',
        'ext_order_id',
        'createdAt',
        'updatedAt',
        'Status',
        'discount_id',
        'credits',
      ],
      sort: {
        createdAt: -1,
      },
      include: [
        {
          model: 'credit_purchase_payments',
        },
      ],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  if (status !== undefined) {
    payload.query.status = status;
  }

  return async function fetchCreditHistoryThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.credit.list, payload);
      if (response.status === 200) {
        dispatch(setCreditHistory(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
