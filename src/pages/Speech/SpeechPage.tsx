import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { practiceService } from '../../api/services/practiceService';
import { cn } from '../../utils/cn';
import SessionAnalysisDetails from '../../components/analysis/SessionAnalysisDetails';
import type { BackendFullAnalysis, SpeechIndicator, TimelineSegment } from '../../types/practice';
import styles from './Speech.module.scss';

const SpeechPage: React.FC = () => {
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.session.current);
  const [indicators, setIndicators] = useState<SpeechIndicator[]>([]);
  const [timeline, setTimeline] = useState<TimelineSegment[]>([]);
  const [analysis, setAnalysis] = useState<BackendFullAnalysis | null>(null);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const sessionIdNum = typeof session?.id === 'number'
    ? session.id
    : parseInt(session?.id ?? '1', 10) || 1;

  const sessionName = session?.deckName || 'Presentation Session';

  useEffect(() => {
    practiceService.getSpeechIndicators(sessionIdNum).then(setIndicators);
    practiceService.getTimeline(sessionIdNum).then(setTimeline);
    practiceService.getFullAnalysis(sessionIdNum).then(setAnalysis).catch(() => setAnalysis(null));
  }, [sessionIdNum]);

  const maxWpm = Math.max(...timeline.map((t) => t.wpm), 1);

  return (
    <>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Speech Feedback</h2>
          <p className={styles.sub}>
            {sessionName}
            {session?.createdAt
              ? ` · ${new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : ` · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" id="export-speech-btn" onClick={() => navigate('/sheet')}>Export report</button>
          <button className="btn btn-spotlight btn-sm" id="practice-again-btn" onClick={() => navigate('/practice')}>Practice again</button>
        </div>
      </div>

      {/* Weak areas strip */}
      <div className={styles.weakStrip}>
        {indicators.filter((i) => i.scoreLabel !== 'good').map((ind) => (
          <div key={ind.id} className={cn(styles.weakCard, ind.scoreLabel === 'mid' ? styles.amber : undefined)}>
            <div className={styles.weakTop}>
              <span className={styles.weakName}>{ind.name}</span>
              <span className={cn(styles.weakScore, ind.scoreLabel === 'mid' ? styles.amberScore : undefined)}>
                {ind.score}/100
              </span>
            </div>
            <p className={styles.weakNote}>{ind.description}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className={styles.timelineWrap}>
        <h4 style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 16 }}>Pacing timeline (wpm by segment)</h4>
        <div className={styles.timeline}>
          {timeline.map((seg, i) => (
            <div key={i} className={styles.timelineCol}>
              <div className={styles.timelineVal}>{seg.wpm}</div>
              <div
                className={cn(styles.timelineBar, seg.quality !== 'good' ? styles[seg.quality] : undefined)}
                style={{ height: `${(seg.wpm / maxWpm) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className={styles.timelineLabels}>
          {timeline.map((seg, i) => (
            <div key={i} className={styles.timelineLabel}>{seg.label}</div>
          ))}
        </div>
      </div>

      <SessionAnalysisDetails analysis={analysis} />

      {/* Indicators */}
      <div className={styles.indicatorGrid}>
        {indicators.map((ind) => {
          const isOpen = expandedId === ind.id;
          return (
            <div key={ind.id} className={cn(styles.indicatorCard, isOpen ? styles.open : undefined)}>
              <div className={styles.indicatorHead} onClick={() => setExpandedId(isOpen ? null : ind.id)}
                role="button" tabIndex={0} id={`indicator-${ind.id}`}>
                <div className={styles.indicatorGlyph}>{ind.glyph}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.indicatorName}>{ind.name}</div>
                  <div className={styles.indicatorDesc}>{ind.description}</div>
                </div>
                <span className={cn('score-pill', ind.scoreLabel)}>{ind.score}/100</span>
                <span className={cn(styles.chevron, isOpen ? styles.chevronOpen : undefined)}>▼</span>
              </div>

              {/* Body */}
              <div className={cn(styles.indicatorBody, isOpen ? styles.bodyOpen : undefined)}>
                <div className={styles.bodyInner}>
                  <p className={styles.analysis}>{ind.analysis}</p>
                  <div className={styles.rec}>
                    <span>💡</span>
                    <span>{ind.recommendation}</span>
                  </div>

                  {ind.swapPairs && (
                    <div className={styles.drillBox}>
                      <div className={styles.drillTitle}>Word swap guide</div>
                      {ind.swapPairs.map((pair) => (
                        <div key={pair.old} className={styles.swapRow}>
                          <span className={styles.swapOld}>{pair.old}</span>
                          <span style={{ color: 'var(--ink-muted)' }}>→</span>
                          <span className={styles.swapNew}>{pair.replacement}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {ind.drillTitle && (
                    <div className={styles.drillBox}>
                      <div className={styles.drillTitle}>{ind.drillTitle}</div>
                      <p className={styles.drillAction}>{ind.drillAction}</p>
                    </div>
                  )}

                  {ind.scriptExample && (
                    <div className={styles.scriptBox}>{ind.scriptExample}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SpeechPage;
