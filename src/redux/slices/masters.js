import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  proficiencies: [],
  roles: [],
  nationalId: [],
  helpArticleCats: [],
  error: null,
};

const masters = createSlice({
  name: 'masters',
  initialState,
  reducers: {
    // to add proficiencies
    setProficiencies(state, action) {
      state.proficiencies = action.payload;
    },

    // to set roles
    setRoles(state, action) {
      state.roles = action.payload;
    },

    // to set the help articles
    setHelpArticles(state, action) {
      state.helpArticleCats = action.payload;
    },
    // to add NationalId
    setNationalId(state, action) {
      state.nationalId = action.payload;
    },
    // to set error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setProficiencies, setRoles, setNationalId, setHelpArticles, hasError } =
  masters.actions;

export default masters.reducer;

// ! function to fetch masters
export function fetchMasters() {
  const payload = {
    options: {
      select: ['id', 'name', 'value', 'type'],
      page: 1,
      paginate: 1000,
    },
    isCountOnly: false,
  };
  return async function fetchProficienciesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.proficiencies.list, payload);

      if (response.status === 200) {
        const proficiencies = response.data.data.data.filter((item) => item.type === 'PROF_MODE');
        const nationalId = response.data.data.data.filter((item) => item.type === 'NID_TYPES');
        const roles = response.data.data.data.filter((item) => item.type === 'ROLE_ID');
        const helpArticleCats = response.data.data.data.filter(
          (item) => item.type === 'HELP_ARTICLES'
        );
        dispatch(setProficiencies(proficiencies));
        dispatch(setNationalId(nationalId));
        dispatch(setRoles(roles));
        dispatch(setHelpArticles(helpArticleCats));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
