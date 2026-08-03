import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout/AppLayout';

/* Auth pages (public) */
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/Auth/SignupPage'));

/* App pages (protected) */
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const SlidesPage = lazy(() => import('../pages/Slides/SlidesPage'));
const PracticePage = lazy(() => import('../pages/Practice/PracticePage'));
const SummaryPage = lazy(() => import('../pages/Summary/SummaryPage'));
const SpeechPage = lazy(() => import('../pages/Speech/SpeechPage'));
const SheetPage = lazy(() => import('../pages/Sheet/SheetPage'));
const BillingPage = lazy(() => import('../pages/Billing/BillingPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const DrillsPage = lazy(() => import('../pages/Drills/DrillsPage'));

/* Page title map for the Topbar */
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Home',
  '/slides': 'Slides',
  '/practice': 'Practice',
  '/summary': 'Session summary',
  '/speech': 'Speech feedback',
  '/sheet': 'Coaching sheet',
  '/billing': 'Billing',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/drills': 'Voice drills',
};

const Loading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--ink-muted)', fontFamily: 'var(--mono)' }}>
    Loading…
  </div>
);

/** Helper to wrap each protected route with lazy + Suspense */
const LazyLayout = ({ path }: { path: string }) => (
  <AppLayout title={PAGE_TITLES[path] ?? 'SlideMentor'} />
);

const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />


      {/* Protected routes — all share AppLayout via nested routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<LazyLayout path="/dashboard" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route element={<LazyLayout path="/slides" />}>
          <Route path="/slides" element={<SlidesPage />} />
        </Route>
        <Route element={<LazyLayout path="/practice" />}>
          <Route path="/practice" element={<PracticePage />} />
        </Route>
        <Route element={<LazyLayout path="/summary" />}>
          <Route path="/summary" element={<SummaryPage />} />
        </Route>
        <Route element={<LazyLayout path="/speech" />}>
          <Route path="/speech" element={<SpeechPage />} />
        </Route>
        <Route element={<LazyLayout path="/sheet" />}>
          <Route path="/sheet" element={<SheetPage />} />
        </Route>
        <Route element={<LazyLayout path="/billing" />}>
          <Route path="/billing" element={<BillingPage />} />
        </Route>
        <Route element={<LazyLayout path="/profile" />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route element={<LazyLayout path="/settings" />}>
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route element={<LazyLayout path="/drills" />}>
          <Route path="/drills" element={<DrillsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
