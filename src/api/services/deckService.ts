/**
 * Deck & Session Service — Real API Integration.
 * Replaces mock data with live backend endpoints mapped in endpoints.ts.
 */
import apiClient, { unwrapResponse } from '../axios';
import type { ApiResponse } from '../axios';
import { ENDPOINTS } from '../endpoints';
import { sessionService } from './sessionService';
import type {
  Deck,
  DeckSession,
  SlideReviewItem,
  BackendSession,
  BackendSlide,
  BatchRewriteSuggestion,
  ModifySuggestionRequest,
} from '../../types/deck';

export const deckService = {
  /**
   * List all presentation sessions for the user.
   * GET /api/v1/sessions
   */
  listDecks: async (): Promise<Deck[]> => {
    const { data } = await apiClient.get<ApiResponse<BackendSession[]>>(
      ENDPOINTS.sessions.list
    );
    const sessions = unwrapResponse(data) ?? [];
    return sessions.map((sess) => ({
      id: sess.sessionId,
      name: sess.title || `Presentation Session #${sess.sessionId}`,
      slideCount: sess.slidesCount ?? 0,
      duration: `${sess.presentationTimeMinutes ?? 15}:00`,
      status: sess.status === 'completed' ? 'done' : 'progress',
      lastModified: sess.createdAt ? new Date(sess.createdAt).toLocaleDateString() : 'Today',
      progress: sess.status === 'completed' ? 100 : 50,
    }));
  },

  /**
   * Upload a deck file.
   * 1. Creates a new session via POST /api/v1/sessions
   * 2. Uploads the slide file via POST /api/v1/slides/upload (multipart)
   */
  uploadDeck: async (file: File): Promise<DeckSession> => {
    // 1. Create new session
    const sessionName = file.name.replace(/\.[^.]+$/, '');
    const newSession = await sessionService.createSession({
      title: sessionName,
      audience: 'Executives',
      presentationTimeMinutes: 15,
    });

    // 2. Upload file to session
    await sessionService.uploadSlides(newSession.sessionId, file);

    return {
      id: newSession.sessionId,
      deckId: newSession.sessionId,
      deckName: newSession.title || sessionName,
      currentPhase: 1,
      audience: newSession.audience || 'Executives',
      timeMinutes: newSession.presentationTimeMinutes || 15,
      createdAt: newSession.createdAt || new Date().toISOString(),
    };
  },

  /**
   * Get slide review items for a session.
   * GET /sessions/{sessionId}/slides & POST /api/v1/slides/rewrite/batch
   */
  getReviewItems: async (
    sessionIdInput: string | number,
    audience: string,
    targetMinutes: number
  ): Promise<SlideReviewItem[]> => {
    const numericId = typeof sessionIdInput === 'number'
      ? sessionIdInput
      : parseInt(sessionIdInput, 10) || 1;

    let slides: BackendSlide[] = [];
    try {
      slides = await sessionService.getSessionSlides(numericId);
    } catch {
      slides = [];
    }

    if (!slides || slides.length === 0) {
      return [];
    }

    const rewrites: BatchRewriteSuggestion[] = await sessionService.batchRewrite({
      slideIds: slides.map((slide) => slide.id),
      audience,
      targetMinutes,
    });
    const rewriteBySlideId = new Map(rewrites.map((rewrite) => [rewrite.slideId, rewrite]));

    return slides.map((slide) => {
      const rewrite = rewriteBySlideId.get(slide.id);
      const originalContentLines = (rewrite?.originalContent || slide.content || slide.contentPreview || '')
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0);
      const status = rewrite?.status?.toLowerCase();

      return {
          id: slide.id,
          slideId: slide.id,
          suggestionId: rewrite?.suggestionId,
          slideNumber: slide.slideNumber,
          title: slide.title || `Slide ${slide.slideNumber}`,
          wordCount: slide.wordCount ?? 0,
          readTime: `${Math.ceil((slide.wordCount ?? 0) / 130)}m`,
          issues: slide.issues ?? [],
          suggestions: slide.suggestions ?? rewrite?.issuesDetected ?? [],
          originalHeadline: slide.originalHeadline || originalContentLines[0] || slide.title || '',
          originalBullets: slide.originalBullets || originalContentLines.slice(1),
          suggestedHeadline: rewrite?.suggestedHeadline || slide.suggestedHeadline || '',
          suggestedBullets: rewrite?.suggestedBullets || slide.suggestedBullets || [],
          reductionPercent: slide.reductionPercent ?? 0,
          status: status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'pending',
        };
    });
  },

  /* ── Pass-through sessionService operations ── */
  createSession: sessionService.createSession,
  uploadSlides: sessionService.uploadSlides,
  getSessionSlides: sessionService.getSessionSlides,
  analyzeSlides: sessionService.analyzeSlides,
  batchRewrite: sessionService.batchRewrite,
  getRewriteResults: sessionService.getRewriteResults,
  acceptSuggestion: sessionService.acceptSuggestion,
  acceptSuggestionsBatch: sessionService.acceptSuggestionsBatch,
  rejectSuggestion: sessionService.rejectSuggestion,
  modifySuggestion: (suggestionId: number, payload: ModifySuggestionRequest) =>
    sessionService.modifySuggestion(suggestionId, payload),
};
