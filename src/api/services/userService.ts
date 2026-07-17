/**
 * User service — placeholder implementations.
 */
import type { UserProfile, BillingPlan, PaymentMethod, Invoice, UserPreferences } from '../../types/user';

const MOCK_PROFILE: UserProfile = {
  id: 'u1',
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex@company.com',
  role: 'Product Manager',
  organization: 'Acme Corp',
  avatarInitials: 'AJ',
  plan: 'Pro',
};

const MOCK_BILLING_PLAN: BillingPlan = {
  name: 'Pro',
  price: '$24 / month',
  interval: 'monthly',
  nextBillingDate: 'Nov 1, 2023',
};

const MOCK_PAYMENT_METHOD: PaymentMethod = {
  brand: 'VISA',
  last4: '4242',
  expiry: '09/26',
};

const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', date: 'Oct 1, 2023', description: 'Pro Plan — October 2023', amount: '$24.00', status: 'paid' },
  { id: 'inv2', date: 'Sep 1, 2023', description: 'Pro Plan — September 2023', amount: '$24.00', status: 'paid' },
  { id: 'inv3', date: 'Aug 1, 2023', description: 'Pro Plan — August 2023', amount: '$24.00', status: 'paid' },
];

const MOCK_PREFERENCES: UserPreferences = {
  emailRecap: true,
  practiceReminders: true,
  aiSuggestions: true,
  publicProfile: false,
};

export const userService = {
  getProfile: async (): Promise<UserProfile> => Promise.resolve(MOCK_PROFILE),
  getBillingPlan: async (): Promise<BillingPlan> => Promise.resolve(MOCK_BILLING_PLAN),
  getPaymentMethod: async (): Promise<PaymentMethod> => Promise.resolve(MOCK_PAYMENT_METHOD),
  getInvoices: async (): Promise<Invoice[]> => Promise.resolve(MOCK_INVOICES),
  getPreferences: async (): Promise<UserPreferences> => Promise.resolve(MOCK_PREFERENCES),
  updateProfile: async (_profile: Partial<UserProfile>): Promise<UserProfile> =>
    Promise.resolve({ ...MOCK_PROFILE, ..._profile }),
  updatePreferences: async (_prefs: Partial<UserPreferences>): Promise<UserPreferences> =>
    Promise.resolve({ ...MOCK_PREFERENCES, ..._prefs }),
};
