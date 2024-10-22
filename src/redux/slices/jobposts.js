import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { getPersonlDetails, getProfessionalDetails } from 'src/utils/helperFunctions';

const candidateAdditionalData = {
  workExperienceData: [],
  educationData: [],
  certificationsData: [],
  socialProfilesData: [],
};
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
  isLoading: false,
  jobPostDeleteCount: 0,
  individualJobPostData: null,
  candidateInsightData: null,
  dashboardFilter: {},

  candidateIdData: null,
  editCandidateId: '',
  candidateData: null,
  locationData: [],
  foundLocationData: [],
  collegeData: [],
  candidateAdditionalData,
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

    resetAdditionalCandidateAdditionalData(state, action) {
      state.candidateAdditionalData = candidateAdditionalData;
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
      state.jobPosts = action.payload;
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

    setCandidateIdData(state, action) {
      state.candidateIdData = action.payload;
    },
    setCandidateData(state, action) {
      state.candidateData = { ...state.candidateData, ...action.payload };
    },
    resetCandidateData(state, action) {
      state.candidateData = null;
    },
    setFoundLocationData(state, action) {
      state.foundLocationData = action.payload;
    },
    setLocationData(state, action) {
      state.locationData = action.payload;
    },
    setCandidateAdditionalData(state, action) {
      switch (action.payload.type) {
        case 'workExperience':
          state.candidateAdditionalData.workExperienceData.push(action.payload.data);
          break;
        case 'education':
          state.candidateAdditionalData.educationData.push(action.payload.data);
          break;
        case 'certifications':
          state.candidateAdditionalData.certificationsData.push(action.payload.data);
          break;
        case 'socialProfiles':
          state.candidateAdditionalData.socialProfilesData.push(action.payload.data);
          break;
        default:
          break;
      }
    },

    setCandidateResultAdditionalData(state, action) {
      switch (action.payload.type) {
        case 'workExperience':
          state.candidateAdditionalData.workExperienceData = action.payload.data;
          break;
        case 'education':
          state.candidateAdditionalData.educationData = action.payload.data;
          break;
        case 'certifications':
          state.candidateAdditionalData.certificationsData = action.payload.data;
          break;
        case 'socialProfiles':
          state.candidateAdditionalData.socialProfilesData = action.payload.data;
          break;
        default:
          break;
      }
    },

    setCollegeData(state, action) {
      state.collegeData = action.payload;
    },
    setEditCandidateId(state, action) {
      state.editCandidateId = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setMainSteps,
  removeLastMainStep,
  setMainCurrentSteps,
  setPreferanceSteps,
  removeLastPreferanceStep,
  resetAdditionalCandidateAdditionalData,
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
  setCandidateResultAdditionalData,
  setCandidateInsightData,
  setDashboardFilter,
  setCandidateIdData,
  setCandidateData,
  resetCandidateData,
  setFoundLocationData,
  setLocationData,
  setCandidateAdditionalData,
  setCollegeData,
  setEditCandidateId,
  setIsLoading,
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
        dispatch(setJobPostsForSearch(response.data.data ?? []));
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

export function addCandidatePersonalDetails(payload) {
  return async function addCandidatePersonalDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.personalDetail, payload);
      if (response.status === 200) {
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
          return;
        }
        dispatch(setCandidateIdData(response.data.data));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function addCandidateProfessionalDetails(id, payload) {
  return async function addCandidateProfessionalDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(
        `${endpoints.jobPost.profesionalDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function addWorkExperienceDetails(id, payload) {
  return async function addWorkExperienceDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(
        `${endpoints.jobPost.workExperienceDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function addEducationDetails(id, payload) {
  return async function addEducationDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(
        `${endpoints.jobPost.educationDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function addCertificationsDetails(id, payload) {
  return async function addCertificationsDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(
        `${endpoints.jobPost.certificationDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function addSocialProfilesDetails(id, payload) {
  return async function addSocialProfilesDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(
        `${endpoints.jobPost.socialProfileDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

// edit apis

export function editCandidateResume(id, payload) {
  return async function addCandidatePersonalDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.jobPost.editResume}/${id}`, payload);
      if (response.status === 200) {
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
          return;
        }

        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function editPersonalDetails(id, payload) {
  return async function editPersonalDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(
        `${endpoints.jobPost.editPersonalDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
          return;
        }

        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}
export function editProfessionalDetails(id, payload) {
  return async function editProfessionalDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(
        `${endpoints.jobPost.editProfessionalDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
          return;
        }

        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function editWorkExperienceDetails(id, payload) {
  return async function editWorkExperienceDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(
        `${endpoints.jobPost.editWorkExperienceDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
          return;
        }

        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function editEducationDetails(id, payload) {
  return async function editEducationDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(
        `${endpoints.jobPost.editEducationDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
          return;
        }

        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function editCertificationDetails(id, payload) {
  return async function editCertificationDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(
        `${endpoints.jobPost.editCertificationDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
          return;
        }

        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function editSocialProfileDetails(id, payload) {
  return async function editSocialProfileDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(
        `${endpoints.jobPost.editSocialProfileDetail}/${id}`,
        payload
      );
      if (response.status === 200) {
        if (response.data.status === 'FAILURE') {
          dispatch(hasError(response.data));
          return;
        }

        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

// get details
export function getCandidatePersonalDetails(id, payload) {
  return async function getCandidatePersonalDetailsThunk(dispatch, getState) {
    try {
      dispatch(setIsLoading(true));
      const response = await axiosInstance.get(`${endpoints.jobPost.getPersonalDetail}/${id}`);

      if (response.status === 200) {
        const foundData = response.data.data;
        const personalDetails = getPersonlDetails(foundData, getState);
        dispatch(setCandidateData(personalDetails));
        dispatch(hasError(null));
        dispatch(setIsLoading(false));
      }
    } catch (err) {
      dispatch(hasError(err));
      dispatch(setIsLoading(false));
    }
  };
}

// get professional details
export function getCandidateProfessionalDetails(id, payload) {
  return async function getCandidateProfessionalDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(`${endpoints.jobPost.getProfessionalDetail}/${id}`);
      if (response.status === 200) {
        const foundData = response.data.data;
        const personalDetails = getProfessionalDetails(foundData, getState);
        dispatch(setCandidateData(personalDetails));
        dispatch(hasError(null));
        dispatch(setIsLoading(false));
      }
    } catch (err) {
      dispatch(hasError(err));
      dispatch(setIsLoading(false));
    }
  };
}

// get work experience details
export function getCandidateWorkExperienceDetails(id, payload) {
  return async function getCandidateWorkExperienceDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(
        `${endpoints.jobPost.getWorkExperienceDetail}/${id}`
      );
      if (response.status === 200) {
        const foundData = response.data.data.candidateExperience;
        dispatch(
          setCandidateResultAdditionalData({
            type: 'workExperience',
            data: foundData,
          })
        );

        dispatch(hasError(null));
        dispatch(setIsLoading(false));
      }
    } catch (err) {
      dispatch(hasError(err));
      dispatch(setIsLoading(false));
    }
  };
}

// get education details
export function getCandidateWorkEducationDetails(id, payload) {
  return async function getCandidateWorkEducationDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(`${endpoints.jobPost.getEducationDetail}/${id}`);
      if (response.status === 200) {
        const foundData = response.data.data ?? [];

        dispatch(
          setCandidateResultAdditionalData({
            type: 'education',
            data: foundData,
          })
        );

        dispatch(hasError(null));
        dispatch(setIsLoading(false));
      }
    } catch (err) {
      dispatch(hasError(err));
      dispatch(setIsLoading(false));
    }
  };
}

// get certification details
export function getCandidateCertificationDetails(id, payload) {
  return async function getCandidateCertificationDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(`${endpoints.jobPost.getCertificationDetail}/${id}`);
      if (response.status === 200) {
        const foundData = response.data.data ?? [];

        dispatch(
          setCandidateResultAdditionalData({
            type: 'certifications',
            data: foundData,
          })
        );

        dispatch(hasError(null));
        dispatch(setIsLoading(false));
      }
    } catch (err) {
      dispatch(hasError(err));
      dispatch(setIsLoading(false));
    }
  };
}

// get social  details
export function getSocialProfilesDetails(id, payload) {
  return async function getSocialProfilesDetailsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(`${endpoints.jobPost.getSocialProfileDetail}/${id}`);
      if (response.status === 200) {
        const foundData = response.data.data ?? [];
        dispatch(
          setCandidateResultAdditionalData({
            type: 'socialProfiles',
            data: foundData,
          })
        );

        dispatch(hasError(null));
        dispatch(setIsLoading(false));
      }
    } catch (err) {
      dispatch(hasError(err));
      dispatch(setIsLoading(false));
    }
  };
}

export function getLocationData() {
  const payload = {
    query: {
      isActive: true,
    },
    options: {
      select: ['city', 'state', 'country', 'id'],
      page: 1,
      paginate: 1000000000,
    },
    isCountOnly: false,
  };
  return async function getLocationDataThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.locationList, payload);
      if (response.status === 200) {
        dispatch(setLocationData(response.data.data.data ?? []));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function searchLocation(name) {
  const payload = {
    query: {
      isActive: true,
      name,
    },
    options: {
      select: ['city', 'state', 'country', 'id'],
      page: 1,
      paginate: 1000,
    },
    isCountOnly: false,
  };

  return async function searchLocationThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.locationSearch, payload);
      if (response.status === 200) {
        dispatch(setFoundLocationData(response.data.data ?? []));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

export function searchCollege(name) {
  const payload = {
    query: {
      isActive: true,
      name,
    },
    options: {
      select: [],
      page: 1,
      paginate: 1000,
    },
    isCountOnly: false,
  };

  return async function searchCollegeThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.jobPost.collegeSearch, payload);
      if (response.status === 200) {
        dispatch(setCollegeData(response.data.data ?? []));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}
