import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { practiceService } from '../../api/services/practiceService';
import SessionAnalysisDetails from '../../components/analysis/SessionAnalysisDetails';
import Button from '../../components/common/Button/Button';
import type { PracticeSummary } from '../../types/practice';
import styles from './Summary.module.scss';

const SummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.session.current);
  const user = useAppSelector((state) => state.auth.user);
  const [summary, setSummary] = useState<PracticeSummary | null>(null);

  const sessionIdNum = typeof session?.id === 'number'
    ? session.id
    : parseInt(session?.id ?? '1', 10) || 1;

  useEffect(() => {
    practiceService.getSummary(sessionIdNum).then(setSummary);
  }, [sessionIdNum]);

  const score = summary?.overallScore;
  const pct = `${score}%`;
  const firstName = user?.firstName || 'there';

  // Render coaching lists only when the backend provides real data.
  // Empty arrays render nothing — there are no hardcoded coaching bullets.
  const strengths = summary?.strengths ?? [];
  const improvements = summary?.improvements ?? [];

  return (
    <>
      {/* Hero */}
      <div className={styles.hero}>
        {typeof score === 'number' && (
          <div className={styles.scoreRing}
            style={{ background: `conic-gradient(var(--teal) 0% ${pct}, var(--surface-sunken) ${pct} 100%)` }}>
            <div className={styles.scoreInner}>
              <span className={styles.scoreNum}>{score}</span>
              <span className={styles.scoreLabel}>/ 100</span>
            </div>
          </div>
        )}
        <div>
          <h2 className={styles.title}>
            {typeof score === 'number' ? `Great session, ${firstName}!` : `Session analysis, ${firstName}`}
          </h2>
          <p className={styles.sub}>
            {typeof score === 'number'
              ? <>You scored <strong>{score}/100</strong> for this session.</>
              : 'Per-slide feedback from this session is ready.'}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Button variant="spotlight" id="view-feedback-btn" onClick={() => navigate('/speech')}>
              View full feedback →
            </Button>
            <Button variant="secondary" id="practice-again-btn" onClick={() => navigate('/practice')}>
              Practice again
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {(strengths.length > 0 || improvements.length > 0) && (
        <div className={styles.grid}>
          {strengths.length > 0 && (
            <div className={styles.card}>
              <h4>Strengths</h4>
              <ul className={styles.list}>
                {strengths.map((strength, index) => (
                  <li key={index} className={styles.good}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          {improvements.length > 0 && (
            <div className={styles.card}>
              <h4>Areas to improve</h4>
              <ul className={styles.list}>
                {improvements.map((improvement, index) => (
                  <li key={index} className={styles.improve}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <SessionAnalysisDetails analysis={summary?.analysis ?? null} />

      {/* Next steps */}
      <div className={styles.nextCard}>
        <div>
          <div className={styles.nextTitle}>Recommended next steps</div>
          <div className={styles.nextSub}>Based on today's session</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" id="view-drills-btn" onClick={() => navigate('/drills')}
            style={{ color: '#edebf5', borderColor: 'rgba(237,235,245,0.3)' }}>
            Voice drills
          </Button>
          <Button variant="spotlight" id="export-sheet-btn" onClick={() => navigate('/sheet')}>
            Export report
          </Button>
        </div>
      </div>
    </>
  );
};

export default SummaryPage;
