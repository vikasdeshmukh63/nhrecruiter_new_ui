import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import cartReducer from '../slices/cart';
import skillReducer from '../slices/skills';
import signupReducer from '../slices/signup';
import creditReducer from '../slices/credit';
import uploadReducer from '../slices/uploads';
import companyReducer from '../slices/company';
import generalReducer from '../slices/general';
import mastersReducer from '../slices/masters';
import invitesReducer from '../slices/invites';
import jobpostReducer from '../slices/jobposts';
import candidateReducer from '../slices/candidate';
import schedulesReducer from '../slices/schedules';
import dashboardReducer from '../slices/dashboard';
import interviewsReducer from '../slices/interviews';
import userAccountReducer from '../slices/userAccount';
import instantHireReducer from '../slices/instantHire';
import organizationReducer from '../slices/organization';
import subscriptionReducer from '../slices/subscription';
import notificationReducer from '../slices/notification';

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
};

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  general: generalReducer,
  candidate: candidateReducer,
  jobpost: jobpostReducer,
  interview: interviewsReducer,
  skills: skillReducer,
  schedules: schedulesReducer,
  company: companyReducer,
  organization: organizationReducer,
  subscription: subscriptionReducer,
  masters: mastersReducer,
  invites: invitesReducer,
  uploads: uploadReducer,
  signup: signupReducer,
  notification: notificationReducer,
  dashboard: dashboardReducer,
  userAccount: userAccountReducer,
  credit: creditReducer,
  cart: cartReducer,
  instantHire: instantHireReducer,
});

const initialState = reducer({}, {});

const rootReducer = (state, action) => {
  if (action.type === 'LOG_OUT') {
    state = initialState;
  }
  return reducer(state, action);
};
export { rootReducer, rootPersistConfig };
