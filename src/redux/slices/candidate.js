import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  error: null,
  interviewStatus: null,
  InterviewEventData: null,
  candidatesData: [],
  ivEvents: null,
  videoUrl: '',
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
  editedCandidate: null,
  technicalSkills: [],
  isCandidateEdited: true,
  loading: false,
  loadingScore: false,
  candidateInterviewData: null,
  candidateResume: '',
  shareUrl: '',
};

const candidate = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    // to set the interview status
    setInterviewData(state, action) {
      state.interviewStatus = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setIsLoadingScore(state, action) {
      state.loadingScore = action.payload;
    },
    // to set error
    hasError(state, action) {
      state.error = action.payload;
    },

    // to set interview event data
    setInterviewEventData(state, action) {
      state.InterviewEventData = action.payload;
    },

    // to set candidates data
    setCandidatesList(state, action) {
      state.candidatesData = action.payload.data;
    },

    // to set pagination values
    setPagination(state, action) {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },

    //  to set iv events
    setIvEvents(state, action) {
      state.ivEvents = action.payload;
    },

    // to set video url
    setVideoUrl(state, action) {
      state.videoUrl = action.payload;
    },

    // to set edited candidate
    setEditedCandidate(state, action) {
      state.editedCandidate = action.payload;
    },

    // to set skills
    setTechSkills(state, action) {
      state.technicalSkills = action.payload;
    },

    // to set is candidate edited
    setIsCandidateEdited(state, action) {
      state.isCandidateEdited = action.payload;
    },
    setCandidateInterviewData(state, action) {
      state.candidateInterviewData = action.payload;
    },
    setCandidateResume(state, action) {
      state.candidateResume = action.payload;
    },
    setShareUrl(state, action) {
      state.shareUrl = action.payload;
    },
  },
});

export const {
  setInterviewData,
  setLoading,
  setIsLoadingScore,
  hasError,
  setInterviewEventData,
  setCandidatesList,
  setPagination,
  setIvEvents,
  setVideoUrl,
  setEditedCandidate,
  setTechSkills,
  setIsCandidateEdited,
  setCandidateInterviewData,
  setCandidateResume,
  setShareUrl,
} = candidate.actions;

export default candidate.reducer;

// ! function to get interview status
export function getInterviewStatus(id) {
  return async function getInterviewStatusThunk(dispatch) {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(`${endpoints.candidate.interviewStatus}/${id}`);
      if (response.status === 200) {
        dispatch(setInterviewData(response.data.data));
        dispatch(hasError(null));
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(hasError(error));
      dispatch(setLoading(false));
    }
  };
}

// ! function to get interview status event
export function getInterviewStatusEvent(id, payload) {
  return async function getInterviewStatusEventThunk(dispatch) {
    try {
      const response = await axiosInstance.get(
        `${endpoints.candidate.interviewStatusEvent}/${id}`,
        {
          params: payload,
        }
      );
      if (response.status === 200) {
        dispatch(setInterviewEventData(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get candidates based on the jobID and search query
export function getCandidatesBasedOnJobId(id, query, filter, filterValues) {
  const payload = {
    query: {
      isactive: true,
      isDeleted: false,
      jpid: id,
    },
    options: {
      select: [],
      page: 1,
      paginate: 100,
    },
    isCountOnly: false,
  };
  if (query !== undefined) {
    payload.query.query = query;
  }

  if (filter !== undefined && filterValues !== undefined) {
    payload.query.filter = filter;
    payload.query.filterValues = filterValues;
  }

  return async function getCandidatesBasedOnJobIdThunk(dispatch) {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post(endpoints.candidate.candidateOnJobId, payload);
      if (response.status === 200) {
        dispatch(setCandidatesList(response.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(hasError(error));
    }
  };
}

// ! function to delete multiple candidate
export function deleteMultipleCandidates(id) {
  const payload = { ids: id };
  return async function deleteMultipleCandidateThunk(dispatch) {
    try {
      const response = axiosInstance.put(endpoints.candidate.deleteMany, payload);
      if ((await response).status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(null));
    }
  };
}

// ! function to delete single candidate
export function deleteSingleCandidate(id) {
  return async function deleteSingleCandidateThunk(dispatch) {
    try {
      const response = axiosInstance.put(`${endpoints.candidate.deleteSingle}/${id}`);
      if ((await response).status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get the interview recording timeline
export function getInterviewRecordingTimeline(id) {
  return async function getInterviewRecordingTimelineThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(`${endpoints.candidate.IntRecTimeline}/${id}`);
      if (response.status === 200) {
        const sortedEvents = response.data.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        dispatch(setIvEvents(sortedEvents));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get video url
export function getVideoUrl(filename, query) {
  const payload = {
    newfilename: filename,
  };
  return async function getVideoUrlThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(
        `${endpoints.candidate.VideoUrl}/${filename}`,
        payload,
        {
          params: query,
        }
      );
      if (response.status === 200) {
        dispatch(hasError(null));
        dispatch(setVideoUrl(response.data.data));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to update candidate
export function updateCandidate(id, payload) {
  return async function updateCandidateThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.candidate.update}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function getInterviewDetailsBasedOnId(id, payload) {
  return async function getInterviewDetailsBasedOnIdThunk(dispatch, getState) {
    try {
      dispatch(setIsLoadingScore(true));
      const response = await axiosInstance.put(`${endpoints.candidate.sharedUrl}/${id}`, payload);
      if (response.status === 200) {
        if (response.data.message === 'Shared link is not valid or expired!') {
          dispatch(setIsLoadingScore(false));
          dispatch(setCandidateInterviewData(null));
          dispatch(setInterviewEventData(null));
          dispatch(setVideoUrl(''));
        } else {
          dispatch(setIsLoadingScore(false));
          dispatch(setCandidateInterviewData(response.data.data));
          dispatch(hasError(null));
        }
      }
    } catch (err) {
      dispatch(setIsLoadingScore(false));
      dispatch(hasError(err));
    }
  };
}

export function getCandidateResume(payload, query) {
  return async function getCandidateResumeThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.candidate.resume, payload, {
        params: query,
      });
      if (response.status === 200) {
        dispatch(setCandidateResume(response.data.data));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}

// create share url
export function createShareURL(payload) {
  return async function createShareURLThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.candidate.createURL, payload);
      if (response.status === 200) {
        dispatch(setShareUrl(response.data.data));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}
