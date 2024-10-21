import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/recruiter/api/v1/customers/me',
    login: '/recruiter/auth/login',
    loginWithoutPassword: '/recruiter/auth/login/wp',
    register: '/recruiter/auth/register',
    forgotPassword: '/recruiter/auth/forgot-password',
    resetPassword: '/recruiter/auth/reset-password',
    resendOtp: '/recruiter/auth/resend-otp',
    otpValidate: '/recruiter/auth/validate-otp',
  },
  candidate: {
    list: '/recruiter/api/v1/candidates/list',
    create: '/recruiter/api/v1/candidates/create',
    update: '/recruiter/api/v1/candidates/editcandidate',
    search: '/recruiter/api/v1/candidates/search',
    interviewStatus: '/recruiter/api/v1/interviews/status',
    interviewStatusEvent: '/recruiter/api/v1/interviews/events',
    candidateOnJobId: '/recruiter/api/v1/candidates/list_ext',
    deleteMany: '/recruiter/api/v1/candidates/softDeleteMany',
    deleteSingle: '/recruiter/api/v1/candidates/softDelete',
    IntRecTimeline: '/recruiter/api/v1/interviews/events',
    VideoUrl: '/recruiter/api/v1/candidates/getvideourl',
    sharedUrl: '/recruiter/api/v1/interviews/shared',
    resume: '/recruiter/api/v1/candidates/getresumefile',
    createURL: '/recruiter/api/v1/ext_share_links/create',

    candidateListBasedOnJobId: '/recruiter/api/v1/candidates/getjobpostcandidatelist',
  },
  companies: {
    list: '/recruiter/api/v1/companies/list',
    search: '/recruiter/api/v1/companies/search',
    create: '/recruiter/api/v1/companies/create',
    update: '/recruiter/api/v1/companies/partial-update',
  },
  dashboard: {
    dashboardCount: '/recruiter/api/v1/customers/rec_dashboard',
    dashboardData: '/recruiter/api/v1/customers/rec_dashboard_c',
  },
  general: {
    platformConstants: '/general/platformconstants/list',
    languageList: '/general/languages/list',
    countriesList: '/general/countries/list',
  },
  interview: {
    list: '/recruiter/api/v1/interviews/list',
    sharedInterviews: '/recruiter/api/v1/ext_share_links_views/list',
  },
  invite: {
    manualAddCandidate: 'recruiter/api/v1/jp_candidates/addBulk',
    inviteList: '/recruiter/api/v1/jp_candidates/list',
    searchCandidate: '/recruiter/api/v1/jp_candidates/search',
    deleteInvitation: '/recruiter/api/v1/jp_candidates/softDelete',
  },
  jobPost: {
    create: '/recruiter/api/v1/job_posts/create',
    list: '/recruiter/api/v1/job_posts/list',
    search: '/recruiter/api/v1/job_posts/search',
    deleteMany: '/recruiter/api/v1/job_posts/softDeleteMany',
    techSkills: '/recruiter/api/v1/jp_skills/list',
    deleteSingle: '/recruiter/api/v1/job_posts/softDelete',
    update: '/recruiter/api/v1/job_posts/partial-update',
    insights: 'recruiter/api/v1/job_posts/insights',

    // create apis
    personalDetail: '/recruiter/api/v1/candidates/uploadpersonaldetails',
    profesionalDetail: '/recruiter/api/v1/candidates/uploadprofessionaldetails',
    workExperienceDetail: '/recruiter/api/v1/candidates/uploadworkexp',
    educationDetail: '/recruiter/api/v1/candidates/uploadedudetails',
    certificationDetail: '/recruiter/api/v1/candidates/uploadcertificationdetails',
    socialProfileDetail: '/recruiter/api/v1/candidates/uploadsocialprofiles',
    locationList: '/recruiter/api/v1/locations/list',
    locationSearch: '/recruiter/api/v1/locations/search',
    collegeSearch: '/recruiter/api/v1/universities/search',

    // edit apis
    editResume: '/recruiter/api/v1/candidates/updateresume',
    editPersonalDetail: '/recruiter/api/v1/candidates/updatepersonaldetails',
    editProfessionalDetail: '/recruiter/api/v1/candidates/updateprofessionaldetails',
    editWorkExperienceDetail: '/recruiter/api/v1/candidates/updateworkexp',
    editEducationDetail: '/recruiter/api/v1/candidates/updateedudetails',
    editCertificationDetail: '/recruiter/api/v1/candidates/updatecertificationdetails',
    editSocialProfileDetail: '/recruiter/api/v1/candidates/updatesocialprofiles',

    // get apis
    getPersonalDetail: '/recruiter/api/v1/candidates/getpersonaldetails',
    getProfessionalDetail: '/recruiter/api/v1/candidates/getprofessionaldetails',
    getWorkExperienceDetail: '/recruiter/api/v1/candidates/getworkexp',
    getEducationDetail: '/recruiter/api/v1/candidates/getedudetails',
    getCertificationDetail: '/recruiter/api/v1/candidates/getcertificationdetails',
    getSocialProfileDetail: '/recruiter/api/v1/candidates/getsocialprofiles',
  },
  notification: {
    list: '/recruiter/api/v1/notifications/list',
    update: '/recruiter/api/v1/notifications/partial-update',
    updateBulk: '/recruiter/api/v1/notifications/updateBulk',
  },
  organization: {
    search: '/recruiter/api/v1/organizations/search',
    list: '/recruiter/api/v1/organizations/list',
    update: '/recruiter/api/v1/organizations/partial-update',
    delete: '/recruiter/api/v1/organizations/softDeleteMany',
    create: '/recruiter/api/v1/organizations/createwithaccount',
    ip: 'http://ip-api.com/json/?fields=61439',
    createCollege: '/auth/iregister/',
  },
  proficiencies: {
    list: '/guest/masters/list',
  },
  schedule: {
    list: '/recruiter/api/v1/iv_schedules/list',
  },
  skills: {
    search: '/recruiter/api/v1/skills/search',
    create: '/recruiter/api/v1/skills/create',
    list: '/recruiter/api/v1/skills/list',
    deleteMany: '/recruiter/api/v1/softDeleteMany',
    createBulk: '/recruiter/api/v1/addBulk',
    update: '/recruiter/api/v1/skills/partial-update',
  },
  subscription: {
    featuresList: '/recruiter/api/v1/plans/list',
    categoryList: '/recruiter/api/v1/plans_categories/list',
  },
  userAccount: {
    userData: '/recruiter/api/v1/customers/me',
    update: '/recruiter/api/v1/customers/partial-update',
  },
  verify: {
    validateOTP: '/recruiter/auth/validate-otp',
    resendOTP: '/recruiter/auth/resend-otp',
  },
  uploads: {
    bulkUploadCandidateInvite: '/recruiter/api/v1/uploadCandidates',
  },
  credit: {
    balance: '/recruiter/api/v1/iv_credits/get?userType=3&id=',
    list: '/recruiter/api/v1/credit_purchases/list',
    discounts: '/recruiter/api/v1/plan_discounts',
  },
  instantHire: {
    jobSearch: '/recruiter/api/v1/job_titles/search',
    filters: '/recruiter/api/v1/candidates/filter',
  },
};
