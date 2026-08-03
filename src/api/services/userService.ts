/**
 * User/Profile service — Phase 4: real API implementations.
 * Uses GET/PUT /api/v1/user/me for profile and preferences.
 *
 * Billing (getBillingPlan, getPaymentMethod, getInvoices) has NO backend
 * endpoint in the current API — these remain as structural stubs so that
 * BillingPage continues to compile. Marked clearly below.
 */
import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { UserProfile, BillingPlan, PaymentMethod, Invoice, UserPreferences } from '../../types/user';
import type { AuthUser } from '../../types/auth';

/** Map a raw AuthUser payload to the frontend UserProfile shape. */
function toProfile(raw: Partial<AuthUser>): UserProfile {
  const fullName = raw.fullName || `${raw.firstName || ''} ${raw.lastName || ''}`.trim();
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = raw.firstName || nameParts[0] || '';
  const lastName = raw.lastName || nameParts.slice(1).join(' ') || '';
  const initials = (
    (firstName[0] || '') + (lastName[0] || '')
  ).toUpperCase() || 'U';

  return {
    id: String(raw.id ?? ''),
    firstName,
    lastName,
    email: raw.email || '',
    role: raw.role || '',
    organization: (raw as any).organization || '',
    avatarInitials: initials,
    plan: (['Free', 'Pro', 'Team'].includes(raw.plan || '') ? raw.plan : 'Free') as 'Free' | 'Pro' | 'Team',
  };
}

/** Defensively unwrap { success, message, data } or flat response. */
function unwrapEnvelope<T>(envelope: any): T {
  if (envelope && typeof envelope === 'object' && 'success' in envelope) {
    if (!envelope.success) {
      throw new Error(envelope.message || 'Request failed');
    }
    return envelope.data as T;
  }
  return envelope as T;
}

/* ─────────────────────────────────────────────────────────────────────────
   BILLING STUBS — No backend endpoints exist for billing in this API.
   These placeholders keep BillingPage compiling until the backend adds
   Stripe/subscription endpoints. They return empty structures, NOT fake data.
───────────────────────────────────────────────────────────────────────── */
const EMPTY_BILLING_PLAN: BillingPlan = {
  name: '—',
  price: '—',
  interval: 'monthly',
  nextBillingDate: '—',
};
const EMPTY_PAYMENT_METHOD: PaymentMethod = {
  brand: '—',
  last4: '—',
  expiry: '—',
};

export const userService = {
  /**
   * Get the authenticated user's profile.
   * GET /api/v1/user/me
   */
  getProfile: async (): Promise<UserProfile> => {
    const { data: envelope } = await apiClient.get<any>(ENDPOINTS.user.me);
    const raw: Partial<AuthUser> = unwrapEnvelope<Partial<AuthUser>>(envelope);
    return toProfile(raw);
  },

  /**
   * Update the authenticated user's profile fields.
   * PUT /api/v1/user/me
   */
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const payload = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
    };
    const { data: envelope } = await apiClient.put<any>(ENDPOINTS.user.me, payload);
    const raw: Partial<AuthUser> = unwrapEnvelope<Partial<AuthUser>>(envelope);
    return toProfile(raw);
  },

  /**
   * Get user notification preferences from the user profile.
   * GET /api/v1/user/me — extracts preference fields from AuthUser.
   */
  getPreferences: async (): Promise<UserPreferences> => {
    const { data: envelope } = await apiClient.get<any>(ENDPOINTS.user.me);
    const raw: Partial<AuthUser> = unwrapEnvelope<Partial<AuthUser>>(envelope);
    return {
      emailRecap: raw.weeklyProgressSummary ?? true,
      practiceReminders: raw.practiceReminders ?? true,
      aiSuggestions: true,           // No backend field — local only
      publicProfile: raw.shareData ?? false,
    };
  },

  /**
   * Persist notification preference toggles.
   * PUT /api/v1/user/me — sends only mapped preference fields.
   * aiSuggestions has no backend field and is intentionally excluded.
   */
  updatePreferences: async (prefs: Partial<UserPreferences>): Promise<UserPreferences> => {
    const payload: Partial<AuthUser> = {};
    if (prefs.emailRecap !== undefined) payload.weeklyProgressSummary = prefs.emailRecap;
    if (prefs.practiceReminders !== undefined) payload.practiceReminders = prefs.practiceReminders;
    if (prefs.publicProfile !== undefined) payload.shareData = prefs.publicProfile;

    const { data: envelope } = await apiClient.put<any>(ENDPOINTS.user.me, payload);
    const raw: Partial<AuthUser> = unwrapEnvelope<Partial<AuthUser>>(envelope);
    return {
      emailRecap: raw.weeklyProgressSummary ?? prefs.emailRecap ?? true,
      practiceReminders: raw.practiceReminders ?? prefs.practiceReminders ?? true,
      aiSuggestions: prefs.aiSuggestions ?? true,
      publicProfile: raw.shareData ?? prefs.publicProfile ?? false,
    };
  },

  /* ── Billing stubs (no backend endpoint) ──────────────────────────────── */

  /**
   * STUB — No billing endpoint in current API.
   * Returns an empty plan structure so BillingPage does not crash.
   */
  getBillingPlan: async (): Promise<BillingPlan> => Promise.resolve(EMPTY_BILLING_PLAN),

  /**
   * STUB — No payment-method endpoint in current API.
   */
  getPaymentMethod: async (): Promise<PaymentMethod> => Promise.resolve(EMPTY_PAYMENT_METHOD),

  /**
   * STUB — No invoice endpoint in current API.
   */
  getInvoices: async (): Promise<Invoice[]> => Promise.resolve([]),
};
