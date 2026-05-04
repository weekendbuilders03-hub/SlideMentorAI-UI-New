
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createSession } from '../../store/features/session';
import { logout } from '../../store/features/auth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import "./Dashboard.scss";

const Dashboard = () => {
  const [isDarkMode] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get values from store
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const { data: sessionData } = useAppSelector((state) => state.session);

  console.log('Dashboard - isAuthenticated:', isAuthenticated);
  console.log('Dashboard - user data:', user);
  console.log('Dashboard - session data:', sessionData);


  const { Title, Paragraph } = Typography;
  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  const handleStartNewSession = async () => {
    try {
      const session = await dispatch(createSession()).unwrap();
      navigate('/upload')
      console.log('New session created', session);
    } catch (error) {
      console.error('Failed to create session', error);
    }
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? "dark" : ""}`}>
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-top">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-icon">
              <span className="icon">🚀</span>
            </div>
            <div className="logo-text">
              <h1>Presentation AI</h1>
              <p>User Workspace</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="navigation">
            <a href="#" className="nav-item active">
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>

          </nav>
        </div>

        {/* Usage Card & Upgrade */}
        <div className="sidebar-bottom">
          <div className="usage-card">
            <div className="usage-header">
              <span className="usage-label">Usage</span>
              <span className="usage-count">{user?.trialSessionsUsed || 0}/{user?.maxTrialSessions || 5} sessions</span>
            </div>
            <div className="usage-bar">
              <div className="usage-progress" style={{ width: `${((user?.trialSessionsUsed || 0) / (user?.maxTrialSessions || 5)) * 100}%` }}></div>
            </div>
            <p className="usage-text">Trial {user?.isTrialExpired ? 'expired' : 'resets in 7 days'}</p>
          </div>
          <button className="upgrade-btn" onClick={handleLogout}>
            <span className="upgrade-icon">⭐</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search sessions..." />
          </div>

          <div className="navbar-right">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge"></span>
            </button>

            <div className="divider"></div>

            <div className="user-profile">
              <div className="user-info">
                <p className="user-name">{user?.fullName || 'User'}</p>
                <p className="user-tier">{user?.plan || 'Free'} Tier</p>
              </div>
              <div
                className="user-avatar"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3YEu2BrEWlY7gmuuhoV9cXwGgxWCExsenMbnv_Q2jfyxxcpnlQb36kAp0EQDNKhSyGxrhUk7vn2_ekAdNxuhzj0E9iGret0nR-g4ADA9kFWFYRoyVOmCj_xQ70Hu-59POUrgwWnElRg3hGO4JVa02JC4LwLUn4NpqlY16B439l5LBv0dtf4a2nYLQGGN1FlARcNaoQ85T4hSzOv0d-Y3vXOG3eFeqYeE9MdLHvD00nnSpp0rTYlg_2AL8WEDkWNtYmN-Hi6EOqQ2m')",
                }}
              ></div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="page-body">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-text">
              <h2>Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!</h2>
              <p>Ready to ace your next presentation?</p>
            </div>
            <div className="plan-badge">
              <span className="badge-icon">✓</span>
              <span>{user?.plan || 'Free'} Plan</span>
            </div>
          </div>

          {/* Action Cards */}
          <div className="action-cards">
            {/* Start New Session Card */}
            <Card
              className="primary-card"
              style={{
                background: 'linear-gradient(135deg, #136dec 0%, rgba(19, 109, 236, 0.8) 100%)',
                border: 'none',
                cursor: 'pointer',
                minHeight: '200px',
              }}
              onClick={() =>handleStartNewSession()}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/upload'); }}
              role="button"
              tabIndex={0}
            >
              <Row align="middle" justify="space-between" gutter={[24, 24]}>
                {/* Left Section - Content (~60%) */}
                <Col xs={24} sm={24} md={14} lg={14}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {/* Icon Box */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(8px)',
                        fontSize: '24px',
                        fontWeight: '700',
                      }}
                    >
                      +
                    </div>

                    {/* Title */}
                    <Title
                      level={3}
                      style={{
                        color: '#ffffff',
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '900',
                        lineHeight: '1.25',
                      }}
                    >
                      Start New Session
                    </Title>

                    {/* Description */}
                    <Paragraph
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        margin: 0,
                        maxWidth: '280px',
                      }}
                    >
                      Record a new rehearsal and get instant AI feedback.
                    </Paragraph>

                    {/* Button */}
                    <div>
                      <Button
                        type="default"
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          border: 'none',
                          color: '#ffffff',
                          fontWeight: '600',
                          padding: '8px 16px',
                          borderRadius: '9999px',
                          backdropFilter: 'blur(12px)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                      >
                        Begin Practice
                      </Button>
                    </div>
                  </Space>
                </Col>

                {/* Right Section - Icon (~40%) */}
                <Col xs={0} sm={0} md={10} lg={10} style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '120px',
                      opacity: 0.15,
                      lineHeight: 1,
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  >
                    🎤
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Continue Last Session Card */}
            <div className="action-card secondary-card">
              <div className="card-header">
                <div className="card-header-text">
                  <span className="card-label">Last Draft</span>
                  <h3>Q4 Sales Strategy Final</h3>
                </div>
                <div className="card-header-icon">
                  <span>⏱️</span>
                </div>
              </div>
              <div className="card-footer">
                <div className="card-meta">
                  <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span>12:45 remaining</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
                <button className="resume-btn">
                  <span className="resume-icon">▶️</span>
                  Resume Session
                </button>
              </div>
            </div>
          </div>

          {/* Recent Sessions Table */}
          <div className="sessions-table-wrapper">
            <div className="table-header">
              <h3>Recent Sessions</h3>
              <a href="#">View All</a>
            </div>

            <div className="table-container">
              <table className="sessions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Presentation Title</th>
                    <th>Duration</th>
                    <th>AI Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Oct 24, 2023</td>
                    <td>
                      <div className="table-title">
                        <span className="title-icon">📊</span>
                        <span>Investor Pitch Deck v2</span>
                      </div>
                    </td>
                    <td>18:32</td>
                    <td className="score-cell">
                      <span className="score-badge success">92/100</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Oct 22, 2023</td>
                    <td>
                      <div className="table-title">
                        <span className="title-icon">📊</span>
                        <span>Quarterly Sales Performance</span>
                      </div>
                    </td>
                    <td>05:14</td>
                    <td className="score-cell">
                      <span className="score-badge primary">85/100</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Oct 19, 2023</td>
                    <td>
                      <div className="table-title">
                        <span className="title-icon">📊</span>
                        <span>Team Sync - Project Alpha</span>
                      </div>
                    </td>
                    <td>12:00</td>
                    <td className="score-cell">
                      <span className="score-badge warning">74/100</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <button className="load-more-btn">
                Load More
                <span className="more-icon">▼</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;