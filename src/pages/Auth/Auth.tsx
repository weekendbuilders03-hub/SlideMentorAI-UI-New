import {
  MailOutlined,
  SlackOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { loginWithGoogle } from "../../store/features/auth";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import "./Auth.scss";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const googleRef = useRef<HTMLDivElement>(null);

  // Get auth state from Redux
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSuccess = async (
    credentialResponse: CredentialResponse
  ): Promise<void> => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Dispatch the login thunk
      await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();

      // Navigate to dashboard on successful login
      navigate("/dashboard");

    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const triggerGoogleLogin = () => {
    const googleButton =
      googleRef.current?.querySelector("div[role='button']") as HTMLDivElement;

    googleButton?.click();
  };

  return (
    <div className="pp-auth">
      {/* Header */}
      <header className="pp-auth__header">
        <div className="pp-auth__brand">
          <div className="pp-navbar__icon">
            <span />
          </div>
          <span>PresentationAI</span>
        </div>
        <a href="#" className="pp-auth__help">
          Help Center
        </a>
      </header>

      {/* Card */}
      <div className="pp-auth__card">
        <div className="pp-auth__icon">
          <SlackOutlined />
        </div>

        <h1>Welcome Back</h1>
        <p className="pp-auth__subtitle">
          Sign in to perfect your next presentation with AI rehearsal.
        </p>

        {/* Styled Google Button */}
        <button
          className="pp-auth__btn pp-auth__btn--google"
          onClick={triggerGoogleLogin}
          disabled={loading}
        >
          <span className="pp-auth__btn-icon">
            <GoogleOutlined />
          </span>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="pp-auth__error">
            <p>{error}</p>
          </div>
        )}

        {/* Hidden Real Google Button */}
        <div style={{ display: "none" }} ref={googleRef}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Google Login Failed")}
          />
        </div>

        <button className="pp-auth__btn pp-auth__btn--email">
          <MailOutlined /> Continue with Email
        </button>

        <div className="pp-auth__divider" />

        <p className="pp-auth__terms">
          By signing in, you agree to our{" "}
          <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>

      {/* Footer */}
      <footer className="pp-auth__footer">
        <p>Trusted by presenters at</p>
        <div className="pp-auth__logos">
          <span>TECHFLOW</span>
          <span>LUMINA</span>
          <span>ORBIT</span>
        </div>

        <div className="pp-auth__links">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Auth;