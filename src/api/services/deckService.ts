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
  RewriteResultResponse,
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
      id: sess.id,
      name: sess.title || `Presentation Session #${sess.id}`,
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
    try {
      await sessionService.uploadSlides(newSession.id, file);
    } catch (err) {
      console.warn('Slide upload notification:', err);
    }

    return {
      id: newSession.id,
      deckId: newSession.id,
      deckName: newSession.title || sessionName,
      currentPhase: 1,
      audience: newSession.audience || 'Executives',
      timeMinutes: newSession.presentationTimeMinutes || 15,
      createdAt: newSession.createdAt || new Date().toISOString(),
    };
  },

  /**
   * Get slide review items for a session.
   * GET /sessions/{sessionId}/slides & GET /api/v1/slides/{slideId}/rewrite
   */
  getReviewItems: async (sessionIdInput: string | number): Promise<SlideReviewItem[]> => {
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

    const reviewItems: SlideReviewItem[] = await Promise.all(
      slides.map(async (slide) => {
        let rewrite: Partial<RewriteResultResponse> = {};
        try {
          rewrite = await sessionService.getRewriteResults(slide.id);
        } catch {
          // No rewrite generated yet for this slide
        }

        return {
          id: slide.id,
          slideId: slide.id,
          suggestionId: rewrite.suggestionId,
          slideNumber: slide.slideNumber,
          title: slide.title || `Slide ${slide.slideNumber}`,
          wordCount: slide.wordCount ?? 0,
          readTime: `${Math.ceil((slide.wordCount ?? 0) / 130)}m`,
          issues: slide.issues ?? [],
          originalHeadline: rewrite.originalHeadline || slide.originalHeadline || slide.title || '',
          originalBullets: rewrite.originalBullets || slide.originalBullets || [],
          suggestedHeadline: rewrite.suggestedHeadline || slide.suggestedHeadline || '',
          suggestedBullets: rewrite.suggestedBullets || slide.suggestedBullets || [],
          reductionPercent: rewrite.reductionPercent ?? slide.reductionPercent ?? 0,
          status: rewrite.status || 'pending',
        };
      })
    );

    return reviewItems;
  },

  /* ── Pass-through sessionService operations ── */
  createSession: sessionService.createSession,
  uploadSlides: sessionService.uploadSlides,
  getSessionSlides: sessionService.getSessionSlides,
  analyzeSlides: sessionService.analyzeSlides,
  batchRewrite: sessionService.batchRewrite,
  getRewriteResults: sessionService.getRewriteResults,
  acceptSuggestion: sessionService.acceptSuggestion,
  rejectSuggestion: sessionService.rejectSuggestion,
  modifySuggestion: (suggestionId: number, payload: ModifySuggestionRequest) =>
    sessionService.modifySuggestion(suggestionId, payload),
};
