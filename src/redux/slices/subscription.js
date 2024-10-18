import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  planData: [],
  planCategories: [],
  error: null,
  planError: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

export const subscription = createSlice({
  initialState,
  name: 'subscription',
  reducers: {
    // to set the plans initially
    setSubsription(state, action) {
      state.planData = action.payload;
    },
    // to set the pagination
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
    // to set the plan categories
    setPlanCategories(state, action) {
      state.planCategories = action.payload;
    },
    // to set the errors in plan
    setErrorPlan(state, action) {
      state.planError = action.payload;
    },
  },
});

export const { setSubsription, hasError, setPagination, setPlanCategories, setErrorPlan } =
  subscription.actions;

export default subscription.reducer;


// ! function to get plan features
export function fetchPlansFeaturesList(page, rowsPerPage) {
    page += 1;
    const payload = {
      query: {
        isDeleted: false,
        isActive: true
      },
      options: {
        select: ['id_str', 'name', 'description', 'additional_desc', 'duration', 'price_monthly', 'price_yearly', 'value'],
        include: [
          {
            model: 'plan_features'
          },
          {
            model: 'plan_discounts',
            as: 'discounts'
          }
        ],
        page,
        paginate: rowsPerPage
      },
      isCountOnly: false
    };
    return async function fetchPlansFeaturesListThunk(dispatch, getState) {
      try {
        const response = await axiosInstance.post(endpoints.subscription.featuresList, payload);
        if (response.status === 200) {
          dispatch(setSubsription(response.data.data.data));
          dispatch(hasError(null));
        }
      } catch (error) {
        dispatch(hasError(error));
      }
    };
  }
  
  // ! function to fetch plan categories list
  export function fetchPlansCategoriesList(page, rowsPerPage) {
    page += 1;
    const payload = {
      query: {
        isDeleted: false,
        isActive: true
      },
      options: {
        select: ['name', 'description'],
        include: [
          {
            model: 'features'
          }
        ],
        page,
        paginate: rowsPerPage
      },
      isCountOnly: false
    };
    return async function fetchPlansCategoriesListThunk(dispatch, getState) {
      try {
        const response = await axiosInstance.post(endpoints.subscription.categoryList, payload);
        if (response.status === 200) {
          dispatch(setPlanCategories(response.data.data.data));
          dispatch(setErrorPlan(null));
        }
      } catch (error) {
        dispatch(setErrorPlan(error));
      }
    };
  }
  