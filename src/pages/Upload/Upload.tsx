import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload as AntUpload, message } from "antd";
import { uploadSlides } from "../../store/features/upload/uploadSlice";
import { AppDispatch, RootState } from "../../store/store";
import "./Upload.scss";

const Upload = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: sessionData } = useSelector((state: RootState) => state.session);
  const { loading: uploadLoading, error: uploadError, success: uploadSuccess } = useSelector((state: RootState) => state.upload);

  const [isDarkMode] = useState(true);
  const [isRecording] = useState(true);
  const [currentSlide] = useState(1);
  const [totalSlides] = useState(12);

  const handleBeforeUpload = (file: File) => {
    if (!sessionData?.data?.sessionId) {
      message.error('Please ensure session is created');
      return false;
    }

    dispatch(uploadSlides({
      sessionId: sessionData?.data?.sessionId,
      file: file,
    }));

    return false;
  };

  const slides = [
    {
      id: 1,
      title: "01. Introduction",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJhiRRgHSKRsnuuCMLUZJvwK72BfYwFJZEPoHL7dhAIGCvqF-ARykX_Z6jO1B0jcM_sAcLZXl9vDPRrxY-jZvM9zeWPGyB7oUAIZoEJ1fYV62yO67IoXvV6QQSVYUbOdBU1rY76k48u8tQhVjD8EJA1u0ihN52ADQvRa1tT6wJNL9LAHj7Hrv9P0R4e2PE_TfuxXjQau0aNXuAnARarMYUXo6unE1Uh693UE-krsnjI6HZpT-9LtPmF6tpST_8Gv7rb0-YivcX25pD",
      isActive: true,
    },
    {
      id: 2,
      title: "02. The Problem",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBGIVIqDmAM91hqkD8xUWYV2mgyrlFlBMu-M18usA7RwKVO0Jzfz1fpEBlvMJ-CtEx-FaobTW28V_lvDcStqM5CemOCOIc3uERQq2MuBuma4lzy6qCdQEmGDWR3vcBZplzwX0lOo9oeKbJ3cEFIOagtEVJyqu1Uy4B7bl5ti30DLC9ERF0uZmHN3GDDaEhL1b2GZtMbFxTdO1pGC9km_TxlyzkPzivbeHXWMiMCyYOkRwVAPRhUjRdWX4G19cXbDsbTm6dOWcE2eVpP",
      isActive: false,
    },
    {
      id: 3,
      title: "03. Solution",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDRXkHT5rQx6ZrjHNdDnPnJKHjBWaZwMzamUN0txDroJpZz9NAFKuatdQulvYi0nBjbsOk6ZU6dJ7vUAxu9QcHRL5oLaXzQjqrSXu6XN9NI_-TomYHOZOGhuQlg7i3u3LGK3Z8kXaxx8PunASFp12gFDpPzur8StPZEt6STcGQMe4W02Q9H868Cw5oQW8CY11hAyCF9BQsbpUZCHb5Ga5sSHjJPV00R5atrv5bK7yO-mhcsaOeffFSm52Ad7BvbOYHSSntmxZSPjm5u",
      isActive: false,
    },
    {
      id: 4,
      title: "04. Market Size",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCSmSCI42Av5rI453cRgOZCuNO7AKGe4PE-2AKKBLPJCLtYBkEWzgeRtrwbAO376rhzCPDS6LxLdzpraVS1m7BYq2-YwelJ1hrAlUvgNwwEyEuP-YvGzjgXn62qBqVFi3KPtVoZKzenrwLSBcTVk745zWHQP8L7H03WqzIL8JOUXEl5yskgOYxnsu2AV7K7alniHw6ts8rkExY6e1vRRzwFx2xq-Xz10fntPRhggSI0QskQ1L-DMZgRjFfQ0E2LPHCcU2XnnsIn5gvZ",
      isActive: false,
    },
  ];

  

  return (
    <div className={`upload-container ${isDarkMode ? "dark" : ""}`}>
      {/* Status messages */}
      {uploadError && <div className="upload-error">{uploadError}</div>}
      {uploadSuccess && <div className="upload-success">Upload successful!</div>}
      {/* Top Navigation Bar */}
      <header className="top-header">
        <div className="header-left">
          <div className="logo-icon">
            <span>✨</span>
          </div>
          <h2>AI Unified Workspace</h2>
        </div>

        <div className="header-right">
          {/* Navigation */}
          <nav className="header-nav">
            <a href="/dashboard">Dashboard</a>
            <a href="#" className="active">
              Live Rehearsal
            </a>
            <a href="#">Library</a>
            <a href="#">Analytics</a>
          </nav>

          <div className="header-divider"></div>

          {/* Action Buttons */}
          <div className="header-actions">
            <button className="icon-btn">
              <span>🔔</span>
            </button>
            <button className="icon-btn">
              <span>⚙️</span>
            </button>
            <button className="export-btn">
              <span>📤</span>
              Export Report
            </button>
            <div className="user-avatar"></div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Left Panel: Slide Deck Viewer */}
        <aside className="left-panel">
          <div className="panel-header">
            <AntUpload
              beforeUpload={handleBeforeUpload}
              maxCount={1}
              accept=".ppt,.pptx"
              showUploadList={false}
            >
              <button
                className="upload-btn"
                disabled={uploadLoading}
              >
                <span>{uploadLoading ? "⏳" : "📁"}</span>
                {uploadLoading ? "Uploading..." : "Upload Slides"}
              </button>
            </AntUpload>
          </div>

          <div className="slides-container">
            <div className="slides-info">
              <h3>Current Deck</h3>
              <p>Investor Pitch v2.4</p>
            </div>

            <div className="slides-list">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className={`slide-thumbnail ${slide.isActive ? "active" : ""}`}
                >
                  <div
                    className="slide-image"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  ></div>
                  <div className="slide-label">{slide.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-footer">
            <span>{totalSlides} Slides Total</span>
            <span>14.2 MB</span>
          </div>
        </aside>

        {/* Center: Live Rehearsal Stage */}
        <main className="center-main">
          {/* Stage Header */}
          <div className="stage-header">
            <div className="stage-info">
              <div className="stage-label">Current Slide</div>
              <h1>01. Company Mission & Vision</h1>
            </div>

            <div className="timer-badge">
              <div className="timer-content">
                <span className="recording-dot">●</span>
                <span className="timer-text">04:22</span>
              </div>
              <div className="timer-divider"></div>
              <span className="timer-target">Target: 15:00</span>
            </div>
          </div>

          {/* Active Slide Display */}
          <div className="slide-display-container">
            <div className="slide-display-wrapper">
              <div
                className="slide-display"
                style={{
                  backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuDkzeztc12KEB_SYuqbd292IsgUp3aKvAPQHnNN7o7TBUvuewf_Tm9k0_nzZl3YOBFFPasGql1cXcAJuW4RFgGX_Zp_kjnGuRkPLnMdoYQ93-d0lj0lBn98Yx-21C0d9cfVCJde5UzD2Y0Y2KVVNLJgfvPdKgwmUZAloItrxsPEbA12LeBbhQ7Ijikep6KY8lNNauzpkmgDYiEQcqy1rbOTTU1n2-08gdNTnbItw4C5eZ7uHg203QTYtlC8pj6HT3CaMKkmP8-l46IM)`,
                }}
              >
                {/* Navigation Buttons */}
                <button className="slide-nav-btn prev">
                  <span>←</span>
                </button>
                <button className="slide-nav-btn next">
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Controls & Waveform */}
          <div className="controls-section">
            <div className="controls-content">
              {/* Record Button */}
              <div className="record-button-group">
                <button className={`record-btn ${isRecording ? "recording" : ""}`}>
                  <span>🎤</span>
                </button>
                <span className="record-label">Recording</span>
              </div>

              {/* Waveform Visualizer */}
              <div className="waveform-section">
                <div className="waveform-header">
                  <div className="waveform-title">
                    <span>🎚️</span>
                    <p>Audio Input</p>
                  </div>
                  <p className="waveform-status">Clear Signal - 48ms Latency</p>
                </div>

                <div className="waveform-bars">
                  <div className="bar" style={{ height: "25%" }}></div>
                  <div className="bar" style={{ height: "50%" }}></div>
                  <div className="bar" style={{ height: "75%" }}></div>
                  <div className="bar" style={{ height: "62%" }}></div>
                  <div className="bar" style={{ height: "87%" }}></div>
                  <div className="bar" style={{ height: "75%" }}></div>
                  <div className="bar" style={{ height: "37%" }}></div>
                  <div className="bar" style={{ height: "75%" }}></div>
                  <div className="bar" style={{ height: "56%" }}></div>
                  <div className="bar" style={{ height: "68%" }}></div>
                  <div className="bar" style={{ height: "87%" }}></div>
                  <div className="bar" style={{ height: "100%" }}></div>
                  <div className="bar" style={{ height: "75%" }}></div>
                  <div className="bar" style={{ height: "50%" }}></div>
                  <div className="bar" style={{ height: "62%" }}></div>
                  <div className="bar" style={{ height: "87%" }}></div>
                  <div className="bar" style={{ height: "56%" }}></div>
                  <div className="bar" style={{ height: "31%" }}></div>
                </div>
              </div>

              {/* Slide Navigation */}
              <div className="slide-nav-controls">
                <button className="nav-btn">
                  <span>⏮️</span>
                </button>
                <div className="slide-counter">
                  {currentSlide.toString().padStart(2, "0")} / {totalSlides}
                </div>
                <button className="nav-btn">
                  <span>⏭️</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel: AI Analysis */}
        <aside className="right-panel">
          <div className="ai-panel-header">
            <div className="ai-title">
              <span>🧠</span>
              <h2>AI Insights</h2>
            </div>
            <span className="live-badge">Live</span>
          </div>

          <div className="ai-content">
            {/* Filler Words Widget */}
            <div className="ai-widget">
              <div className="widget-header">
                <p>Filler Words</p>
                <span>Total: 8</span>
              </div>
              <div className="filler-grid">
                <div className="filler-item">
                  <p>"Um/Uh"</p>
                  <span>5</span>
                </div>
                <div className="filler-item">
                  <p>"Like"</p>
                  <span>3</span>
                </div>
              </div>
            </div>

            {/* Pace & Tone Monitor */}
            <div className="ai-widget">
              <p className="widget-header-title">Pace & Tone</p>
              <div className="pace-monitors">
                <div className="monitor-item">
                  <div className="monitor-header">
                    <span>Speaking Pace</span>
                    <span>142 WPM</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "65%" }}></div>
                  </div>
                  <p className="monitor-feedback">
                    ✓ Ideal pacing for this slide
                  </p>
                </div>
                <div className="monitor-item">
                  <div className="monitor-header">
                    <span>Confidence Score</span>
                    <span>88%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "88%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="ai-widget">
              <p className="widget-header-title">Real-time Suggestions</p>
              <div className="suggestions-card">
                <div className="suggestion-item">
                  <span className="suggestion-icon">💡</span>
                  <p>
                    Try emphasizing the word <strong>"Revolutionary"</strong> to
                    capture more attention on this slide.
                  </p>
                </div>
                <div className="suggestion-divider"></div>
                <div className="suggestion-item">
                  <span className="suggestion-icon">ℹ️</span>
                  <p>Pause for 2 seconds after mentioning the market size for dramatic effect.</p>
                </div>
              </div>
            </div>

            {/* Content Improvements */}
            <div className="ai-widget">
              <p className="widget-header-title">Content Improvements</p>
              <div className="improvement-card">
                <p className="improvement-title">Slide 1: Too much text?</p>
                <p className="improvement-text">
                  AI detected 85 words on this slide. Consider reducing to 35
                  for better engagement.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="ai-footer">
            <button className="history-btn">
              <span>📜</span>
              View Session History
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Upload;
