'use client';

import axios, { endpoints } from 'src/utils/axios';

import { dispatch as reduxDispatch } from 'src/redux/store/store';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }) => {
  reduxDispatch({ type: 'LOG_OUT' });

  try {
    const params = { username, password };

    const res = await axios.post(endpoints.auth.login, params);

    const { token } = res.data.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    setSession(token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

export const signInWithoutPassword = async (username, router) => {
  reduxDispatch({ type: 'LOG_OUT' });

  try {
    const data = {
      username,
    };

    const response = await axios.post(endpoints.auth.loginWithoutPassword, data);
    const { isverified } = response.data.data;
    const { token } = response.data.data;

    if (isverified) {
      setSession(token);
    } else {
      router.push('/auth/verify');
    }
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.register, params);

    const { token } = res.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, token);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
