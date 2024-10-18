// third-party
import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

// initial state
const initialState = {
  userData: null,
  totlUsers: 0,
  error: null,
};

// ==============================|| SLICE - USER ACCOUNT ||============================== //

const userAccount = createSlice({
  name: 'userAccount',
  initialState,
  reducers: {
    // reducer to set the user data
    setUserData(state, action) {
      state.userData = action.payload;
    },
    // set total users
    setTotalUsers(state, action) {
      state.totlUsers = action.payload;
    },
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUserData, hasError, setTotalUsers } = userAccount.actions;

export default userAccount.reducer;

// ! function to get user data
export function getUserData() {
  const payload = {
    options: {
      include: [
        {
          model: 'organizations',
          as: '_org_id',
        },
      ],
    },
  };
  return async function getUserDataThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(`${endpoints.userAccount.userData}`, payload);
      if (response.status === 200) {
        dispatch(setUserData(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to update profile
export function updateProfile(id, payload) {
  return async function updateProfileThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.userAccount.update}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
