export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  username: string;
  role: UserRole;
  loggedIn: boolean;
}

export interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  error: null,
  loading: false
}; 