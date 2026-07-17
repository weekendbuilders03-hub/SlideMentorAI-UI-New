export interface PracticeSession {
  id: string;
  deckId: string;
  deckName: string;
  totalSlides: number;
  currentSlide: number;
  isRecording: boolean;
  elapsedSeconds: number;
  wpm: number;
  fillerCount: number;
  pauseCount: number;
}

export interface PracticeSummary {
  id: string;
  sessionId: string;
  overallScore: number;
  duration: string;
  wpmAverage: number;
  fillerWordCount: number;
  strengths: string[];
  improvements: string[];
}

export type SpeechIndicatorScore = 'good' | 'mid' | 'low';

export interface SpeechIndicator {
  id: string;
  glyph: string;
  name: string;
  description: string;
  score: number;
  scoreLabel: SpeechIndicatorScore;
  analysis: string;
  recommendation: string;
  swapPairs?: Array<{ old: string; replacement: string }>;
  drillTitle?: string;
  drillAction?: string;
  scriptExample?: string;
}

export interface TimelineSegment {
  label: string;
  wpm: number;
  quality: 'good' | 'amber' | 'coral';
}
