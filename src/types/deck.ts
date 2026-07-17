export interface Deck {
  id: string;
  name: string;
  slideCount: number;
  duration: string;
  status: 'done' | 'progress' | 'draft';
  lastModified: string;
  progress?: number;
}

export interface DeckSession {
  id: string;
  deckId: string;
  deckName: string;
  currentPhase: 1 | 2 | 3 | 4;
  audience: string;
  timeMinutes: number;
  createdAt: string;
}

export interface SlideReviewItem {
  id: string;
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
  status: 'pending' | 'accepted' | 'skipped';
}

export interface SlideIssue {
  type: 'coral' | 'amber';
  label: string;
}
