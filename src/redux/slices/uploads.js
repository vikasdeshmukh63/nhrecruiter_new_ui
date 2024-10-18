import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  uploadFileResult: null,
  error: null,
};

const uploads = createSlice({
  name: 'uploads',
  initialState,
  reducers: {
    // to add file result state
    uploadFileResultSuccess(state, action) {
      state.uploadFileResult = action.payload.data;
    },

    // to clear file result state
    clearUploadFileResultState(state, action) {
      state.uploadFileResult = null;
      state.error = null;
    },

    // to set error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { uploadFileResultSuccess, clearUploadFileResultState, hasError } = uploads.actions;

export default uploads.reducer;

// ! function to upload invite file
export function uploadInviteFile(jpid, file, userType) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('jpid', jpid);
  formData.append('userType', userType);
  return async function uploadInviteFileThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(
        endpoints.uploads.bulkUploadCandidateInvite,
        formData
      );
      if ((await response.status) === 200) {
        dispatch(uploadFileResultSuccess(response.data));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
