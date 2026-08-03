export interface Deck {
  id: number | string;
  name: string;
  slideCount: number;
  duration: string;
  status: 'done' | 'progress' | 'draft';
  lastModified: string;
  progress?: number;
}

export interface DeckSession {
  id: number | string;
  deckId?: number | string;
  deckName: string;
  currentPhase: 1 | 2 | 3 | 4;
  audience: string;
  timeMinutes: number;
  createdAt: string;
}

export interface SlideIssue {
  type: 'coral' | 'amber';
  label: string;
}

export interface SlideReviewItem {
  id: number | string;
  slideId?: number;
  suggestionId?: number;
  slideNumber: number;
  title: string;
  wordCount: number;
  readTime: string;
  issues: SlideIssue[];
  originalHeadline: string;
  originalBullets: string[];
  suggestedHeadline: string;
  suggestedBullets: string[];
  reductionPercent: number;
  status: 'pending' | 'accepted' | 'skipped' | 'rejected';
}

/* ── Backend API DTOs ── */

export interface CreateSessionRequest {
  title?: string;
  audience?: string;
  presentationTimeMinutes?: number;
}

export interface BackendSession {
  id: number;
  title: string;
  audience: string;
  presentationTimeMinutes: number;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  slidesCount?: number;
}

export interface BackendSlide {
  id: number;
  sessionId: number;
  slideNumber: number;
  title: string;
  content?: string;
  wordCount: number;
  estimatedReadTimeSeconds?: number;
  issues?: Array<{ type: 'coral' | 'amber'; label: string }>;
  originalHeadline?: string;
  originalBullets?: string[];
  suggestedHeadline?: string;
  suggestedBullets?: string[];
  reductionPercent?: number;
}

export interface BatchRewriteRequest {
  sessionId: number;
  slideIds?: number[];
}

export interface RewriteResultResponse {
  suggestionId: number;
  slideId: number;
  originalHeadline: string;
  originalBullets: string[];
  suggestedHeadline: string;
  suggestedBullets: string[];
  reductionPercent: number;
  status: 'pending' | 'accepted' | 'rejected' | 'skipped';
}

export interface ModifySuggestionRequest {
  suggestedHeadline: string;
  suggestedBullets: string[];
}

/* ── Session Stats & Progress DTOs (Phase 4) ── */

export interface SessionStatsResponse {
  totalSessions?: number;
  sessionsCompleted?: number;
  averageScore?: number;
  totalFillerWords?: number;
  averageFillerWords?: number;
  averageWpm?: number;
  lastSessionScore?: number;
  improvement?: number;
}

export interface ProgressDataPoint {
  date?: string;
  score?: number;
  wpm?: number;
  sessionId?: number;
}

export interface ProgressResponse {
  sessions?: ProgressDataPoint[];
  improvement?: number;
  trend?: string;
}
