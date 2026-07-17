/** All API endpoint paths as typed constants. */
export const ENDPOINTS = {
  auth: {
    login: '/api/v1/auth/login',
    signup: '/api/v1/auth/signup',
    googleLogin: '/api/v1/auth/google',
    forgotPassword: '/api/v1/auth/forgot-password',
    me: '/api/v1/user/me',
  },
  decks: {
    list: '/api/v1/decks',
    upload: '/api/v1/decks/upload',
    byId: (id: string) => `/api/v1/decks/${id}`,
    review: (id: string) => `/api/v1/decks/${id}/review`,
    export: (id: string) => `/api/v1/decks/${id}/export`,
  },
  practice: {
    sessions: '/api/v1/practice/sessions',
    byId: (id: string) => `/api/v1/practice/sessions/${id}`,
    summary: (id: string) => `/api/v1/practice/sessions/${id}/summary`,
    speech: (id: string) => `/api/v1/practice/sessions/${id}/speech`,
  },
  user: {
    profile: '/api/v1/user/profile',
    billing: '/api/v1/user/billing',
    invoices: '/api/v1/user/invoices',
    preferences: '/api/v1/user/preferences',
  },
  drills: {
    plan: '/api/v1/drills/plan',
    categories: '/api/v1/drills/categories',
  },
} as const;
