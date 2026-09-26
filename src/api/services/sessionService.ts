/**
 * Session & Slides service — real API implementations using apiClient.
 * Mapped to ASP.NET Core backend endpoints in endpoints.ts.
 */
import apiClient from '../axios';
import type { ApiResponse } from '../axios';
import { unwrapResponse } from '../axios';
import { ENDPOINTS } from '../endpoints';
import type {
  BackendSession,
  BackendSlide,
  SessionSlidesResponse,
  CreateSessionRequest,
  BatchRewriteRequest,
  BatchRewriteSuggestion,
  RewriteResultResponse,
  ModifySuggestionRequest,
  SessionStatsResponse,
  ProgressResponse,
} from '../../types/deck';

export const sessionService = {
  /**
   * 1. Create Session
   * POST /api/v1/sessions
   */
  createSession: async (payload: CreateSessionRequest): Promise<BackendSession> => {
    const { data } = await apiClient.post<ApiResponse<BackendSession>>(
      ENDPOINTS.sessions.create,
      payload
    );
    return unwrapResponse(data);
  },

  /**
   * 2. Upload Slides (multipart/form-data)
   * POST /api/v1/slides/upload
   */
  uploadSlides: async (sessionId: number, file: File): Promise<BackendSlide[]> => {
    const formData = new FormData();
    formData.append('SessionId', sessionId.toString());
    formData.append('File', file);

    const { data } = await apiClient.post<ApiResponse<BackendSlide[]>>(
      ENDPOINTS.slides.upload,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return unwrapResponse(data);
  },

  /**
   * 3. Get Session Slides
   * GET /sessions/{sessionId}/slides
   */
  getSessionSlides: async (sessionId: number): Promise<BackendSlide[]> => {
    const { data } = await apiClient.get<ApiResponse<SessionSlidesResponse | BackendSlide[]>>(
      ENDPOINTS.slides.bySession(sessionId)
    );
    const payload = unwrapResponse(data);
    const slides = Array.isArray(payload) ? payload : payload.slides;
    return slides;
  },

  /**
   * 4. Analyze Slides
   * POST /api/v1/slides/analyze
   */
  analyzeSlides: async (slideId: number): Promise<any> => {
    const { data } = await apiClient.post<ApiResponse<any>>(
      ENDPOINTS.slides.analyze,
      { slideId }
    );
    return unwrapResponse(data);
  },

  /**
   * 5. Batch AI Rewrite
   * POST /api/v1/slides/rewrite/batch
   */
  batchRewrite: async (payload: BatchRewriteRequest): Promise<BatchRewriteSuggestion[]> => {
    const { data } = await apiClient.post<ApiResponse<BatchRewriteSuggestion[]>>(
      ENDPOINTS.slideRewrite.batch,
      payload
    );
    return unwrapResponse(data) ?? [];
  },

  /**
   * 6. Get Rewrite Results
   * GET /api/v1/slides/{slideId}/rewrite
   */
  getRewriteResults: async (slideId: number): Promise<RewriteResultResponse> => {
    const { data } = await apiClient.get<ApiResponse<RewriteResultResponse>>(
      ENDPOINTS.slideRewrite.get(slideId)
    );
    return unwrapResponse(data);
  },

  /**
   * 7. Accept Suggestion
   * POST /api/v1/slides/suggestions/{suggestionId}/accept
   */
  acceptSuggestion: async (suggestionId: number): Promise<void> => {
    const { data } = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.slideRewrite.accept(suggestionId)
    );
    return unwrapResponse(data);
  },

  /**
   * Accept all suggestions for a session.
   * POST /api/v1/slides/suggestions/accept-batch
   */
  acceptSuggestionsBatch: async (suggestionIds: number[]): Promise<void> => {
    const { data } = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.slideRewrite.acceptBatch,
      { suggestionIds }
    );
    return unwrapResponse(data);
  },

  /**
   * 8. Reject Suggestion
   * POST /api/v1/slides/suggestions/{suggestionId}/reject
   */
  rejectSuggestion: async (suggestionId: number): Promise<void> => {
    const { data } = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.slideRewrite.reject(suggestionId)
    );
    return unwrapResponse(data);
  },

  /**
   * 9. Modify Suggestion
   * PUT /api/v1/slides/suggestions/{suggestionId}/modify
   */
  modifySuggestion: async (
    suggestionId: number,
    payload: ModifySuggestionRequest
  ): Promise<any> => {
    const { data } = await apiClient.put<ApiResponse<any>>(
      ENDPOINTS.slideRewrite.modify(suggestionId),
      payload
    );
    return unwrapResponse(data);
  },

  /**
   * 10. Get Session Stats — aggregate KPIs for the dashboard.
   * GET /api/v1/sessions/stats
   */
  getStats: async (): Promise<SessionStatsResponse> => {
    const { data } = await apiClient.get<ApiResponse<SessionStatsResponse>>(
      ENDPOINTS.sessions.stats
    );
    return unwrapResponse(data) ?? {};
  },

  /**
   * 11. Get Progress — historical score/wpm data points.
   * GET /api/v1/sessions/progress
   */
  getProgress: async (): Promise<ProgressResponse> => {
    const { data } = await apiClient.get<ApiResponse<ProgressResponse>>(
      ENDPOINTS.sessions.progress
    );
    return unwrapResponse(data) ?? {};
  },

  /**
   * 12. Get Last Session — for the dashboard resume card.
   * GET /api/v1/sessions/last
   */
  getLastSession: async (): Promise<BackendSession | null> => {
    const { data } = await apiClient.get<ApiResponse<BackendSession>>(
      ENDPOINTS.sessions.last
    );
    return unwrapResponse(data) ?? null;
  },

  /**
   * 13. List All Sessions — for the recent-decks table.
   * GET /api/v1/sessions
   */
  listSessions: async (): Promise<BackendSession[]> => {
    const { data } = await apiClient.get<ApiResponse<BackendSession[]>>(
      ENDPOINTS.sessions.list
    );
    return unwrapResponse(data) ?? [];
  },

  /**
   * 14. Export PDF Report
   * GET /api/v1/sessions/{id}/export/pdf
   */
  exportPdf: async (sessionId: number): Promise<Blob> => {
    const response = await apiClient.get(ENDPOINTS.export.pdf(sessionId), {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * 15. Export PPTX Deck Report
   * GET /api/v1/sessions/{id}/export/pptx
   */
  exportPptx: async (sessionId: number): Promise<Blob> => {
    const response = await apiClient.get(ENDPOINTS.export.pptx(sessionId), {
      responseType: 'blob',
    });
    return response.data;
  },
};
