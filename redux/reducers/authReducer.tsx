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
  } from '../actions/types';
  
  interface AuthState {
    user: any | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    resetToken: string | null;
    resetLoading: boolean;
  }
  
  const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    resetToken: null,
    resetLoading: false
  };
  
  export default function authReducer(state = initialState, action: any): AuthState {
    switch (action.type) {
      case LOGIN_REQUEST:
        return { ...state, loading: true, error: null };
      case LOGIN_SUCCESS:
        return { ...state, loading: false, user: action.payload, isAuthenticated: true };
      case LOGIN_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case LOGOUT:
        return { ...state, user: null, isAuthenticated: false, resetToken: null };
      case SET_USER:
        return { ...state, user: action.payload, isAuthenticated: true };
      case CLEAR_ERROR:
        return { ...state, error: null };
      case REQUEST_PASSWORD_RESET:
        return { ...state, resetLoading: true, error: null };
      case PASSWORD_RESET_SUCCESS:
        return { ...state, resetLoading: false, resetToken: null };
      case PASSWORD_RESET_FAILURE:
        return { ...state, resetLoading: false, error: action.payload };
      case SET_RESET_TOKEN:
        return { ...state, resetToken: action.payload };
      case CLEAR_RESET_TOKEN:
        return { ...state, resetToken: null };
      default:
        return state;
    }
  }