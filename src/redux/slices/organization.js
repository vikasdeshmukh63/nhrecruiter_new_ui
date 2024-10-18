import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  organizationData: {},
  organizations: [],
  error: null,
  individualOrg: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
  ipAddress: null,
  errorOrg: '',
  createdOrgData: null,
};

const organization = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    // to add organization
    setOrganizations(state, action) {
      state.organizations = action.payload;
    },

    // to set pagination values
    setPagination(state, action) {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },

    // to set individual org
    setIndividualOrg(state, action) {
      state.individualOrg = action.payload;
    },

    // to set error
    hasError(state, action) {
      state.error = action.payload;
    },

    // to set org data
    setOrganizationData: (state, action) => {
      state.organizationData = { ...state.organizationData, ...action.payload };
    },

    // to remove org data
    removeOrgData: (state, action) => {
      state.organizationData = action.payload;
    },
    setIpAddress: (state, action) => {
      state.ipAddress = action.payload;
    },
    setAccError: (state, action) => {
      state.errorOrg = action.payload;
    },
    setCreatedOrgData: (state, action) => {
      state.createdOrgData = action.payload;
    },
  },
});

export const {
  setOrganizations,
  setPagination,
  hasError,
  setIndividualOrg,
  setOrganizationData,
  removeOrgData,
  setAccError,
  setIpAddress,
  setCreatedOrgData,
} = organization.actions;

export default organization.reducer;

// ! function to fetch all organization
export function fetchOrganizationList(page, rowsPerPage, isActive) {
  page += 1;
  const payload = {
    query: {
      isDeleted: false,
      isActive,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [
        'name',
        'email',
        'mobile_no',
        'mobile_code',
        'houseno',
        'street',
        'city',
        'state',
        'zipcode',
        'country',
        'id_str',
        'isActive',
      ],
      include: [
        {
          model: 'fileuploads',
          as: '_prof_id',
        },
      ],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  return async function fetchOrganizationListThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.organization.list, payload);
      if (response.status === 200) {
        dispatch(setOrganizations(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to update the organization
export function updateOrganization(id, payload) {
  return async function updateOrganizationThunk(dispatch, getState) {
    try {
      const response = axiosInstance.put(`${endpoints.organization.update}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to create new org with customer account
export function createNewOrgWithCustomerAcc(payload) {
  return async function createNewOrgWithCustomerAccThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.organization.create, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
        dispatch(setOrganizationData({}));
        dispatch(setCreatedOrgData(response.data.data));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function getLocationOnIp(payload) {
  return async function getLocationOnIpThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(endpoints.organization.ip);
      if (response.status === 200) {
        dispatch(setIpAddress(response.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
