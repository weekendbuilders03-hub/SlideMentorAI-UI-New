import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import Button from '../../components/common/Button/Button';
import { sessionService } from '../../api/services/sessionService';
import { deckService } from '../../api/services/deckService';
import type { SessionStatsResponse, BackendSession, Deck } from '../../types/deck';
import s from './Dashboard.module.scss';

interface StatCardProps { value: string; label: string; }
const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className={s.statCard}>
    <div className={s.statVal}>{value}</div>
    <div className={s.statLabel}>{label}</div>
  </div>
);

interface ActionCardProps { icon: string; title: string; sub: string; onClick: () => void; id: string; }
const ActionCard: React.FC<ActionCardProps> = ({ icon, title, sub, onClick, id }) => (
  <div className={s.actionCard} onClick={onClick} id={id} role="button" tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}>
    <div className={s.actionIcon}>{icon}</div>
    <div className={s.actionTitle}>{title}</div>
    <p className={s.actionSub}>{sub}</p>
  </div>
);

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const firstName = user?.firstName ?? 'there';

  const [stats, setStats] = useState<SessionStatsResponse | null>(null);
  const [lastSession, setLastSession] = useState<BackendSession | null>(null);
  const [recentDecks, setRecentDecks] = useState<Deck[]>([]);

  useEffect(() => {
    sessionService.getStats()
      .then(setStats)
      .catch(() => setStats(null));

    sessionService.getLastSession()
      .then(setLastSession)
      .catch(() => setLastSession(null));

    deckService.listDecks()
      .then(setRecentDecks)
      .catch(() => setRecentDecks([]));
  }, []);

  const totalSessions = stats?.sessionsCompleted ?? stats?.totalSessions ?? 0;
  const avgScore = stats?.averageScore ?? stats?.lastSessionScore ?? 0;
  const fillerCount = stats?.totalFillerWords ?? stats?.averageFillerWords ?? 0;
  const avgWpm = stats?.averageWpm ?? 0;

  return (
    <>
      <h2 className={s.greet}>Good morning, {firstName} 👋</h2>
      <p className={s.greetSub}>Here's what's happening with your presentations today.</p>

      {/* Stats */}
      <div className={s.statGrid}>
        <StatCard value={String(totalSessions)} label="Sessions completed" />
        <StatCard value={avgScore > 0 ? String(avgScore) : '—'} label="Avg. AI score" />
        <StatCard value={String(fillerCount)} label="Filler words" />
        <StatCard value={avgWpm > 0 ? String(avgWpm) : '—'} label="Avg. wpm" />
      </div>

      {/* Resume card */}
      <div className={s.resumeCard}>
        <div className={s.resumeLeft}>
          <div className={s.resumeTitle}>Continue where you left off</div>
          <div className={s.resumeDeck}>{lastSession?.title || 'No recent presentation session'}</div>
          <div className={s.resumeTrack}><div className={s.resumeFill} style={{ width: lastSession ? '50%' : '0%' }} /></div>
          <div className={s.resumeNote}>
            {lastSession ? `${lastSession.slidesCount ?? 0} slides · ${lastSession.presentationTimeMinutes ?? 15} min` : 'Upload a deck to get started'}
          </div>
        </div>
        <Button variant="spotlight" id="resume-practice-btn" onClick={() => navigate('/practice')}>
          Resume practice →
        </Button>
      </div>

      {/* Quick actions */}
      <div className={s.sectionH}>Quick actions</div>
      <div className={s.actionGrid}>
        <ActionCard
          id="action-upload"
          icon="📤"
          title="Upload a deck"
          sub="Upload a PowerPoint, Keynote, or PDF and get instant AI slide coaching."
          onClick={() => navigate('/slides')}
        />
        <ActionCard
          id="action-practice"
          icon="🎙"
          title="Start practice"
          sub="Record a live run-through and get real-time pacing and filler-word feedback."
          onClick={() => navigate('/practice')}
        />
        <ActionCard
          id="action-speech"
          icon="📊"
          title="Speech feedback"
          sub="Deep-dive analysis on your last session — charts, indicators, and drills."
          onClick={() => navigate('/speech')}
        />
        <ActionCard
          id="action-drills"
          icon="🎯"
          title="Voice drills"
          sub="Targeted exercises to fix pacing, fillers, and vocal variety in minutes."
          onClick={() => navigate('/drills')}
        />
      </div>

      {/* Recent decks */}
      <div className={s.sectionH}>Recent decks</div>
      <div className={s.deckTable}>
        <div className={s.deckTableHeader}>
          <span>Your decks</span>
          <a href="#" id="view-all-decks-link">View all</a>
        </div>
        {recentDecks.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ink-muted)' }}>
            No presentation decks found. Upload your first deck above!
          </div>
        ) : (
          recentDecks.slice(0, 5).map((deck) => (
            <div key={deck.id} className={s.deckRow}>
              <div className={s.deckThumb} />
              <div className={s.deckName}>{deck.name}</div>
              <div className={s.deckMeta}>{deck.slideCount} slides · {deck.duration}</div>
              <span className={`status-pill ${deck.status}`}>
                {deck.status === 'done' ? 'Reviewed' : 'In progress'}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default DashboardPage;
