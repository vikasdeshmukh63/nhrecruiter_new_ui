import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const signup = createSlice({
  name: 'signup',
  initialState: {
    error: null,
    validationStatus: null,
  },
  reducers: {
    hasError: (state, action) => {
      state.error = action.payload;
    },
    setValidationStatus(state, action) {
      state.validationStatus = action.payload;
    },
  },
});

export const { hasError, setValidationStatus } = signup.actions;

export default signup.reducer;

export function resetPasswordThroghEmail(email) {
  return async function resetPasswordThroghEmailThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.auth.forgotPassword, { email });
      if (response.status === 200) {
        if (response.data.status === 'RECORD_NOT_FOUND') {
          dispatch(hasError(response.data));
        }
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
        } else {
          dispatch(hasError(null));
        }
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function resetPassword(payload) {
  return async function resetPasswordThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(endpoints.auth.resetPassword, payload);
      if (response.status === 200) {
        if (response.data.status === 'RECORD_NOT_FOUND') {
          dispatch(hasError(response.data));
        }
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
        } else {
          dispatch(hasError(null));
        }
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to resend otp
export function resendOtp(id) {
  return async function resendOtpThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(`${endpoints.auth.resendOtp}/${id}`);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function validateOtp(payload) {
  return async function validateOtpThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.auth.otpValidate, payload);
      if (response.status === 200) {
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
        }
        if (response.data.status === 'SUCCESS') {
          dispatch(setValidationStatus(response.data));
          dispatch(hasError(null));
        }
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
