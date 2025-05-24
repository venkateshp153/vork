// src/redux/types/authTypes.ts
export interface UserData {
  Id: string;
  Email: string;
  Username?: string;
  Company?: string;
  AccessCode?: string;
  Password?: string;
  [key: string]: any; 
}

export interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  resetToken: string | null;
  isAuthenticated: boolean;
}