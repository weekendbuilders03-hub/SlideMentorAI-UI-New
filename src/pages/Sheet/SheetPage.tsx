import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { useAppSelector } from '../../store/hooks';
import { sessionService } from '../../api/services/sessionService';
import { practiceService } from '../../api/services/practiceService';
import type { BackendFullAnalysis } from '../../types/practice';
import styles from './Sheet.module.scss';

const SheetPage: React.FC = () => {
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.session.current);
  const user = useAppSelector((state) => state.auth.user);

  const [analysis, setAnalysis] = useState<BackendFullAnalysis | null>(null);
  const [downloading, setDownloading] = useState(false);

  const sessionIdNum = typeof session?.id === 'number'
    ? session.id
    : parseInt(session?.id ?? '1', 10) || 1;

  const deckName = session?.deckName || 'Presentation Session';
  const userName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'User';
  const dateStr = session?.createdAt
    ? new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    practiceService.getFullAnalysis(sessionIdNum)
      .then(setAnalysis)
      .catch(() => setAnalysis(null));
  }, [sessionIdNum]);

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const blob = await sessionService.exportPdf(sessionIdNum);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${deckName.replace(/\s+/g, '_')}_Coaching_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('PDF export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPptx = async () => {
    try {
      setDownloading(true);
      const blob = await sessionService.exportPptx(sessionIdNum);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${deckName.replace(/\s+/g, '_')}_Coached.pptx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('PPTX export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const score = analysis?.overallScore ?? 82;
  const wpm = analysis?.averageWpm ?? 138;
  const fillers = analysis?.fillerWordCount ?? 7;

  return (
    <div className={styles.doc}>
      <div className={styles.sheetHeader}>
        <div className={styles.brand}>
          <em>SlideMentor</em> Coaching Report
        </div>
        <h2 className={styles.sheetTitle}>{deckName}</h2>
        <p className={styles.sheetMeta}>{userName} · {dateStr} · {user?.plan || 'Free'} plan</p>
      </div>

      <div className={styles.body}>
        <div className={styles.sectionH}>Session summary</div>
        <div className={styles.statGrid}>
          {[
            { num: String(score), label: 'Overall score' },
            { num: String(wpm), label: 'Avg. wpm' },
            { num: String(fillers), label: 'Filler words' },
          ].map((st) => (
            <div key={st.label} className={styles.stat}>
              <div className={styles.statNum}>{st.num}</div>
              <div className={styles.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.sectionH}>Coach's notes</div>
        {analysis?.strengths && analysis.strengths.length > 0 ? (
          <div>
            <p className={styles.summaryText}><strong>Key Strengths:</strong></p>
            <ul>
              {analysis.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className={styles.summaryText}>
            Practice session completed. Upload deck and record speech to generate AI coaching feedback notes.
          </p>
        )}

        {analysis?.improvements && analysis.improvements.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p className={styles.summaryText}><strong>Areas for Improvement:</strong></p>
            <ul>
              {analysis.improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.sheetActions}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" id="sheet-share-btn" onClick={handleDownloadPptx} disabled={downloading}>
              Export PPTX
            </Button>
            <Button variant="secondary" id="sheet-practice-btn" onClick={() => navigate('/practice')}>
              🎙 Practice with these slides
            </Button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" id="sheet-print-btn" onClick={() => window.print()}>
              🖨 Print
            </Button>
            <Button variant="spotlight" id="sheet-download-btn" onClick={handleDownloadPdf} disabled={downloading}>
              {downloading ? 'Exporting…' : '⬇ Download PDF'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetPage;
