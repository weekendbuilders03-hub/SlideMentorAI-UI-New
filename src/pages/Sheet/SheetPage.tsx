import React from 'react';
import Button from '../../components/common/Button/Button';
import styles from './Sheet.module.scss';

const SheetPage: React.FC = () => (
  <div className={styles.doc}>
    <div className={styles.sheetHeader}>
      <div className={styles.brand}>
        <em>SlideMentor</em> Coaching Report
      </div>
      <h2 className={styles.sheetTitle}>Q4 Sales Strategy Final</h2>
      <p className={styles.sheetMeta}>Alex Johnson · Oct 24, 2023 · 14:22 session · Pro plan</p>
    </div>

    <div className={styles.body}>
      <div className={styles.sectionH}>Session summary</div>
      <div className={styles.statGrid}>
        {[
          { num: '82', label: 'Overall score' },
          { num: '138', label: 'Avg. wpm' },
          { num: '7', label: 'Filler words' },
        ].map((st) => (
          <div key={st.label} className={styles.stat}>
            <div className={styles.statNum}>{st.num}</div>
            <div className={styles.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.sectionH}>Coach's notes</div>
      <p className={styles.summaryText}>
        Alex delivered a strong rehearsal with consistent pacing and clear articulation on technical terms.
        The opening hook was well-timed. Key areas for improvement: reduce filler words (7 detected) and
        slow down on slides 4 and 7 where pacing exceeded 160 wpm. Vocal variety was flat on slides 3–5;
        adding pitch emphasis on key statistics will significantly boost audience retention.
      </p>
      <p className={styles.summaryText}>
        Recommended next session focus: filler word elimination drill + emphasis mapping on the financials slide.
      </p>

      <div className={styles.sheetActions}>
        <Button variant="secondary" id="sheet-share-btn">Share link</Button>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" id="sheet-print-btn">🖨 Print</Button>
          <Button variant="spotlight" id="sheet-download-btn">⬇ Download PDF</Button>
        </div>
      </div>
    </div>
  </div>
);

export default SheetPage;
