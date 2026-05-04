import "./IntroSection.scss";

const annotations = [
  {
    dot: "A",
    text: (
      <>
        <strong>Google OAuth only at launch</strong> — eliminates password
        friction, the single biggest drop-off point in SaaS sign-up flows.
      </>
    ),
  },
  {
    dot: "B",
    text: (
      <>
        <strong>7-day full Pro trial, no card</strong> — US users expect this.
        It's the difference between 2% and 8% free-to-paid conversion.
      </>
    ),
  },
  {
    dot: "C",
    text: (
      <>
        <strong>CCPA disclosure visible</strong> — required for California
        users, and signals trust to all US buyers, especially enterprise.
      </>
    ),
  },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path d="M17.64 9.2c0-.638-.057-1.252-.164-1.84H9v3.48h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

export default function IntroSection() {
  return (
    <div className="pp-intro">
      {/* ── What is PitchPerfect ── */}
      <section className="pp-intro__what">
        <div className="pp-intro__wrapper">
          <div className="pp-intro__section-header">
            <span className="pp-intro__tag">What is PitchPerfect?</span>
            <h2 className="pp-intro__heading">
              Your slides are ready.
              <br />
              Are <em>you</em>?
            </h2>
            <p className="pp-intro__body">
              PitchPerfect is the first AI tool that coaches your delivery, not
              just your deck. It listens while you practise, tells you which
              slide will lose your audience, catches every "um" and "uh," and
              rewrites your weak slides — automatically.
            </p>
          </div>

          <div className="pp-intro__callout pp-intro__callout--purple">
            <span className="pp-intro__callout-icon">🎯</span>
            <span>
              <strong>The one-line pitch:</strong> Grammarly fixes your writing.
              PitchPerfect fixes your presentation — both the slides and the
              person delivering them.
            </span>
          </div>
        </div>
      </section>

      <hr className="pp-intro__divider" />

      {/* ── Screen 1: Sign In ── */}
      <section className="pp-intro__signin">
        <div className="pp-intro__wrapper">
          <div className="pp-intro__section-header">
            <span className="pp-intro__tag">Screen 1 of 7</span>
            <h2 className="pp-intro__heading">
              Sign in &amp; get started
              <br />
              in under 60 seconds
            </h2>
            <p className="pp-intro__body">
              No setup wizard. No importing contacts. No credit card. One click
              with Google and you land directly on your dashboard — ready to
              rehearse.
            </p>
          </div>

          {/* Screen block */}
          <div className="pp-intro__screen-block">
            <div className="pp-intro__screen-label">
              <div className="pp-intro__screen-number" aria-hidden="true">1</div>
              <div>
                <div className="pp-intro__screen-name">Onboarding / Sign In</div>
                <div className="pp-intro__screen-desc">
                  First impression — frictionless entry, no card required
                </div>
              </div>
            </div>

            {/* Browser mockup */}
            <div className="pp-intro__browser">
              <div className="pp-intro__browser-bar">
                <div className="pp-intro__browser-dots" aria-hidden="true">
                  <span className="pp-intro__dot pp-intro__dot--red" />
                  <span className="pp-intro__dot pp-intro__dot--yellow" />
                  <span className="pp-intro__dot pp-intro__dot--green" />
                </div>
                <div className="pp-intro__browser-url">
                  app.pitchperfect.ai/signin
                </div>
              </div>

              <div className="pp-intro__browser-content">
                <div className="pp-intro__signin-bg">
                  <div className="pp-intro__signin-card">
                    {/* Logo */}
                    <div className="pp-intro__card-logo">
                      <span className="pp-intro__card-logo-pip" aria-hidden="true" />
                      PitchPerfect
                    </div>
                    <div className="pp-intro__card-subtitle">
                      AI Presentation Coach
                    </div>

                    <div className="pp-intro__card-welcome">Welcome back</div>
                    <div className="pp-intro__card-hint">
                      Sign in and start rehearsing.
                      <br />
                      No setup. No credit card.
                    </div>

                    <button className="pp-intro__google-btn" type="button">
                      <GoogleIcon />
                      Continue with Google
                    </button>

                    <p className="pp-intro__legal">
                      By signing in you agree to our Terms of Service
                      <br />
                      and Privacy Policy (CCPA compliant)
                    </p>

                    <div className="pp-intro__trial-badge">
                      ✨ 7-day free trial · Full Pro access · No card required
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Annotations */}
            <div className="pp-intro__annotations">
              {annotations.map((a) => (
                <div key={a.dot} className="pp-intro__ann-item">
                  <div className="pp-intro__ann-dot" aria-hidden="true">
                    {a.dot}
                  </div>
                  <p className="pp-intro__ann-text">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}