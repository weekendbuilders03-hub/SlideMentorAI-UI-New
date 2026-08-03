import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button/Button';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { userService } from '../../api/services/userService';
import { fetchCurrentUser } from '../../store/slices/authSlice';
import styles from './Profile.module.scss';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [org, setOrg] = useState('');
  const [avatarInitials, setAvatarInitials] = useState('U');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    userService.getProfile()
      .then((p) => {
        setFirstName(p.firstName || authUser?.firstName || '');
        setLastName(p.lastName || authUser?.lastName || '');
        setEmail(p.email || authUser?.email || '');
        setRole(p.role || authUser?.role || '');
        setOrg(p.organization || '');
        setAvatarInitials(p.avatarInitials || authUser?.avatarInitials || 'U');
      })
      .catch(() => {
        if (authUser) {
          setFirstName(authUser.firstName || '');
          setLastName(authUser.lastName || '');
          setEmail(authUser.email || '');
          setRole(authUser.role || '');
          setAvatarInitials(authUser.avatarInitials || 'U');
        }
      });
  }, [authUser]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await userService.updateProfile({
        firstName,
        lastName,
        role,
      });
      // Refresh current user in Redux
      dispatch(fetchCurrentUser());
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={styles.grid}>
        {/* Profile info */}
        <div>
          <div className={styles.card}>
            <div className={styles.cardH}>Personal information</div>

            <div className={styles.avatarRow}>
              <div className={styles.avatarLg}>{avatarInitials}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" size="sm" id="upload-avatar-btn">Change photo</Button>
                <Button variant="ghost" size="sm" id="remove-avatar-btn">Remove</Button>
              </div>
            </div>

            {message && (
              <div style={{
                color: message.type === 'success' ? 'var(--teal)' : 'var(--coral)',
                marginBottom: 12,
                fontSize: 13,
                fontWeight: 600,
              }}>
                {message.text}
              </div>
            )}

            <div className={styles.fieldRow}>
              <div className="field">
                <label htmlFor="profile-first">First name</label>
                <input id="profile-first" type="text" value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="profile-last">Last name</label>
                <input id="profile-last" type="text" value={lastName}
                  onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="profile-email">Email address</label>
              <input id="profile-email" type="email" value={email} readOnly
                style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>

            <div className={styles.fieldRow}>
              <div className="field">
                <label htmlFor="profile-role">Job title</label>
                <input id="profile-role" type="text" value={role}
                  onChange={(e) => setRole(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="profile-org">Organisation</label>
                <input id="profile-org" type="text" value={org}
                  onChange={(e) => setOrg(e.target.value)} />
              </div>
            </div>

            <Button variant="primary" id="save-profile-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>

        {/* Connected accounts */}
        <div>
          <div className={styles.card}>
            <div className={styles.cardH}>Connected accounts</div>
            {[
              { icon: 'G', name: 'Google', sub: email || 'Connected Google Account', connected: true },
              { icon: '⊞', name: 'Microsoft', sub: 'Connect your Microsoft account', connected: false },
              { icon: '⌂', name: 'Slack', sub: 'Get practice reminders in Slack', connected: false },
            ].map((acc) => (
              <div key={acc.name} className={styles.connectRow}>
                <div className={styles.connectIcon}>{acc.icon}</div>
                <div>
                  <div className={styles.connectName}>{acc.name}</div>
                  <div className={styles.connectSub}>{acc.sub}</div>
                </div>
                {acc.connected
                  ? <span className={styles.connectStatus}>Connected</span>
                  : <Button variant="secondary" size="sm" style={{ marginLeft: 'auto' }}
                    id={`connect-${acc.name.toLowerCase()}-btn`}>Connect</Button>}
              </div>
            ))}
          </div>

          <div className={`${styles.card} ${styles.dangerCard}`} style={{ marginTop: 14 }}>
            <div className={styles.cardH}>Danger zone</div>
            <div className={styles.dangerRow}>
              <div>
                <div className={styles.dangerName}>Delete account</div>
                <div className={styles.dangerSub}>Permanently delete your account and all data.</div>
              </div>
              <Button variant="danger" size="sm" id="delete-account-btn">Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
