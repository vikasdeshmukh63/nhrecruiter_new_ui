import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  skills: [],
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
  error: null,
  newSkill: 0,
};

const skills = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    // to add platform constants
    setSkills(state, action) {
      state.skills = action.payload;
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

    // to set new skill
    setNewSkill(state, action) {
      state.newSkill = action.payload;
    },
  },
});

export const { setSkills, setPagination, hasError, setNewSkill } = skills.actions;

export default skills.reducer;

// ! function to search skills
// eslint-disable-next-line default-param-last
export function searchSkills(name, page = 1, rowsPerPage) {
  page += 1;
  const payload = {
    query: {
      isActive: true,
      name,
    },
    options: {
      select: ['id', 'name'],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  return async function searchSkillsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.skills.search, payload);
      if (response.status === 200) {
        dispatch(setSkills(response.data.data));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

// ! function to create new single skill
export function createNewSkill(payload) {
  return async function createNewSkillThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.skills.create, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
        dispatch(setNewSkill(response.data.data));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to fetch skills list for skill table
export function fetchSkillsList(page, rowsPerPage, isActive) {
  page += 1;
  const payload = {
    query: {
      isDeleted: false,
    },
    options: {
      sort: {
        id: -1,
      },
      select: ['id', 'name', 'isActive'],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  if (isActive !== undefined) {
    payload.query.isActive = isActive;
  }
  return async function fetchSkillsListThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.skills.list, payload);
      if (response.status === 200) {
        dispatch(setSkills(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to delete skills
export function deleteSkills(id) {
  const payload = {
    ids: id,
  };
  return async function deleteSkillsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(endpoints.skills.deleteMany, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to create skills
export function createSkills(payload) {
  return async function createSkillsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.skills.createBulk, { data: payload });
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to edit skills
export function editSkill(id, payload) {
  return async function editSkillThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.skills.update}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
