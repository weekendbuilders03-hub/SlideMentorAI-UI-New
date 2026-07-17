import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signupWithCredentials } from '../../store/slices/authSlice';
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle';
import Button from '../../components/common/Button/Button';
import s from './Auth.module.scss';

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(signupWithCredentials({ firstName, lastName, email, password }));
    if (signupWithCredentials.fulfilled.match(result)) {
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
          <h1>Your AI presentation coach starts here.</h1>
          <p>
            Upload your deck, practise your delivery, and get instant feedback
            on pacing, filler words, and slide clarity — all before the real thing.
          </p>
        </div>

        <div className={s.authQuote}>
          <p>
            "I went from dreading presentations to actually looking forward to them.
            The AI feedback is brutally honest in the best way."
          </p>
          <span>— Marcus T., Senior Product Manager</span>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className={s.authFormSide}>
        <div className={s.authFormTop}>
          <ThemeToggle />
        </div>

        <div className={s.authFormWrap}>
          <h2 className={s.authH}>Create your account</h2>
          <p className={s.authSub}>Free forever. No credit card required.</p>

          {/* Social */}
          <div className={s.socialRow}>
            <button id="signup-google-btn" className={s.socialBtn}>
              <span className={s.socialIcon}>G</span>
              Sign up with Google
            </button>
          </div>

          <div className="divider">or</div>

          {error && <div className={s.errorMsg}>{error}</div>}

          <form onSubmit={handleSubmit} id="signup-form" noValidate>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="signup-first">First name</label>
                <input
                  id="signup-first"
                  type="text"
                  placeholder="Alex"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="signup-last">Last name</label>
                <input
                  id="signup-last"
                  type="text"
                  placeholder="Johnson"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="signup-email">Work email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              id="signup-submit-btn"
            >
              {loading ? 'Creating account…' : 'Create free account'}
            </Button>
          </form>

          <p className={s.authFoot}>
            Already have an account?{' '}
            <Link to="/login">Log in</Link>
          </p>

          <p className={s.authTerms}>
            By signing up, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
