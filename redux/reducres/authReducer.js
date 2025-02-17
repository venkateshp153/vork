// Initial state
const initialState = {
  user: null,  // This will hold the user object, which can include an accessKey
  loading: false,
  error: null,
  isAuthenticated: false,  // This flag indicates whether the user is authenticated
};

// Reducer function
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { 
        ...state, 
        loading: true, 
        error: null 
      };

    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user,  // Store user data (including accessKey)
        isAuthenticated: true,  // Set isAuthenticated to true
      };

    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload.error,  // Save the error message
      };

    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,  // User is logged out
      };

    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true,  // Set user if it's pre-loaded (e.g., from local storage or persisting state)
      };

    case 'CLEAR_ERROR':
      return { 
        ...state, 
        error: null,  // Clear any errors
      };

    default:
      return state;
  }
};

export default authReducer;
