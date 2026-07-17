/**
 * Auth service — placeholder implementations.
 * Replace the resolved mock data with real `apiClient` calls when the backend is ready.
 */
import type { LoginCredentials, SignupCredentials, LoginResponse } from '../../types/auth';

export const authService = {
  /** Authenticates with email + password. */
  login: async (_credentials: LoginCredentials): Promise<LoginResponse> => {
    // TODO: return apiClient.post<LoginResponse>(ENDPOINTS.auth.login, _credentials)
    return Promise.resolve({
      token: 'mock-token-abc123',
      user: {
        id: 'u1',
        email: _credentials.email,
        fullName: 'Alex Johnson',
        firstName: 'Alex',
        lastName: 'Johnson',
        avatarInitials: 'AJ',
        plan: 'Pro',
        trialSessionsUsed: 2,
        maxTrialSessions: 5,
        isTrialExpired: false,
      },
    });
  },

  /** Creates a new account. */
  signup: async (_credentials: SignupCredentials): Promise<LoginResponse> => {
    // TODO: return apiClient.post<LoginResponse>(ENDPOINTS.auth.signup, _credentials)
    return Promise.resolve({
      token: 'mock-token-new456',
      user: {
        id: 'u2',
        email: _credentials.email,
        fullName: `${_credentials.firstName} ${_credentials.lastName}`,
        firstName: _credentials.firstName,
        lastName: _credentials.lastName,
        avatarInitials: `${_credentials.firstName[0]}${_credentials.lastName[0]}`.toUpperCase(),
        plan: 'Free',
        trialSessionsUsed: 0,
        maxTrialSessions: 5,
        isTrialExpired: false,
      },
    });
  },

  /** Sends a password-reset email. */
  forgotPassword: async (_email: string): Promise<void> => {
    // TODO: return apiClient.post(ENDPOINTS.auth.forgotPassword, { email: _email })
    return Promise.resolve();
  },
};
