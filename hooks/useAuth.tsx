// // hooks/useAuth.ts
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../redux/store";
// import {
//   login,
//   register,
//   requestPasswordReset,
//   resetPassword,
//   validateSession,
//   logout,
//   clearError,
//   selectCurrentUser,
//   selectAuthLoading,
//   selectAuthError,
//   selectResetToken,
//   selectIsAuthenticated,
// } from "../store/authSlice";""
// export const useAuth = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   return {
//     // Selectors
//     user: useSelector(selectCurrentUser),
//     loading: useSelector(selectAuthLoading),
//     error: useSelector(selectAuthError),
//     resetToken: useSelector(selectResetToken),
//     isAuthenticated: useSelector(selectIsAuthenticated),

//     // Actions
//     login: (email: string, password: string) =>
//       dispatch(login({ email, password })),
//     register: (
//       username: string,
//       email: string,
//       password: string,
//       id: string,
//       company: string
//     ) => dispatch(register({ username, email, password, id, company })),
//     requestPasswordReset: (email: string) =>
//       dispatch(requestPasswordReset(email)),
//     resetPassword: (token: string, newPassword: string) =>
//       dispatch(resetPassword({ token, newPassword })),
//     validateSession: (accessCode: string) =>
//       dispatch(validateSession(accessCode)),
//     logout: () => dispatch(logout()),
//     clearError: () => dispatch(clearError()),
//   };
// };