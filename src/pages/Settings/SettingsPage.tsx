import React, { useState, useEffect } from 'react';
import { userService } from '../../api/services/userService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTheme } from '../../store/slices/themeSlice';
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
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.mode);

  const [emailRecap, setEmailRecap] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    userService.getPreferences()
      .then((prefs) => {
        setEmailRecap(prefs.emailRecap);
        setReminders(prefs.practiceReminders);
        setAiSuggestions(prefs.aiSuggestions);
        setPublicProfile(prefs.publicProfile);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePrefChange = async (key: 'emailRecap' | 'reminders' | 'aiSuggestions' | 'publicProfile', val: boolean) => {
    if (key === 'emailRecap') setEmailRecap(val);
    if (key === 'reminders') setReminders(val);
    if (key === 'aiSuggestions') setAiSuggestions(val);
    if (key === 'publicProfile') setPublicProfile(val);

    try {
      setStatusMsg('Saving…');
      await userService.updatePreferences({
        emailRecap: key === 'emailRecap' ? val : emailRecap,
        practiceReminders: key === 'reminders' ? val : reminders,
        aiSuggestions: key === 'aiSuggestions' ? val : aiSuggestions,
        publicProfile: key === 'publicProfile' ? val : publicProfile,
      });
      setStatusMsg('Settings saved');
      setTimeout(() => setStatusMsg(null), 2000);
    } catch {
      setStatusMsg('Failed to save setting');
    }
  };

  const handleThemeChange = (t: 'Light' | 'Dark' | 'System') => {
    if (t === 'Light') dispatch(setTheme('light'));
    if (t === 'Dark') dispatch(setTheme('dark'));
    if (t === 'System') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(isDark ? 'dark' : 'light'));
    }
  };

  if (loading) {
    return <div style={{ padding: 24, color: 'var(--ink-muted)' }}>Loading preferences…</div>;
  }

  return (
    <div className={styles.wrap}>
      {statusMsg && (
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)', marginBottom: 8 }}>
          {statusMsg}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardH}>Notifications</div>
        <PrefRow id="pref-email" name="Email recap" sub="Receive a session summary after each practice."
          checked={emailRecap} onChange={(v) => handlePrefChange('emailRecap', v)} />
        <PrefRow id="pref-reminders" name="Practice reminders" sub="Daily nudge to keep your streak going."
          checked={reminders} onChange={(v) => handlePrefChange('reminders', v)} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardH}>AI & Coaching</div>
        <PrefRow id="pref-ai" name="AI suggestions" sub="Show AI slide suggestions during the review phase."
          checked={aiSuggestions} onChange={(v) => handlePrefChange('aiSuggestions', v)} />
        <PrefRow id="pref-public" name="Public profile" sub="Let others see your improvement trend on the leaderboard."
          checked={publicProfile} onChange={(v) => handlePrefChange('publicProfile', v)} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardH}>Appearance</div>
        <div className={styles.prefRow} style={{ border: 'none', padding: '12px 0 0' }}>
          <div>
            <div className={styles.prefName}>Theme</div>
            <div className={styles.prefSub}>Set your preferred colour scheme.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['Light', 'Dark', 'System'] as const).map((t) => (
              <button
                key={t}
                className={`chip ${(t === 'Light' && currentTheme === 'light') || (t === 'Dark' && currentTheme === 'dark') ? 'active' : ''}`}
                id={`theme-${t.toLowerCase()}-btn`}
                onClick={() => handleThemeChange(t)}
              >
                {t}
              </button>
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
