// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  APPLICATION: '/application',
  ADMIN: '/admin',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/sign-in`,
      register: `${ROOTS.AUTH}/sign-up`,
      org: `${ROOTS.AUTH}/register`,
      orgSuccess: `${ROOTS.AUTH}/sign-up/success`,
      collegeSuccess: `${ROOTS.AUTH}/college/register/success`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  application: {
    root: ROOTS.APPLICATION,
    group: {
      root: '/jobposts',
      view: `${ROOTS.APPLICATION}/jobposts/view`,
      create: `${ROOTS.APPLICATION}/jobposts/create`,
    },
    interviews: {
      root: `${ROOTS.APPLICATION}/interviews`,
      group: {
        list: `${ROOTS.APPLICATION}/interviews/list`,
        sharedInterviews: `${ROOTS.APPLICATION}/interviews/view-shared-interviews`,
      },
    },
    schedules: `${ROOTS.APPLICATION}/schedules`,
  },
  admin: {
    root: ROOTS.ADMIN,
    organization: `${ROOTS.ADMIN}/organization`,
    companies: `${ROOTS.ADMIN}/companies`,
    subscription: `${ROOTS.ADMIN}/subscriptionplans`,
    instantHire: `${ROOTS.ADMIN}/instant-hire`,
    talentVault: `${ROOTS.ADMIN}/talent-vault`,

    credits: {
      root: '/credits',
      group: {
        buy: `${ROOTS.ADMIN}/credits/buy`,
        history: `${ROOTS.ADMIN}/credits/history`,
      },
      cart: `${ROOTS.ADMIN}/credits/cart`,
      success: '/success-pages/credit-success/',
    },
  },
  profile: {
    edit: '/profile/editprofile/',
  },
};
