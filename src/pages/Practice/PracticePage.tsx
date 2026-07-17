import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Button from '../../components/common/Button/Button';
import styles from './Practice.module.scss';

const SLIDES = [
  { id: 1, title: 'Introduction', subtitle: 'Setting the context' },
  { id: 2, title: 'Market Opportunity', subtitle: '$9.8B by 2027' },
  { id: 3, title: 'Product Features', subtitle: 'AI coaching platform' },
  { id: 4, title: 'Traction', subtitle: '3,200 active users' },
  { id: 5, title: 'Team', subtitle: 'World-class experts' },
  { id: 6, title: 'Financials', subtitle: 'Path to profitability' },
  { id: 7, title: 'Ask', subtitle: '$5M seed round' },
];

const PracticePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [fillers, setFillers] = useState(0);
  const [pauses, setPauses] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleRecording = () => {
    if (isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
      navigate('/summary');
    } else {
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((t) => {
          const next = t + 1;
          // Simulate live metrics
          setWpm(Math.round(130 + Math.sin(next / 5) * 20));
          setFillers((f) => (next % 15 === 0 ? f + 1 : f));
          setPauses((p) => (next % 30 === 0 ? p + 1 : p));
          return next;
        });
      }, 1000);
    }
    setIsRecording((r) => !r);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const slide = SLIDES[activeSlide];

  return (
    <div className={styles.shell}>
      {/* Deck strip */}
      <div className={styles.strip}>
        {SLIDES.map((sl, i) => (
          <div
            key={sl.id}
            className={cn(styles.stripThumb, i === activeSlide ? styles.active : undefined)}
            onClick={() => setActiveSlide(i)}
            role="button"
            tabIndex={0}
            id={`slide-thumb-${sl.id}`}
          >
            <div className={styles.thumbNum}>{sl.id}</div>
            <div className={styles.thumbTitle}>{sl.title}</div>
          </div>
        ))}
      </div>

      {/* Stage */}
      <div className={styles.stage}>
        <div className={styles.stagePreview}>
          <h2>{slide.title}</h2>
          <p>{slide.subtitle}</p>
        </div>

        <div className={styles.stageControls}>
          {/* Timer */}
          <div className={styles.timer}>{formatTime(elapsed)}</div>

          {/* Rec button */}
          <button
            className={cn(styles.recBtn, isRecording ? styles.recording : undefined)}
            onClick={toggleRecording}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            id="rec-btn"
          >
            {isRecording ? '⏹' : '🎙'}
          </button>

          {/* Live metrics */}
          <div className={styles.liveMetrics}>
            <div className={styles.metric}>
              <div className={styles.metricVal}>{wpm || '—'}</div>
              <div className={styles.metricLabel}>wpm</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricVal}>{fillers}</div>
              <div className={styles.metricLabel}>fillers</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricVal}>{pauses}</div>
              <div className={styles.metricLabel}>pauses</div>
            </div>
          </div>

          {/* Nav arrows */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" id="prev-slide-btn"
              disabled={activeSlide === 0}
              onClick={() => setActiveSlide((i) => Math.max(0, i - 1))}>←</Button>
            <Button variant="secondary" size="sm" id="next-slide-btn"
              disabled={activeSlide === SLIDES.length - 1}
              onClick={() => setActiveSlide((i) => Math.min(SLIDES.length - 1, i + 1))}>→</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
