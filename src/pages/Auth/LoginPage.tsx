import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginWithGoogle } from '../../store/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle';

import s from './Auth.module.scss';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error } = useAppSelector((state) => state.auth);


  const handleGoogleSuccess = async (credentialResponse: any) => {
    const tokenId = credentialResponse?.credential;
    if (!tokenId) {
      console.error('[Google OAuth] No credential returned from Google.');
      return;
    }
    const result = await dispatch(loginWithGoogle({ idToken: tokenId }));
    if (loginWithGoogle.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const handleGoogleError = () => {
    console.error('[Google OAuth] Login failed — check Google Cloud Console Authorized Origins.');
    dispatch({ type: 'auth/setError', payload: 'Google sign-in failed. Please ensure pop-ups are allowed and try again.' });
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
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
              <button id="login-microsoft-btn" className={s.socialBtn}
                // Microsoft login not implemented yet
              >
                <span className={s.socialIcon}>⊞</span>
                Continue with Microsoft
              </button>
            </div>

          <div className="divider">or</div>

          {/* Error */}
          {error && <div className={s.errorMsg}>{error}</div>}

          {/* Form */}
            {/* Email/password login is not supported; use Google login above. */}

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
