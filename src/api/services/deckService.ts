/**
 * Deck service — placeholder implementations.
 * Replace with real `apiClient` calls when the backend is ready.
 */
import type { Deck, DeckSession, SlideReviewItem } from '../../types/deck';

const MOCK_DECKS: Deck[] = [
  {
    id: 'd1',
    name: 'Investor Pitch Deck v2',
    slideCount: 14,
    duration: '18:32',
    status: 'done',
    lastModified: 'Oct 24, 2023',
    progress: 100,
  },
  {
    id: 'd2',
    name: 'Q4 Sales Strategy Final',
    slideCount: 10,
    duration: '12:45',
    status: 'progress',
    lastModified: 'Oct 22, 2023',
    progress: 62,
  },
  {
    id: 'd3',
    name: 'Team Sync — Project Alpha',
    slideCount: 8,
    duration: '12:00',
    status: 'done',
    lastModified: 'Oct 19, 2023',
    progress: 100,
  },
];

const MOCK_REVIEW_ITEMS: SlideReviewItem[] = [
  {
    id: 'r1',
    slideNumber: 1,
    title: 'Market Opportunity',
    wordCount: 156,
    readTime: '1m 8s',
    issues: [
      { type: 'coral', label: '3 dense bullets' },
      { type: 'amber', label: 'Jargon detected' },
    ],
    originalHeadline: 'The Global Market for AI-Driven Presentation Tools Is Expanding Rapidly',
    originalBullets: [
      'TAM of $4.2B in 2023 expanding to $9.8B by 2027 at 18.4% CAGR',
      'Enterprise segment capturing 67% of spend driven by remote-work adoption',
      'Key verticals: financial services, healthcare, SaaS with >40% penetration',
    ],
    suggestedHeadline: '$9.8B Market by 2027 — We\'re Positioned at the Centre',
    suggestedBullets: [
      '18.4% CAGR — fastest-growing enterprise productivity segment',
      '67% of spend in enterprise; SaaS, FinServ, Health lead',
      'Remote-work tailwind accelerating adoption',
    ],
    reductionPercent: 31,
    status: 'pending',
  },
  {
    id: 'r2',
    slideNumber: 3,
    title: 'Product Features',
    wordCount: 88,
    readTime: '0m 48s',
    issues: [{ type: 'amber', label: 'Weak opener' }],
    originalHeadline: 'Our Platform Features',
    originalBullets: [
      'Real-time AI feedback on pacing and filler words',
      'Slide content analysis with one-click editing',
      'Practice mode with recording and playback',
    ],
    suggestedHeadline: 'Present Confidently — AI Coaches You in Real Time',
    suggestedBullets: [
      'Instant pacing & filler-word alerts mid-practice',
      'One-click slide edits from AI suggestions',
      'Record → Review → Improve loop in minutes',
    ],
    reductionPercent: 12,
    status: 'pending',
  },
];

export const deckService = {
  listDecks: async (): Promise<Deck[]> => {
    // TODO: const { data } = await apiClient.get<Deck[]>(ENDPOINTS.decks.list);
    return Promise.resolve(MOCK_DECKS);
  },

  uploadDeck: async (_file: File): Promise<DeckSession> => {
    // TODO: upload multipart/form-data and return session
    return Promise.resolve({
      id: 'sess1',
      deckId: 'd_new',
      deckName: _file.name.replace(/\.[^.]+$/, ''),
      currentPhase: 1,
      audience: 'Executives',
      timeMinutes: 15,
      createdAt: new Date().toISOString(),
    });
  },

  getReviewItems: async (_deckId: string): Promise<SlideReviewItem[]> => {
    // TODO: const { data } = await apiClient.get(ENDPOINTS.decks.review(_deckId));
    return Promise.resolve(MOCK_REVIEW_ITEMS);
  },
};
