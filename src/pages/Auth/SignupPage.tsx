import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginWithGoogle } from '../../store/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle';
import s from './Auth.module.scss';

const SignupPage: React.FC = () => {
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
    console.error('[Google OAuth] Signup failed — check Google Cloud Console Authorized Origins.');
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          <div className="divider">or</div>

          {error && <div className={s.errorMsg}>{error}</div>}

          {/* Email/password signup is no longer supported. Users should sign up via Google above. */}

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
