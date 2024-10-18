import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  invitesData: [],
  error: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

const invites = createSlice({
  name: 'invites',
  initialState,
  reducers: {
    // to set the invite candidates Data
    setInvites(state, action) {
      state.invitesData = action.payload;
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

export const { setInvites, setPagination, hasError } = invites.actions;

export default invites.reducer;

// ! function to manually add multiple candidates
export function manuallyAddCandidate(payload) {
  return async function manuallyAddCandidateThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.invite.manualAddCandidate, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get candidates list for invites tab
export function fetchCandidateListForInviteTab(page, rowsPerPage, jpid) {
  page += 1;
  const payload = {
    query: {
      isDeleted: false,
      jpid,
    },
    options: {
      select: ['uniq_id', 'name', 'email', 'requestSent', 'name', 'createdAt'],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };

  return async function fetchCandidateListForInviteTabThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.invite.inviteList, payload);
      if (response.status === 200) {
        const sortedData = response.data.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        dispatch(setInvites(sortedData));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get candidates list based on search for invite tab
export function searchCandidates(query, jpid) {
  const payload = {
    query: {
      isDeleted: false,
      jpid,
      query,
    },
    options: {
      select: ['uniq_id', 'name', 'email', 'requestSent', 'name'],
      page: 1,
      paginate: 100,
    },
    isCountOnly: false,
  };

  return async function searchCandidatesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.invite.searchCandidate, payload);
      if (response.status === 200) {
        dispatch(setInvites(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to delete invite candidate
export function deleteInviteCandidate(id) {
  return async function deleteInviteCandidateThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.invite.deleteInvitation}/${id}`);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
