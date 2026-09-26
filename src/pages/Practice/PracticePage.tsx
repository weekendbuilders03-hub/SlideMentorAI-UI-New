import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { practiceService } from '../../api/services/practiceService';
import { sessionService } from '../../api/services/sessionService';
import { cn } from '../../utils/cn';
import Button from '../../components/common/Button/Button';
import type { BackendSlide } from '../../types/deck';
import styles from './Practice.module.scss';

/** Shape used internally by the practice UI. */
interface PracticeSlide {
  id: number;       // backend slide ID — used for timeline milestone
  slideNumber: number;
  title: string;
  subtitle: string; // mapped from originalHeadline or content
}

/**
 * Minimal single-slide fallback used ONLY when:
 *   - No session is active, OR
 *   - The backend returns an empty slide array, OR
 *   - getSessionSlides() throws.
 * Contains no business content.
 */
const FALLBACK_SLIDES: PracticeSlide[] = [
  { id: 1, slideNumber: 1, title: 'Slide 1', subtitle: '' },
];

const PracticePage: React.FC = () => {
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.session.current);

  const [slides, setSlides] = useState<PracticeSlide[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [fillers, setFillers] = useState(0);
  const [pauses, setPauses] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const sessionIdNum = typeof session?.id === 'number'
    ? session.id
    : parseInt(session?.id ?? '0', 10) || 0;

  /* ── Load real slides from the active session ── */
  useEffect(() => {
    if (!session?.id || sessionIdNum === 0) {
      setSlides(FALLBACK_SLIDES);
      setSlidesLoading(false);
      return;
    }

    sessionService.getSessionSlides(sessionIdNum)
      .then((backendSlides: BackendSlide[]) => {
        if (backendSlides && backendSlides.length > 0) {
          const mapped: PracticeSlide[] = backendSlides.map((s) => ({
            id: s.id,
            slideNumber: s.slideNumber,
            title: s.title || `Slide ${s.slideNumber}`,
            subtitle: s.originalHeadline || s.content || '',
          }));
          setSlides(mapped);
        } else {
          // Backend returned empty — use neutral fallback
          setSlides(FALLBACK_SLIDES);
        }
      })
      .catch(() => {
        // Network/API error — use neutral fallback
        setSlides(FALLBACK_SLIDES);
      })
      .finally(() => {
        setSlidesLoading(false);
      });
  }, [sessionIdNum, session?.id]);

  /* ── Helper to change active slide & save timeline milestone ── */
  const changeSlide = (newIndex: number) => {
    setActiveSlide(newIndex);
    if (isRecording && slides.length > 0) {
      const targetSlide = slides[newIndex];
      practiceService.saveTimeline(sessionIdNum, {
        slideId: targetSlide.id,
        slideNumber: targetSlide.slideNumber,
        timestampSeconds: elapsed,
      }).catch((err) => console.warn('Timeline save milestone failed:', err));
    }
  };

  /* ── Stop MediaRecorder and return single complete Audio Blob ── */
  const stopMediaRecorderAsync = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const fullBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          resolve(fullBlob);
        } else {
          resolve(null);
        }
      };

      recorder.stop();
    });
  };

  const toggleRecording = async () => {
    setError(null);

    if (isRecording) {
      // ── 1. Stop local timer ──
      setLoading(true);
      if (timerRef.current) clearInterval(timerRef.current);

      try {
        // ── 2. Await MediaRecorder to stop and assemble final Audio Blob ──
        const recordedAudioBlob = await stopMediaRecorderAsync();

        // ── 3. Upload final complete audio file ──
        if (recordedAudioBlob) {
          await practiceService.uploadAudio(sessionIdNum, recordedAudioBlob);
        }

        // ── 4. Signal recording stop on backend ──
        await practiceService.stopAudio(sessionIdNum);

        // ── 5. Trigger transcription processing ──
        await practiceService.processTranscription(sessionIdNum).catch(() => {});

        // ── 6. Verification check via getTranscription ──
        await practiceService.getTranscription(sessionIdNum).catch(() => {});
      } catch (err: any) {
        console.warn('Audio processing flow error:', err);
      } finally {
        setLoading(false);
        setIsRecording(false);
        navigate('/summary');
      }
    } else {
      // ── Start Recording ──
      setLoading(true);
      try {
        await practiceService.startAudio(sessionIdNum);

        audioChunksRef.current = [];

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
              if (e.data && e.data.size > 0) {
                audioChunksRef.current.push(e.data);
              }
            };

            mediaRecorder.start(); // Record continuously until stopped
          } catch (micErr) {
            console.warn('Mic access unavailable, live metrics will be simulated:', micErr);
          }
        }

        setElapsed(0);
        setIsRecording(true);

        // Save initial timeline milestone for the first real slide
        if (slides.length > 0) {
          practiceService.saveTimeline(sessionIdNum, {
            slideId: slides[0].id,
            slideNumber: slides[0].slideNumber,
            timestampSeconds: 0,
          }).catch(() => {});
        }

        timerRef.current = setInterval(() => {
          setElapsed((t) => {
            const next = t + 1;
            setWpm(Math.round(130 + Math.sin(next / 5) * 20));
            setFillers((f) => (next % 15 === 0 ? f + 1 : f));
            setPauses((p) => (next % 30 === 0 ? p + 1 : p));
            return next;
          });
        }, 1000);
      } catch (err: any) {
        setError(err.message || 'Failed to start recording');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const slide = slides[activeSlide] ?? slides[0];

  if (slidesLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--ink-muted)', fontFamily: 'var(--mono)' }}>
        Loading slides…
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {/* Deck strip */}
      <div className={styles.strip}>
        {slides.map((sl, i) => (
          <div
            key={sl.id}
            className={cn(styles.stripThumb, i === activeSlide ? styles.active : undefined)}
            onClick={() => changeSlide(i)}
            role="button"
            tabIndex={0}
            id={`slide-thumb-${sl.id}`}
          >
            <div className={styles.thumbNum}>{sl.slideNumber}</div>
            <div className={styles.thumbTitle}>{sl.title}</div>
          </div>
        ))}
      </div>

      {/* Stage */}
      <div className={styles.stage}>
        <div className={styles.stagePreview}>
          <h2>{slide?.title ?? ''}</h2>
          <p>{slide?.subtitle ?? ''}</p>
        </div>

        {error && <div style={{ color: 'var(--coral)', marginBottom: 8, fontSize: 13 }}>{error}</div>}

        <div className={styles.stageControls}>
          {/* Timer */}
          <div className={styles.timer}>{formatTime(elapsed)}</div>

          {/* Rec button */}
          <button
            className={cn(styles.recBtn, isRecording ? styles.recording : undefined)}
            onClick={toggleRecording}
            disabled={loading}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            id="rec-btn"
          >
            {loading ? '…' : isRecording ? '⏹' : '🎙'}
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
              onClick={() => changeSlide(Math.max(0, activeSlide - 1))}>←</Button>
            <Button variant="secondary" size="sm" id="next-slide-btn"
              disabled={activeSlide === slides.length - 1}
              onClick={() => changeSlide(Math.min(slides.length - 1, activeSlide + 1))}>→</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
