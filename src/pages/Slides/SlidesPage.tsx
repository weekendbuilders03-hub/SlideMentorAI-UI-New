import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { advancePhase, setAudience, setTimeMinutes, setSession } from '../../store/slices/sessionSlice';
import { extractApiError } from '../../api/axios';
import { deckService } from '../../api/services/deckService';
import { usageService } from '../../api/services/usageService';
import Button from '../../components/common/Button/Button';
import { cn } from '../../utils/cn';
import type { SlideReviewItem } from '../../types/deck';
import s from './Slides.module.scss';

/* ─────────────────────────────────────────────────────────── */
/* Step indicator */
interface StepProps { num: number; label: string; state: 'active' | 'done' | 'idle'; }
const Step: React.FC<StepProps> = ({ num, label, state }) => (
  <div className={cn('step', state)}>
    <span className="step-num">{state === 'done' ? '✓' : num}</span>
    <span>{label}</span>
  </div>
);

const STEPS = ['Upload', 'Setup', 'Review', 'Export'];

/* ─────────────────────────────────────────────────────────── */
const SlidesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.session.current);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audience, setAudienceLocal] = useState('Executives');
  const [timeMinutes, setTimeLocal] = useState(15);
  const [reviewItems, setReviewItems] = useState<SlideReviewItem[]>([]);
  const [acceptingSuggestionIds, setAcceptingSuggestionIds] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPhase = session?.currentPhase ?? phase;

  const stepState = (n: number): 'active' | 'done' | 'idle' => {
    if (currentPhase > n) return 'done';
    if (currentPhase === n) return 'active';
    return 'idle';
  };

  /* ── Upload handlers ── */
  const handleFile = async (file: File) => {
    if (!file || isUploading) return;
    setIsUploading(true);
    setUploadError(null);
    setFileName(file.name);
    try {
      usageService.consumeUsage().catch(() => {});
      const sess = await deckService.uploadDeck(file);
      dispatch(setSession(sess));
      goToPhase(2);
    } catch (err) {
      setUploadError(`Upload failed: ${extractApiError(err)}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  /* ── Real API processing (phase 3) ── */
  const startProcessing = () => {
    goToPhase(3);
    dispatch(setAudience(audience));
    dispatch(setTimeMinutes(timeMinutes));

    const sessionIdNum = typeof session?.id === 'number'
      ? session.id
      : parseInt(session?.id ?? '1', 10) || 1;

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);

        deckService.getReviewItems(sessionIdNum, audience, timeMinutes)
          .then((items) => {
            setReviewItems(items);
            goToPhase(4);
          })
          .catch(() => {
            setReviewItems([]);
            goToPhase(4);
          });
      }
    }, 300);
  };

  const handleAcceptSuggestion = async (item: SlideReviewItem) => {
    const suggestionId = item.suggestionId;
    if (
      typeof suggestionId !== 'number' ||
      item.status === 'accepted' ||
      acceptingSuggestionIds.includes(suggestionId)
    ) {
      return;
    }
    setAcceptingSuggestionIds((previous) => [...previous, suggestionId]);
    try {
      await deckService.acceptSuggestion(suggestionId);
    } catch (err) {
      const message = extractApiError(err);
      if (message.toLowerCase().includes('already been accepted')) {
        setReviewItems((previous) =>
          previous.map((reviewItem) =>
            reviewItem.id === item.id ? { ...reviewItem, status: 'accepted' } : reviewItem
          )
        );
      } else {
        console.warn('Accept suggestion failed:', err);
      }
      return;
    } finally {
      setAcceptingSuggestionIds((previous) => previous.filter((id) => id !== suggestionId));
    }
    setReviewItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'accepted' } : i))
    );
  };

  const handleRejectSuggestion = async (item: SlideReviewItem) => {
    if (typeof item.suggestionId !== 'number') {
      return;
    }
    try {
      await deckService.rejectSuggestion(item.suggestionId);
    } catch (err) {
      console.warn('Reject suggestion failed:', err);
      return;
    }
    setReviewItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'skipped' } : i))
    );
  };

  const handleAcceptAll = async () => {
    const suggestionIds = reviewItems
      .filter((item) => item.status !== 'accepted')
      .map((item) => item.suggestionId)
      .filter((suggestionId): suggestionId is number =>
        typeof suggestionId === 'number' && !acceptingSuggestionIds.includes(suggestionId)
      );

    if (suggestionIds.length === 0) return;
    setAcceptingSuggestionIds((previous) => [...new Set([...previous, ...suggestionIds])]);

    try {
      await deckService.acceptSuggestionsBatch(suggestionIds);
      setReviewItems((previous) =>
        previous.map((item) =>
          suggestionIds.includes(item.suggestionId ?? -1)
            ? { ...item, status: 'accepted' }
            : item
        )
      );
    } catch (err) {
      console.warn('Accept all suggestions failed:', err);
    } finally {
      setAcceptingSuggestionIds((previous) =>
        previous.filter((id) => !suggestionIds.includes(id))
      );
    }
  };

  const goToPhase = (n: 1 | 2 | 3 | 4) => {
    setPhase(n);
    dispatch(advancePhase());
  };

  const AUDIENCE_OPTIONS = ['Executives', 'Investors', 'Technical', 'General public', 'Sales team'];
  const TIME_OPTIONS = [5, 10, 15, 20, 30];
  const hasAcceptableSuggestions = reviewItems.some(
    (item) => item.status !== 'accepted' && typeof item.suggestionId === 'number'
  );

  return (
    <>
      {/* Steps */}
      <div className="steps">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <Step num={i + 1} label={label} state={stepState(i + 1)} />
            {i < STEPS.length - 1 && <div className="step-line" />}
          </React.Fragment>
        ))}
      </div>

      {/* ══ Phase 1: Upload ══ */}
      {phase === 1 && (
        <>
          <div
            className={cn(s.uploadZone, dragging ? s.dragging : undefined)}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => { if (!isUploading) fileInputRef.current?.click(); }}
            role="button"
            tabIndex={0}
            id="upload-dropzone"
            aria-label="Upload presentation file"
          >
            <div className={s.uploadGlyph}>📤</div>
            <div className={s.uploadH}>Drop your deck here</div>
            <p className={s.uploadSub}>
              Drag and drop your presentation file, or click to browse. We'll analyse
              every slide and suggest improvements tailored to your audience.
            </p>
            <Button variant="spotlight" id="upload-browse-btn" disabled={isUploading}>
              {isUploading ? 'Uploading…' : 'Browse files'}
            </Button>
            <div className={s.uploadFormats}>
              {['PPTX', 'KEY', 'PDF', 'GSLIDES'].map((fmt) => (
                <span key={fmt} className="format-pill">{fmt}</span>
              ))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pptx,.ppt,.key,.pdf"
              style={{ display: 'none' }}
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file) handleFile(file);
              }}
              id="file-input"
            />
          </div>
          {uploadError && <p className={s.uploadError} role="alert">{uploadError}</p>}

          <div className={s.promiseGrid}>
            {[
              { icon: '⚡', title: 'Instant analysis', sub: 'Your deck is reviewed in under 60 seconds — no waiting, no queue.' },
              { icon: '\uD83C\uDFAF', title: 'Audience-aware', sub: 'Tell us who\'s in the room. We tune suggestions for executives, investors, or technical audiences.' },
              { icon: '🔒', title: 'Private & secure', sub: 'Your files are encrypted and never shared. Delete at any time.' },
            ].map((p) => (
              <div key={p.title} className={s.promiseCard}>
                <div className={s.promiseIcon}>{p.icon}</div>
                <div className={s.promiseTitle}>{p.title}</div>
                <p className={s.promiseSub}>{p.sub}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ══ Phase 2: Setup ══ */}
      {phase === 2 && (
        <>
          <div style={{ marginBottom: 8 }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500 }}>Set up your session</h3>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6, marginBottom: 22 }}>
              Tell us about your audience and time budget so we can tailor the coaching.
              {fileName && <> · Loaded: <strong>{fileName}</strong></>}
            </p>
          </div>

          <div className={s.setupPanel}>
            <div className={s.setupRow}>
              <div className={s.setupLabel}>Audience</div>
              <div className="chip-group">
                {AUDIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={cn('chip', audience === opt ? 'active' : undefined)}
                    onClick={() => setAudienceLocal(opt)}
                    id={`audience-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className={s.setupRow}>
              <div className={s.setupLabel}>Presentation time</div>
              <div className="chip-group">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    className={cn('chip', timeMinutes === t ? 'active' : undefined)}
                    onClick={() => setTimeLocal(t)}
                    id={`time-${t}`}
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={() => setPhase(1)} id="setup-back-btn">← Back</Button>
            <Button variant="spotlight" onClick={startProcessing} id="setup-analyse-btn">
              Analyse my deck →
            </Button>
          </div>
        </>
      )}

      {/* ══ Phase 3: Processing ══ */}
      {phase === 3 && (
        <>
          <div className={s.processingHero}>
            <div className={s.processingGlyph}>✨</div>
            <div className={s.processingTitle}>Analysing your deck…</div>
            <p className={s.processingSub}>
              Our AI is reading your slides, checking for clarity, pacing risk, and audience fit.
              This usually takes 20–40 seconds.
            </p>
            <div className={s.batchStats}>
              <div><span>{Math.round(progress / 10)}</span>Slides done</div>
              <div><span>{Math.round(progress * 1.5)}</span>Words checked</div>
              <div><span>{progress < 100 ? '—' : reviewItems.length || '2'}</span>Issues flagged</div>
            </div>
            <div className={s.progressTrack}>
              <div className="track"><div className="fill" style={{ width: `${progress}%` }} /></div>
              <p className={s.progressNote}>{progress}% complete · {Math.max(0, Math.round((100 - progress) / 5))}s remaining</p>
            </div>
          </div>
        </>
      )}

      {/* ══ Phase 4: Review ══ */}
      {phase === 4 && (
        <>
          <div className={s.reviewToolbar}>
            <div className="filter-tabs">
              {['All', 'Flagged', 'Accepted', 'Skipped'].map((tab) => (
                <button key={tab} className={cn('filter-tab', tab === 'All' ? 'active' : undefined)}
                  id={`review-tab-${tab.toLowerCase()}`}>{tab}</button>
              ))}
            </div>
            <div className={s.bulkActions}>
              <Button
                variant="secondary"
                size="sm"
                id="accept-all-btn"
                onClick={handleAcceptAll}
                disabled={!hasAcceptableSuggestions || acceptingSuggestionIds.length > 0}
              >
                Accept all
              </Button>
              <Button variant="secondary" size="sm" id="skip-all-btn" onClick={() => reviewItems.forEach(handleRejectSuggestion)}>Skip all</Button>
            </div>
          </div>

          <div className={s.reviewList}>
            {reviewItems.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <div key={item.id} className={cn(s.reviewItem, isOpen ? s.expanded : undefined)}>
                  <div className={s.reviewRow} onClick={() => setExpandedId(isOpen ? null : item.id)}>
                    <div className={s.rowThumb}>{item.slideNumber}</div>
                    <div className={s.rowInfo}>
                      <div className={s.rowTitle}>{item.title}</div>
                      <div className={s.rowMeta}>
                        <span>{item.wordCount} words</span>
                        <span>{item.readTime} read</span>
                      </div>
                    </div>
                    <div className={s.rowIssues}>
                      {item.issues.map((iss) => (
                        <span key={iss.label} className={`tag ${iss.type}`}>{iss.label}</span>
                      ))}
                    </div>
                    <div className={s.rowActions}>
                      <Button
                        variant="secondary"
                        size="sm"
                        id={`accept-${item.id}`}
                        onClick={(e) => { e.stopPropagation(); handleAcceptSuggestion(item); }}
                        disabled={
                          typeof item.suggestionId !== 'number' ||
                          item.status === 'accepted' ||
                          acceptingSuggestionIds.includes(item.suggestionId)
                        }
                      >
                        {item.status === 'accepted' ? 'Accepted' : '✓ Accept'}
                      </Button>
                      <Button variant="ghost" size="sm" id={`skip-${item.id}`}
                        onClick={(e) => { e.stopPropagation(); handleRejectSuggestion(item); }}>Skip</Button>
                    </div>
                    <span className={cn(s.chevron, isOpen ? s.chevronOpen : undefined)}>▼</span>
                  </div>

                  {/* Expanded panel */}
                  <div className={cn(s.panel, isOpen ? s.panelOpen : undefined)}>
                    <div className={s.panelInner}>
                      <div className={s.compare}>
                        <div className={s.compareCol}>
                          <div className={s.compareLabel}>Original</div>
                          <div className={s.compareHeadline}>{item.originalHeadline}</div>
                          <ul className={s.compareBullets}>
                            {item.originalBullets.map((b) => <li key={b}>{b}</li>)}
                          </ul>
                        </div>
                        <div className={cn(s.compareCol, s.compareColNew)}>
                          <div className={s.compareLabel}>
                            AI suggestion
                            <span className={s.reductionBadge}>−{item.reductionPercent}% words</span>
                          </div>
                          <div className={s.compareHeadline}>{item.suggestedHeadline}</div>
                          <ul className={s.compareBullets}>
                            {item.suggestedBullets.map((b) => <li key={b}>{b}</li>)}
                          </ul>
                        </div>
                      </div>
                      {item.suggestions && item.suggestions.length > 0 && (
                        <div className={s.insightBox}>
                          <div className={s.insightTitle}>AI suggestions</div>
                          <ul className={s.insightList}>
                            {item.suggestions.map((suggestion) => (
                              <li key={suggestion}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className={s.panelActions}>
                        <Button variant="ghost" size="sm">Modify suggestion</Button>
                        <div className={s.panelActionsRight}>
                          <Button variant="secondary" size="sm" onClick={() => handleRejectSuggestion(item)}>Skip</Button>
                          <Button
                            variant="spotlight"
                            size="sm"
                            onClick={() => handleAcceptSuggestion(item)}
                            disabled={
                              typeof item.suggestionId !== 'number' ||
                              item.status === 'accepted' ||
                              acceptingSuggestionIds.includes(item.suggestionId)
                            }
                          >
                            {item.status === 'accepted' ? 'Accepted' : 'Accept suggestion'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Practice CTA */}
          <div className={s.footerCta}>
            <div>
              <div className={s.footerCtaTitle}>Ready to practice?</div>
              <div className={s.footerCtaSub}>Slide coaching review is complete. Start practicing your delivery with real-time feedback.</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" style={{ color: '#edebf5', borderColor: 'rgba(237,235,245,0.3)' }}
                id="review-skip-remaining-btn">Skip remaining</Button>
              <Button variant="spotlight" id="go-practice-btn"
                onClick={() => navigate('/practice')}>Start practice →</Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SlidesPage;
