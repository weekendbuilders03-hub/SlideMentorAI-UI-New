/**
 * Usage service — Phase 4.
 * Backend endpoints:
 *   GET  /api/v1/usage/check    → check remaining quota
 *   POST /api/v1/usage/consume  → decrement quota (one session upload)
 *
 * NOTE: usage calls are fire-and-forget — they never block the user flow.
 * If the backend returns an error (e.g. quota exceeded), the caller
 * is responsible for deciding whether to surface that to the user.
 */
import apiClient, { unwrapResponse } from '../axios';
import type { ApiResponse } from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { UsageCheckResponse, UsageConsumeResponse } from '../../types/drills';

export const usageService = {
  /**
   * Check how many sessions the user has remaining.
   * GET /api/v1/usage/check
   */
  checkUsage: async (): Promise<UsageCheckResponse> => {
    const { data } = await apiClient.get<ApiResponse<UsageCheckResponse>>(
      ENDPOINTS.usage.check
    );
    return unwrapResponse(data) ?? {};
  },

  /**
   * Consume one session credit.
   * POST /api/v1/usage/consume
   */
  consumeUsage: async (): Promise<UsageConsumeResponse> => {
    const { data } = await apiClient.post<ApiResponse<UsageConsumeResponse>>(
      ENDPOINTS.usage.consume
    );
    return unwrapResponse(data) ?? {};
  },
};
