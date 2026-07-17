import React from 'react';
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle';
import s from './Topbar.module.scss';

interface TopbarProps {
  title: string;
}

const Topbar: React.FC<TopbarProps> = ({ title }) => (
  <header className={s.topbar}>
    <span className={s.title}>{title}</span>
    <div className={s.right}>
      <ThemeToggle />
      <button className="icon-btn" aria-label="Notifications" id="notif-btn">🔔</button>
    </div>
  </header>
);

export default Topbar;
