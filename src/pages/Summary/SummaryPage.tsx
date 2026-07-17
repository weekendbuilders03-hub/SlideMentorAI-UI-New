import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import styles from './Summary.module.scss';

const STRENGTHS = [
  'Consistent pacing across all slides',
  'Clear articulation on technical terms',
  'Strong opening hook delivery',
  'Effective use of pauses after key points',
];

const IMPROVEMENTS = [
  'Reduce filler words ("um", "uh") — 7 instances',
  'Slow down on slides 4 and 7',
  'Add vocal variety to key sections',
];

const SummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const score = 82;
  const pct = `${score}%`;

  return (
    <>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.scoreRing}
          style={{ background: `conic-gradient(var(--teal) 0% ${pct}, var(--surface-sunken) ${pct} 100%)` }}>
          <div className={styles.scoreInner}>
            <span className={styles.scoreNum}>{score}</span>
            <span className={styles.scoreLabel}>/ 100</span>
          </div>
        </div>
        <div>
          <h2 className={styles.title}>Great session, Alex!</h2>
          <p className={styles.sub}>
            You scored <strong>{score}/100</strong> — up 6 points from your last session.
            Your pacing and pausing were standout strengths today.
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
      <div className={styles.grid}>
        <div className={styles.card}>
          <h4>Strengths</h4>
          <ul className={styles.list}>
            {STRENGTHS.map((s) => (
              <li key={s} className={styles.good}>{s}</li>
            ))}
          </ul>
        </div>
        <div className={styles.card}>
          <h4>Areas to improve</h4>
          <ul className={styles.list}>
            {IMPROVEMENTS.map((s) => (
              <li key={s} className={styles.improve}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

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
