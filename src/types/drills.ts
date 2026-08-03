/**
 * Drill & Usage types — Phase 4.
 * Backend endpoints: GET /api/v1/drills, GET /api/v1/drills/{id},
 *                   POST /api/v1/drills/{id}, GET/POST /api/v1/usage/*
 */

export interface Drill {
  id: string;
  name: string;
  description: string;
  /** Category name, used for grouping drills in the UI */
  category?: string;
  categoryTitle?: string;
  categoryGlyph?: string;
  durationMinutes?: number;
  estimatedTimeMinutes?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  difficulty?: string;
  glyph?: string;
}

export interface DrillCategory {
  id: string;
  name: string;
  glyph?: string;
  description?: string;
  drills: Drill[];
}

export interface DrillSubmitRequest {
  score: number;
}

export interface DrillSubmitResponse {
  success?: boolean;
  drillId?: string;
  score?: number;
  message?: string;
}

export interface UsageCheckResponse {
  remaining?: number;
  total?: number;
  used?: number;
  canProceed?: boolean;
}

export interface UsageConsumeResponse {
  success?: boolean;
  remaining?: number;
  message?: string;
}
