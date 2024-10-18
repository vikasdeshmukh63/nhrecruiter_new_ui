import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  AR_Status: null,
  userTypes: null,
  IV_Status: null,
  IVSCH_Status: null,
  JP_Status: null,
  CAND_Status: null,
  IVM_Status: null,
  FUP_Type: null,
  Order_Status: null,
  order_payment_status: null,
  Q_Category: null,
  Company_Status: null,
  IVMP_Status: null,
  languages: [],
  countries: [],
  error: null,
};

const general = createSlice({
  name: 'general',
  initialState,
  reducers: {
    // to add platform constants
    setPlatformConstants(state, action) {
      const constants = action.payload;
      Object.keys(constants).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
          state[key] = constants[key];
        }
      });
    },
    // to add languages
    setLanguages(state, action) {
      state.languages = action.payload;
    },
    // to add countries
    setCountries(state, action) {
      state.countries = action.payload;
    },
    // to add error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setPlatformConstants, setLanguages, setCountries, hasError } = general.actions;

export default general.reducer;

// ! function to fetch platformConstants
export function fetchPlatformConstants() {
  return async function fetchPlatformConstantsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(endpoints.general.platformConstants);
      if (response.status === 200) {
        dispatch(setPlatformConstants(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to fetch languages
export function fetchLanguages() {
  return async function fetchLanguagesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(endpoints.general.languageList);
      if (response.status === 200) {
        dispatch(setLanguages(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to fetch countries
export function fetchCountries() {
  return async function fetchCountriesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(endpoints.general.countriesList);
      if (response.status === 200) {
        const sortedData = response.data.data
          .slice()
          .sort((a, b) => parseInt(a.dial_code, 10) - parseInt(b.dial_code, 10));
        dispatch(setCountries(sortedData));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}


// ! conditional thunk function
export function fetchPlatformConstantsIfNeeded(key) {
  return (dispatch, getState) => {
    const state = getState().general;
    if (state[key] === null) {
      dispatch(fetchPlatformConstants());
    }
  };
}