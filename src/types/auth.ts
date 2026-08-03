/* ─── User returned by auth and /user/me ─── */

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  /** Computed client-side from name / firstName + lastName. */
  avatarInitials?: string;
  role: string;
  plan: string;
  /* Extended fields — populated by GET /user/me */
  trialEndsAt?: string;
  trialSessionsUsed?: number;
  maxTrialSessions?: number;
  isSubscriptionActive?: boolean;
  remainingSessions?: number;
  isTrialExpired?: boolean;
  /* User preferences */
  displayLanguage?: string;
  weeklyProgressSummary?: boolean;
  practiceReminders?: boolean;
  productUpdates?: boolean;
  themeDark?: boolean;
  shareData?: boolean;
}

/* ─── Redux auth state ─── */

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  user: AuthUser | null;
}

/* ─── Request / Response payloads ─── */

/** Sent to POST /api/v1/auth/google after completing Google OAuth flow. */
export interface GoogleAuthCredentials {
  idToken: string;
}

/** Shape of `data` inside the backend auth response. */
export interface BackendLoginData {
  token: string;
  email?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  user?: Partial<AuthUser>;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
