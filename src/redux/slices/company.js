import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  companies: [],
  error: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

const company = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // reducer to add organization
    setCompanies(state, action) {
      state.companies = action.payload;
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

export const { setCompanies, setPagination, hasError } = company.actions;

export default company.reducer;

// ! function to search the companies
export function searchCompanies(query) {
  const payload = {
    query: { isActive: true, isDeleted: false, query },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [],
      page: 1,
      paginate: 1000,
    },
    isCountOnly: false,
  };
  return async function searchCompaniesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.companies.search, payload);
      if (response.status === 200) {
        dispatch(setCompanies(response.data.data ?? []));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to fetch the companies list
export function fetchCompaniesList(page, rowsPerPage, status) {
  page += 1;
  const payload = {
    query: {
      isDeleted: false,
      isActive: true,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [],
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

  if (status !== undefined || status !== null) {
    payload.query.status = status;
  }
  return async function fetchCompaniesListThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.companies.list, payload);
      if (response.status === 200) {
        dispatch(setCompanies(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to create company
export function createCompany(payload) {
  return async function createCompanyThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.companies.create, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to update company
export function updateCompany(id, payload) {
  return async function updateCompanyThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.companies.update}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
