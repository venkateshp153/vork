import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    SET_USER,
    CLEAR_ERROR,
    REQUEST_PASSWORD_RESET,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAILURE,
    SET_RESET_TOKEN,
    CLEAR_RESET_TOKEN
  } from './types';
  
  interface User {
    id: string;
    email: string;
    username?: string;
    accessToken?: string;
  }
  
  export const loginRequest = () => ({ type: LOGIN_REQUEST });
  export const loginSuccess = (user: User) => ({ type: LOGIN_SUCCESS, payload: user });
  export const loginFailure = (error: string) => ({ type: LOGIN_FAILURE, payload: error });
  export const logout = () => ({ type: LOGOUT });
  export const setUser = (user: User) => ({ type: SET_USER, payload: user });
  export const clearError = () => ({ type: CLEAR_ERROR });
  export const requestPasswordReset = () => ({ type: REQUEST_PASSWORD_RESET });
  export const passwordResetSuccess = () => ({ type: PASSWORD_RESET_SUCCESS });
  export const passwordResetFailure = (error: string) => ({ type: PASSWORD_RESET_FAILURE, payload: error });
  export const setResetToken = (token: string) => ({ type: SET_RESET_TOKEN, payload: token });
  export const clearResetToken = () => ({ type: CLEAR_RESET_TOKEN });