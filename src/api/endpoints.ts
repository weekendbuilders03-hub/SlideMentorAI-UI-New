/**
 * All API endpoint paths as typed constants.
 * Matched to the backend Swagger spec and API handover document.
 *
 * ID types:
 *  - sessionId, slideId, suggestionId → number (backend int32)
 *  - drillId → string (backend string)
 */
export const ENDPOINTS = {
  /* ── Authentication ── */
  auth: {
    google: '/api/v1/auth/google',
  },

  /* ── User / Profile ── */
  user: {
    me: '/api/v1/user/me',
    google: '/api/v1/user/google',
    signoutAll: '/api/v1/user/signout-all',
  },

  /* ── Sessions ── */
  sessions: {
    create: '/api/v1/sessions',
    list: '/api/v1/sessions',
    byId: (id: number) => `/api/v1/sessions/${id}` as const,
    reset: (id: number) => `/api/v1/sessions/${id}/reset` as const,
    last: '/api/v1/sessions/last',
    stats: '/api/v1/sessions/stats',
    progress: '/api/v1/sessions/progress',
  },

  /* ── Slides ── */
  slides: {
    upload: '/api/v1/slides/upload',
    bySession: (sessionId: number) => `/sessions/${sessionId}/slides` as const,
    byId: (slideId: number) => `/api/v1/slides/${slideId}` as const,
    analyze: '/api/v1/slides/analyze',
  },

  /* ── Slide AI Rewrite & Suggestions ── */
  slideRewrite: {
    trigger: (slideId: number) => `/api/v1/slides/${slideId}/rewrite` as const,
    get: (slideId: number) => `/api/v1/slides/${slideId}/rewrite` as const,
    batch: '/api/v1/slides/rewrite/batch',
    acceptBatch: '/api/v1/slides/suggestions/accept-batch',
    accept: (suggestionId: number) =>
      `/api/v1/slides/suggestions/${suggestionId}/accept` as const,
    reject: (suggestionId: number) =>
      `/api/v1/slides/suggestions/${suggestionId}/reject` as const,
    modify: (suggestionId: number) =>
      `/api/v1/slides/suggestions/${suggestionId}/modify` as const,
  },

  /* ── Audio Recording ── */
  audio: {
    start: (sessionId: number) => `/api/v1/sessions/${sessionId}/audio/start` as const,
    upload: (sessionId: number) => `/api/v1/sessions/${sessionId}/audio/upload` as const,
    stop: (sessionId: number) => `/api/v1/sessions/${sessionId}/audio/stop` as const,
    get: (sessionId: number) => `/api/v1/sessions/${sessionId}/audio` as const,
  },

  /* ── Transcription ── */
  transcription: {
    process: (sessionId: number) =>
      `/api/v1/sessions/${sessionId}/transcription/process` as const,
    get: (sessionId: number) => `/api/v1/sessions/${sessionId}/transcription` as const,
  },

  /* ── Review & Filler Words ── */
  review: {
    get: (sessionId: number) => `/api/v1/sessions/${sessionId}/review` as const,
    fillerWords: (sessionId: number) =>
      `/api/v1/sessions/${sessionId}/filler-words` as const,
  },

  /* ── Analysis & Coaching ── */
  analysis: {
    full: (sessionId: number) => `/api/v1/sessions/${sessionId}/analysis` as const,
    coachingInsights: (sessionId: number) =>
      `/api/v1/sessions/${sessionId}/coaching-insights` as const,
    engagementScore: (sessionId: number) =>
      `/api/v1/sessions/${sessionId}/engagement-score` as const,
    pacing: (sessionId: number) =>
      `/api/v1/sessions/${sessionId}/pacing-analysis` as const,
  },

  /* ── Speech Indicators ── */
  speechIndicators: {
    get: (sessionId: number) =>
      `/api/v1/sessions/${sessionId}/speech-indicators` as const,
  },

  /* ── Timeline ── */
  timeline: {
    save: (sessionId: number) => `/api/v1/sessions/${sessionId}/timeline` as const,
    get: (sessionId: number) => `/api/v1/sessions/${sessionId}/timeline` as const,
  },

  /* ── Export ── */
  export: {
    pptx: (sessionId: number) => `/api/v1/sessions/${sessionId}/export/pptx` as const,
    pdf: (sessionId: number) => `/api/v1/sessions/${sessionId}/export/pdf` as const,
  },

  /* ── Usage Limits ── */
  usage: {
    check: '/api/v1/usage/check',
    consume: '/api/v1/usage/consume',
  },

  /* ── Voice Drills ── */
  drills: {
    list: '/api/v1/drills',
    byId: (drillId: string) => `/api/v1/drills/${drillId}` as const,
    submit: (drillId: string) => `/api/v1/drills/${drillId}` as const,
  },
} as const;
