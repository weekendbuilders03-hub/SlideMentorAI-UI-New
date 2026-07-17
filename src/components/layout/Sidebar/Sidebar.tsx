import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';
import { toggleUserMenu, closeUserMenu, openPricingModal } from '../../../store/slices/uiSlice';
import { cn } from '../../../utils/cn';
import s from './Sidebar.module.scss';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: '⊞', path: '/dashboard' },
  { id: 'slides', label: 'Slides', icon: '⧉', path: '/slides' },
  { id: 'practice', label: 'Practice', icon: '🎙', path: '/practice' },
  { id: 'speech', label: 'Speech Feedback', icon: '📊', path: '/speech' },
  { id: 'drills', label: 'Voice Drills', icon: '🎯', path: '/drills' },
];

const ACCOUNT_NAV: NavItem[] = [
  { id: 'billing', label: 'Billing', icon: '💳', path: '/billing' },
  { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
  { id: 'settings', label: 'Settings', icon: '⚙', path: '/settings' },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuOpen = useAppSelector((state) => state.ui.userMenuOpen);
  const user = useAppSelector((state) => state.auth.user);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Close user menu on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        dispatch(closeUserMenu());
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const renderNavItem = (item: NavItem) => (
    <button
      key={item.id}
      id={`nav-${item.id}`}
      className={cn(s.navItem, isActive(item.path) ? s.active : undefined)}
      onClick={() => navigate(item.path)}
      aria-current={isActive(item.path) ? 'page' : undefined}
    >
      <span className={s.navIcon}>{item.icon}</span>
      {item.label}
    </button>
  );

  return (
    <aside className={s.sidebar}>
      {/* Brand */}
      <div className={s.brandRow}>
        <div className={s.brandMark}>S</div>
        <span className={s.brandName}>SlideMentor</span>
      </div>

      {/* Navigation */}
      <nav className={s.nav}>
        <div className={s.navGroup}>
          {NAV_ITEMS.map(renderNavItem)}
        </div>

        <div className={s.navGroup}>
          <span className={s.navLabel}>Account</span>
          {ACCOUNT_NAV.map(renderNavItem)}
          <button
            id="nav-upgrade"
            className={s.navItem}
            onClick={() => dispatch(openPricingModal())}
          >
            <span className={s.navIcon}>⭐</span>
            Upgrade Plan
          </button>
        </div>
      </nav>

      {/* User card + menu */}
      <div ref={menuRef} style={{ position: 'relative' }}>
        {userMenuOpen && (
          <div className={s.userMenu} role="menu">
            <button className={s.userMenuItem} onClick={() => navigate('/profile')}>My Profile</button>
            <button className={s.userMenuItem} onClick={() => navigate('/billing')}>Billing</button>
            <button className={s.userMenuItem} onClick={() => navigate('/settings')}>Settings</button>
            <div className={s.userMenuDivider} />
            <button className={s.userMenuItem} onClick={handleLogout}>Log out</button>
          </div>
        )}
        <div
          className={s.userCard}
          onClick={() => dispatch(toggleUserMenu())}
          role="button"
          aria-expanded={userMenuOpen}
          aria-haspopup="menu"
          id="user-menu-trigger"
        >
          <div className={s.userAvatar}>
            {user?.avatarInitials ?? 'AJ'}
          </div>
          <div className={s.userMeta}>
            <div className={s.userName}>{user?.fullName ?? 'Alex Johnson'}</div>
            <div className={s.userPlan}>{user?.plan ?? 'Pro'} plan</div>
          </div>
          <span className={cn(s.chevronIcon, userMenuOpen ? s.open : undefined)}>▲</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
