import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  mainStepsDone: [],
  mainCurrentStep: null,
  preferenceStepsDone: [],
  preferenceCurrentStep: null,
  technicalSkills: [],
  evaluationSwitch: {
    personalEvaluation: true,
    behavioralEvaluation: true,
    backgroundEvaluation: true,
    technicalEvaluation: true,
    codingEvaluation: false,
  },
  jobData: {},
  jobPosts: [],
  error: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
  jobPostDeleteCount: 0,
  individualJobPostData: null,
  candidateInsightData: null,
  dashboardFilter: {},
};

const jobpost = createSlice({
  name: 'jobpost',
  initialState,
  reducers: {
    // to keep the record of the main steps done
    setMainSteps(state, action) {
      if (!state.mainStepsDone.includes(action.payload)) {
        state.mainStepsDone = [...state.mainStepsDone, action.payload];
      }
    },
    setDashboardFilter(state, action) {
      state.dashboardFilter = action.payload;
    },

    // to remove last step from main steps done
    removeLastMainStep(state) {
      state.mainStepsDone.pop();
    },

    // to set the main current active state
    setMainCurrentSteps(state, action) {
      state.mainCurrentStep = action.payload;
    },

    // to keep a record of the job preferences steps done
    setPreferanceSteps(state, action) {
      if (!state.preferenceStepsDone.includes(action.payload)) {
        state.preferenceStepsDone = [...state.preferenceStepsDone, action.payload];
      }
    },

    // to remove last step from record
    removeLastPreferanceStep(state) {
      state.preferenceStepsDone.pop();
    },

    // to set preference current active step
    setPreferanceCurrentSteps(state, action) {
      state.preferenceCurrentStep = action.payload;
    },

    // to set jobData
    setJobData(state, action) {
      state.jobData = { ...state.jobData, ...action.payload };
    },

    // to remove jobData
    removeJobData(state, action) {
      state.jobData = action.payload;
    },

    // to add jobpost
    setJobPosts(state, action) {
      state.jobPosts = action.payload.data;
    },

    // to set pagination values
    setPagination(state, action) {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },

    // to set search jobdata
    setJobPostsForSearch(state, action) {
      state.jobPosts = action.payload.data;
    },

    // has error
    hasError(state, action) {
      state.error = action.payload;
    },

    // reducer to set evaluation switch
    setEvaluationSwitch(state, action) {
      state.evaluationSwitch[action.payload.key] = action.payload.value;
    },

    // reducer to reset the evaluationSwitch
    resetEvaluationSwitch(state) {
      state.evaluationSwitch = {
        personalEvaluation: true,
        behavioralEvaluation: true,
        backgroundEvaluation: true,
        technicalEvaluation: true,
        codingEvaluation: false,
      };
    },

    // reducer to reset steps
    resetSteps(state) {
      state.mainStepsDone = [];
      state.mainCurrentStep = null;
      state.preferenceStepsDone = [];
      state.preferenceCurrentStep = null;
    },

    // reducer to set individual job post data
    setIndividualJobPostData(state, action) {
      state.individualJobPostData = action.payload;
    },

    // reducer to set skills
    setTechSkills(state, action) {
      state.technicalSkills = action.payload;
    },

    // reducer to set jobData for edit job post
    setJobPostDataToEdit(state, action) {
      state.jobData = action.payload;
    },

    setCandidateInsightData(state, action) {
      state.candidateInsightData = action.payload;
    },
  },
});

export const {
  setMainSteps,
  removeLastMainStep,
  setMainCurrentSteps,
  setPreferanceSteps,
  removeLastPreferanceStep,
  setPreferanceCurrentSteps,
  setJobData,
  removeJobData,
  setJobPosts,
  setPagination,
  setJobPostsForSearch,
  hasError,
  setEvaluationSwitch,
  resetEvaluationSwitch,
  resetSteps,
  setIndividualJobPostData,
  setTechSkills,
  setJobPostDataToEdit,
  setCandidateInsightData,
  setDashboardFilter,
} = jobpost.actions;

export default jobpost.reducer;

// ! function to create job post
export function createJobPost(payload) {
  return async function createJobPostThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.create, payload);
      if (response.status === 200) {
        dispatch(removeJobData(null));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get all job post
export function fetchAllJobPost(page, rowsPerPage, status, companyId, id_str) {
  page += 1;
  const payload = {
    query: { isActive: true, isDeleted: false },
    options: {
      sort: { createdAt: -1 },
      select: [],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };

  if (status !== undefined || status !== null) {
    payload.query.status = status;
  }

  if (companyId !== undefined || companyId !== null) {
    payload.query.comp_id = companyId;
  }

  if (id_str !== undefined || id_str !== null) {
    payload.query.id_str = id_str;
  }

  return async function fetchAllJobPostThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.list, payload);
      if (response.status === 200) {
        dispatch(setJobPosts(response.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get job post according to search
export function searchJobPost(title) {
  const payload = {
    query: { isActive: true, isDeleted: false, title },
    options: {
      select: [],
      page: 1,
      paginate: 1000,
    },
    isCountOnly: false,
  };
  return async function searchJobPostThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.search, payload);
      if (response.status === 200) {
        dispatch(setJobPostsForSearch(response.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to delete multiple job posts
export function deleteManyJobPosts(id) {
  const payload = { ids: id };
  return async function deleteManyJobPostsThunk(dispatch) {
    try {
      const response = await axiosInstance.put(endpoints.jobPost.deleteMany, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get technical skills
export function getTechSkillsById(id) {
  const payload = {
    query: {
      isActive: true,
      jpid: id,
    },
    options: {
      select: ['prof_mode', 'eval_type'],
      include: [
        {
          model: 'skills',
          as: `_skillid`,
        },
      ],
      page: 1,
      paginate: 10,
    },
    isCountOnly: false,
  };
  return async function getTechSkillsByIdThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.techSkills, payload);
      if (response.status === 200) {
        dispatch(setTechSkills(response.data.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to delete single jobpost
export function deleteSingleJob(id) {
  return async function deleteSingleJobThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.jobPost.deleteSingle}/${id}`);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to update jobpost
export function updateJobPost(id, payload) {
  return async function updateJobPostThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.jobPost.update}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get job insights data
export function candidateInsightJobData(id) {
  const payload = {
    job_id: id,
  };
  return async function candidateInsightJobDataThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.insights, payload);
      if (response.status === 200) {
        dispatch(setCandidateInsightData(response.data.data));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to refresh and set individual job post data
export function refreshIndividualJobPostData(id) {
  const payload = {
    query: { isActive: true, isDeleted: false, id_str: id },
    options: {
      sort: { createdAt: -1 },
      select: [],
      page: 1,
      paginate: 25,
    },
    isCountOnly: false,
  };
  return async function refreshIndividualJobPostDataThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.list, payload);
      if (response.status === 200) {
        dispatch(setIndividualJobPostData(response.data.data.data[0]));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
