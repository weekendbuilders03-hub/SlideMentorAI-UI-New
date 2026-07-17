import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import s from './AppLayout.module.scss';

interface AppLayoutProps {
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ title }) => (
  <div className={s.app}>
    <Sidebar />
    <div className={s.main}>
      <Topbar title={title} />
      <main className={s.content}>
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout;
