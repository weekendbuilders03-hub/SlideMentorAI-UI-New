export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization: string;
  avatarInitials: string;
  plan: 'Free' | 'Pro' | 'Team';
}

export interface BillingPlan {
  name: string;
  price: string;
  interval: 'monthly' | 'annual';
  nextBillingDate: string;
}

export interface PaymentMethod {
  brand: string;
  last4: string;
  expiry: string;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'pending';
}

export interface UserPreferences {
  emailRecap: boolean;
  practiceReminders: boolean;
  aiSuggestions: boolean;
  publicProfile: boolean;
}
