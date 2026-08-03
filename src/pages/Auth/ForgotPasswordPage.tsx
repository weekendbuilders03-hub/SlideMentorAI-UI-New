import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle';
import Button from '../../components/common/Button/Button';
import s from './Auth.module.scss';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      throw new Error('Forgot password is not supported by backend');
      // setSent(true);
    } catch {
      setError('Password reset is not supported. Please log in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.authShell}>
      {/* ── Brand Panel ── */}
      <div className={s.authBrand}>
        <div className={s.authBrandTop}>
          <div className={s.brandMark}>S</div>
          <span className={s.brandName}>SlideMentor</span>
        </div>
        <div className={s.authBrandMid}>
          <h1>Back on track in minutes.</h1>
          <p>
            Enter your email address and we'll send you a link to reset your
            password. Your practice history stays safe.
          </p>
        </div>
        <div className={s.authQuote}>
          <p>"Getting back in was effortless. My sessions were right where I left them."</p>
          <span>— Jamie L., Sales Lead</span>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className={s.authFormSide}>
        <div className={s.authFormTop}>
          <ThemeToggle />
        </div>

        <div className={s.authFormWrap}>
          <h2 className={s.authH}>Reset your password</h2>
          <p className={s.authSub}>We'll send a reset link to your email address.</p>

          {error && <div className={s.errorMsg}>{error}</div>}
          {sent && (
            <div className={s.successMsg}>
              ✓ Check your inbox — we've sent a reset link to <strong>{email}</strong>.
            </div>
          )}

          {!sent && (
            <form onSubmit={handleSubmit} id="forgot-form" noValidate>
              <div className="field">
                <label htmlFor="forgot-email">Email address</label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                id="forgot-submit-btn"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          )}

          <p className={s.authFoot}>
            <Link to="/login">← Back to log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
