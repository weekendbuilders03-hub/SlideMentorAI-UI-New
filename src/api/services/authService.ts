/**
 * Auth service — real API implementations.
 * Uses Google OAuth exclusively (backend does not support email/password auth).
 *
 * NOTE: The auth endpoint POST /api/v1/auth/google does NOT use the standard
 * { success, message, data } envelope. It returns a flat object:
 *   { token: string; email: string; name: string }
 * All other endpoints use the ApiResponse<T> wrapper — do NOT change those.
 */
import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { GoogleAuthCredentials, LoginResponse, AuthUser, BackendLoginData } from '../../types/auth';

/** Safe computation of avatar initials from any combination of names. */
const computeInitials = (
  firstName?: string,
  lastName?: string,
  fullName?: string,
  name?: string
): string => {
  const first = (firstName?.[0] || fullName?.[0] || name?.[0] || 'U').toUpperCase();
  const rawName = fullName || name || '';
  const parts = rawName.trim().split(/\s+/);
  const last = (lastName?.[0] || (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  return `${first}${last}`;
};

export const authService = {
  /**
   * Authenticates via Google OAuth.
   *
   * Backend returns a FLAT response (no ApiResponse envelope):
   *   { token: string; email: string; name: string }
   *
   * Also handles the nested variant { token, user: { ... } } for forwards-compatibility.
   */
  googleAuth: async (credentials: GoogleAuthCredentials): Promise<LoginResponse> => {
    // Type as BackendLoginData directly — NOT ApiResponse<BackendLoginData>
    // because the auth endpoint skips the { success, message, data } wrapper.
    const { data } = await apiClient.post<BackendLoginData>(
      ENDPOINTS.auth.google,
      credentials
    );

    // data is now the flat body: { token, email, name }
    const token = data.token || '';

    // Support both flat fields (email, name) and nested user object
    const rawUser = data.user || {};
    const email = data.email || rawUser.email || '';
    const fullName = data.fullName || data.name || rawUser.fullName || 'User';
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = data.firstName || rawUser.firstName || nameParts[0] || 'User';
    const lastName = data.lastName || rawUser.lastName || nameParts.slice(1).join(' ') || '';

    const user: AuthUser = {
      id: rawUser.id ?? 0,
      email,
      fullName,
      firstName,
      lastName,
      avatarInitials: computeInitials(firstName, lastName, fullName),
      role: rawUser.role || 'User',
      plan: rawUser.plan || 'Free',
      ...rawUser,
    };

    return { token, user };
  },

  /**
   * Fetches the authenticated user's full profile.
   * GET /api/v1/user/me — uses the standard ApiResponse<T> envelope.
   */
  getMe: async (): Promise<AuthUser> => {
    // This endpoint uses { success, message, data } — keep unwrapResponse here.
    const { data: envelope } = await apiClient.get<{ success: boolean; message: string; data: Partial<AuthUser> }>(
      ENDPOINTS.user.me
    );

    // Handle both wrapped ({ success, data }) and flat responses defensively
    const raw: Partial<AuthUser> = (envelope as any)?.success !== undefined
      ? ((envelope as any).data ?? {})
      : (envelope as any) ?? {};

    const fullName = raw.fullName || (raw as any).name || `${raw.firstName || ''} ${raw.lastName || ''}`.trim() || 'User';
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = raw.firstName || nameParts[0] || 'User';
    const lastName = raw.lastName || nameParts.slice(1).join(' ') || '';

    const user: AuthUser = {
      id: raw.id ?? 0,
      email: raw.email || '',
      fullName,
      firstName,
      lastName,
      avatarInitials: computeInitials(firstName, lastName, fullName),
      role: raw.role || 'User',
      plan: raw.plan || 'Free',
      ...raw,
    };

    return user;
  },
};
