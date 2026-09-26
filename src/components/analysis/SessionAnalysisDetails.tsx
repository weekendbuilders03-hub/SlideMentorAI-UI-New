import React from 'react';
import { cn } from '../../utils/cn';
import type { BackendFullAnalysis } from '../../types/practice';
import styles from './SessionAnalysisDetails.module.scss';

interface SessionAnalysisDetailsProps {
  analysis: BackendFullAnalysis | null;
}

const formatClock = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

const SessionAnalysisDetails: React.FC<SessionAnalysisDetailsProps> = ({ analysis }) => {
  const pacing = analysis?.pacing ?? [];
  const engagement = analysis?.engagement ?? [];
  const coachingInsights = analysis?.coachingInsights ?? [];

  if (pacing.length === 0 && engagement.length === 0 && coachingInsights.length === 0) {
    return null;
  }

  return (
    <div>
      {pacing.length > 0 && (
        <section className={styles.section} aria-labelledby="slide-pacing-heading">
          <h3 className={styles.title} id="slide-pacing-heading">Pacing by slide</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Slide</th>
                  <th>Words</th>
                  <th>Time on slide</th>
                  <th>Pacing</th>
                  <th>Words/sec</th>
                </tr>
              </thead>
              <tbody>
                {pacing.map((item) => (
                  <tr key={item.slideId}>
                    <td>Slide {item.slideNumber}</td>
                    <td>{item.wordCount}</td>
                    <td>
                      {formatClock(item.startSecond)}–{formatClock(item.endSecond)}
                      <span className={styles.subtext}> · {item.durationSeconds}s</span>
                    </td>
                    <td>{item.pacing}</td>
                    <td>{item.wordsPerSecond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {engagement.length > 0 && (
        <section className={styles.section} aria-labelledby="slide-engagement-heading">
          <h3 className={styles.title} id="slide-engagement-heading">Engagement by slide</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Slide</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Words/sec</th>
                  <th>Analysis</th>
                </tr>
              </thead>
              <tbody>
                {engagement.map((item) => (
                  <tr key={item.slideId}>
                    <td>Slide {item.slideNumber}</td>
                    <td>{item.engagementScore}/100</td>
                    <td>
                      <span className={cn(
                        styles.status,
                        item.heatmapColor === 'green'
                          ? styles.statusGreen
                          : item.heatmapColor === 'amber'
                            ? styles.statusAmber
                            : styles.statusCoral
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.wordsPerSecond ?? '—'}</td>
                    <td>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {coachingInsights.length > 0 && (
        <section className={styles.section} aria-labelledby="coaching-insights-heading">
          <h3 className={styles.title} id="coaching-insights-heading">Coaching insights</h3>
          <div className={styles.insightList}>
            {coachingInsights.map((insight, index) => (
              <article className={styles.insightRow} key={`${insight.slideNumber}-${insight.title}-${index}`}>
                <div className={styles.insightMeta}>
                  <span>Slide {insight.slideNumber}</span>
                  <span className={cn(
                    styles.severity,
                    insight.severity.toLowerCase() === 'high' ? styles.severityHigh : styles.severityMedium
                  )}>
                    {insight.severity}
                  </span>
                </div>
                <div className={styles.insightContent}>
                  <h4>{insight.title}</h4>
                  <p>{insight.message}</p>
                  <p className={styles.recommendation}>{insight.recommendation}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SessionAnalysisDetails;