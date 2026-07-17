import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import Button from '../../components/common/Button/Button';
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

const DECKS = [
  { id: 'd1', name: 'Investor Pitch Deck v2', slides: 14, duration: '18:32', status: 'done' as const },
  { id: 'd2', name: 'Q4 Sales Strategy Final', slides: 10, duration: '12:45', status: 'progress' as const },
  { id: 'd3', name: 'Team Sync — Project Alpha', slides: 8, duration: '12:00', status: 'done' as const },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const firstName = user?.firstName ?? 'Alex';

  return (
    <>
      <h2 className={s.greet}>Good morning, {firstName} 👋</h2>
      <p className={s.greetSub}>Here's what's happening with your presentations today.</p>

      {/* Stats */}
      <div className={s.statGrid}>
        <StatCard value="12" label="Sessions completed" />
        <StatCard value="82" label="Avg. AI score" />
        <StatCard value="7" label="Filler words (last)" />
        <StatCard value="138" label="Avg. wpm" />
      </div>

      {/* Resume card */}
      <div className={s.resumeCard}>
        <div className={s.resumeLeft}>
          <div className={s.resumeTitle}>Continue where you left off</div>
          <div className={s.resumeDeck}>Q4 Sales Strategy Final</div>
          <div className={s.resumeTrack}><div className={s.resumeFill} /></div>
          <div className={s.resumeNote}>Slide 7 of 10 · 12 min remaining</div>
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
        {DECKS.map((deck) => (
          <div key={deck.id} className={s.deckRow}>
            <div className={s.deckThumb} />
            <div className={s.deckName}>{deck.name}</div>
            <div className={s.deckMeta}>{deck.slides} slides · {deck.duration}</div>
            <span className={`status-pill ${deck.status}`}>
              {deck.status === 'done' ? 'Reviewed' : 'In progress'}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardPage;
