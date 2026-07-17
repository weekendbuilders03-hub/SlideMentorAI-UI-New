/**
 * Practice service — placeholder implementations.
 */
import type { PracticeSummary, SpeechIndicator, TimelineSegment } from '../../types/practice';

const MOCK_SUMMARY: PracticeSummary = {
  id: 'sum1',
  sessionId: 'sess1',
  overallScore: 82,
  duration: '14:22',
  wpmAverage: 138,
  fillerWordCount: 7,
  strengths: [
    'Consistent pacing across all slides',
    'Clear articulation on technical terms',
    'Strong opening hook delivery',
    'Effective use of pauses after key points',
  ],
  improvements: [
    'Reduce filler words ("um", "uh") — 7 instances detected',
    'Slow down on slides 4 and 7 — slightly rushed',
    'Add vocal variety to keep audience engaged',
  ],
};

const MOCK_INDICATORS: SpeechIndicator[] = [
  {
    id: 'ind1',
    glyph: '🎯',
    name: 'Pacing',
    description: 'Words per minute consistency',
    score: 88,
    scoreLabel: 'good',
    analysis:
      'Your pacing is strong overall at 138 wpm. Slides 4 and 7 were slightly above target (168 wpm). The audience tends to lose information above 160 wpm for dense technical content.',
    recommendation:
      'Add a deliberate 1-second pause after each key statistic on slides 4 and 7. This gives the audience time to process before you continue.',
    drillTitle: 'Statistic Anchor Drill',
    drillAction:
      'Say each of your key data points aloud, then pause for 2 seconds before continuing. Repeat 5 times.',
    scriptExample:
      '"The market is growing at 18.4% annually. [pause] That means by 2027 we\'re looking at a $9.8 billion opportunity."',
  },
  {
    id: 'ind2',
    glyph: '✂️',
    name: 'Filler Words',
    description: '"Um", "uh", "like" usage',
    score: 64,
    scoreLabel: 'mid',
    analysis:
      'You used 7 filler words across the 14-minute session — mostly "um" (5×) and "uh" (2×). These appeared most frequently during transitions between slides 2→3 and 6→7.',
    recommendation:
      'Replace fillers with a conscious pause. Silence feels professional; fillers undermine credibility with executive audiences.',
    swapPairs: [
      { old: '"um, so what this means is..."', replacement: '"What this means is..."' },
      { old: '"uh, the next point..."', replacement: '"The next point..."' },
      { old: '"like, basically..."', replacement: '"Essentially..."' },
    ],
  },
  {
    id: 'ind3',
    glyph: '📢',
    name: 'Vocal Variety',
    description: 'Pitch, energy, and emphasis',
    score: 71,
    scoreLabel: 'mid',
    analysis:
      'Your pitch range is slightly flat on slides 3–5. Monotone delivery reduces audience engagement and makes it harder for listeners to identify key points.',
    recommendation: 'Emphasise one word per key sentence by raising your pitch slightly or slowing down.',
    drillTitle: 'Emphasis Mapping Drill',
    drillAction: 'Underline the ONE word in each bullet point you want to stress, then practice saying it louder.',
    scriptExample: '"This is the FASTEST growing segment in enterprise productivity."',
  },
  {
    id: 'ind4',
    glyph: '⏸️',
    name: 'Pause Usage',
    description: 'Strategic use of silence',
    score: 91,
    scoreLabel: 'good',
    analysis:
      'Excellent pause usage — you naturally paused at 8 of 9 expected transition points. Pauses averaged 1.2 seconds which is within the ideal 1–2 second range.',
    recommendation: 'Keep doing what you\'re doing. Consider a slightly longer pause (1.5–2s) before your closing call-to-action.',
  },
];

const MOCK_TIMELINE: TimelineSegment[] = [
  { label: 'Intro\n0:00', wpm: 130, quality: 'good' },
  { label: 'Market\n2:00', wpm: 142, quality: 'good' },
  { label: 'Product\n5:00', wpm: 168, quality: 'amber' },
  { label: 'Traction\n8:00', wpm: 155, quality: 'amber' },
  { label: 'Team\n11:00', wpm: 125, quality: 'good' },
  { label: 'Close\n13:00', wpm: 138, quality: 'good' },
];

export const practiceService = {
  getSummary: async (_sessionId: string): Promise<PracticeSummary> => {
    return Promise.resolve(MOCK_SUMMARY);
  },

  getSpeechIndicators: async (_sessionId: string): Promise<SpeechIndicator[]> => {
    return Promise.resolve(MOCK_INDICATORS);
  },

  getTimeline: async (_sessionId: string): Promise<TimelineSegment[]> => {
    return Promise.resolve(MOCK_TIMELINE);
  },
};
