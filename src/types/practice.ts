export interface PracticeSession {
  id: string | number;
  deckId: string | number;
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
  id: string | number;
  sessionId: string | number;
  overallScore?: number;
  duration?: string;
  wpmAverage?: number;
  fillerWordCount?: number;
  strengths: string[];
  improvements: string[];
  analysis?: BackendFullAnalysis;
}

export type SpeechIndicatorScore = 'good' | 'mid' | 'low';

export interface SpeechIndicator {
  id: string | number;
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

/* ── Backend API DTOs for Phase 3 ── */

export interface AudioStartResponse {
  sessionId: number;
  streamId?: string;
  startedAt?: string;
  status?: string;
}

export interface AudioUploadResponse {
  sessionId: number;
  chunkId?: number;
  bytesReceived?: number;
  status?: string;
}

export interface AudioStopResponse {
  sessionId: number;
  totalDurationSeconds?: number;
  status?: string;
}

export interface TranscriptionProcessResponse {
  sessionId: number;
  transcriptText?: string;
  wordCount?: number;
  processedAt?: string;
}

export interface BackendSpeechIndicator {
  id: string | number;
  glyph?: string;
  name: string;
  description: string;
  score: number;
  scoreLabel?: 'good' | 'mid' | 'low';
  analysis: string;
  recommendation: string;
  swapPairs?: Array<{ old: string; replacement: string }>;
  drillTitle?: string;
  drillAction?: string;
  scriptExample?: string;
}

export interface BackendPacingAnalysis {
  sessionId: number;
  averageWpm: number;
  pacingScore: number;
  pacingQuality?: 'good' | 'amber' | 'coral';
  segments?: Array<{ label: string; wpm: number; quality?: 'good' | 'amber' | 'coral' }>;
}

export interface BackendCoachingInsights {
  sessionId: number;
  overallScore: number;
  duration?: string;
  strengths: string[];
  improvements: string[];
  insights?: string[];
}

export interface BackendEngagementScore {
  sessionId: number;
  engagementScore: number;
  confidenceScore?: number;
  vocalVarietyScore?: number;
}

export interface BackendSlidePacing {
  slideId: number;
  slideNumber: number;
  wordCount: number;
  startSecond: number;
  endSecond: number;
  durationSeconds: number;
  wordsPerSecond: number;
  pacing: string;
}

export interface BackendSlideEngagement {
  slideId: number;
  slideNumber: number;
  engagementScore: number;
  status: string;
  heatmapColor: string;
  reason: string;
  wordCount?: number;
  wordsPerSecond?: number;
}

export interface BackendSlideCoachingInsight {
  slideNumber: number;
  severity: string;
  title: string;
  message: string;
  recommendation: string;
}

export interface BackendFullAnalysis {
  sessionId?: number;
  overallScore?: number;
  averageWpm?: number;
  fillerWordCount?: number;
  pauseCount?: number;
  duration?: string;
  strengths?: string[];
  improvements?: string[];
  indicators?: BackendSpeechIndicator[];
  pacing?: BackendSlidePacing[];
  engagement?: BackendSlideEngagement[];
  coachingInsights?: BackendSlideCoachingInsight[];
}

export interface SaveTimelineRequest {
  slideId: number;
  slideNumber: number;
  timestampSeconds: number;
}

export interface BackendTimelineResponse {
  sessionId: number;
  segments: Array<{
    label: string;
    wpm: number;
    quality: 'good' | 'amber' | 'coral';
    slideNumber?: number;
    timestampSeconds?: number;
  }>;
}
