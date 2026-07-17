export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  avatarInitials: string;
  plan: 'Free' | 'Pro' | 'Team';
  trialSessionsUsed: number;
  maxTrialSessions: number;
  isTrialExpired: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  user: AuthUser | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
