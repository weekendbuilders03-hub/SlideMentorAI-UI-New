import React, { useState } from 'react';
import styles from './Settings.module.scss';

interface PrefRowProps {
  id: string; name: string; sub: string; checked: boolean;
  onChange: (v: boolean) => void;
}
const PrefRow: React.FC<PrefRowProps> = ({ id, name, sub, checked, onChange }) => (
  <div className={styles.prefRow}>
    <div>
      <div className={styles.prefName}>{name}</div>
      <div className={styles.prefSub}>{sub}</div>
    </div>
    <label className="switch" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch-track" />
    </label>
  </div>
);

const SettingsPage: React.FC = () => {
  const [emailRecap, setEmailRecap] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.cardH}>Notifications</div>
        <PrefRow id="pref-email" name="Email recap" sub="Receive a session summary after each practice."
          checked={emailRecap} onChange={setEmailRecap} />
        <PrefRow id="pref-reminders" name="Practice reminders" sub="Daily nudge to keep your streak going."
          checked={reminders} onChange={setReminders} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardH}>AI & Coaching</div>
        <PrefRow id="pref-ai" name="AI suggestions" sub="Show AI slide suggestions during the review phase."
          checked={aiSuggestions} onChange={setAiSuggestions} />
        <PrefRow id="pref-public" name="Public profile" sub="Let others see your improvement trend on the leaderboard."
          checked={publicProfile} onChange={setPublicProfile} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardH}>Appearance</div>
        <div className={styles.prefRow} style={{ border: 'none', padding: '12px 0 0' }}>
          <div>
            <div className={styles.prefName}>Theme</div>
            <div className={styles.prefSub}>Set your preferred colour scheme.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Light', 'Dark', 'System'].map((t) => (
              <button key={t} className={`chip ${t === 'System' ? 'active' : ''}`} id={`theme-${t.toLowerCase()}-btn`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.dangerCard}`}>
        <div className={styles.cardH}>Danger zone</div>
        <div className={styles.prefRow}>
          <div>
            <div className={styles.prefName}>Clear all session data</div>
            <div className={styles.prefSub}>Delete all practice recordings and feedback. Cannot be undone.</div>
          </div>
          <button className="btn btn-danger btn-sm" id="clear-data-btn">Clear data</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
