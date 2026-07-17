import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginWithCredentials } from '../../store/slices/authSlice';
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle';
import Button from '../../components/common/Button/Button';
import s from './Auth.module.scss';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginWithCredentials({ email, password }));
    if (loginWithCredentials.fulfilled.match(result)) {
      navigate('/dashboard');
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
          <h1>Present with confidence — every time.</h1>
          <p>
            SlideMentor analyses your deck, coaches your delivery, and gives you
            slide-by-slide AI feedback before you step into the room.
          </p>
        </div>

        <div className={s.authQuote}>
          <p>
            "My investor pitch went from a 6/10 to closing the round. The pacing
            coach alone was worth it."
          </p>
          <span>— Sarah K., Founder & CEO</span>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className={s.authFormSide}>
        <div className={s.authFormTop}>
          <ThemeToggle />
        </div>

        <div className={s.authFormWrap}>
          <h2 className={s.authH}>Welcome back</h2>
          <p className={s.authSub}>Log in to continue your practice sessions.</p>

          {/* Social */}
          <div className={s.socialRow}>
            <button id="login-google-btn" className={s.socialBtn}>
              <span className={s.socialIcon}>G</span>
              Continue with Google
            </button>
            <button id="login-microsoft-btn" className={s.socialBtn}>
              <span className={s.socialIcon}>⊞</span>
              Continue with Microsoft
            </button>
          </div>

          <div className="divider">or</div>

          {/* Error */}
          {error && <div className={s.errorMsg}>{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} id="login-form" noValidate>
            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className={s.forgotRow}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? 'Signing in…' : 'Log in'}
            </Button>
          </form>

          <p className={s.authFoot}>
            Don't have an account?{' '}
            <Link to="/signup">Sign up free</Link>
          </p>

          <p className={s.authTerms}>
            By continuing, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
