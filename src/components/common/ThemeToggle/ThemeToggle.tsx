import React from 'react';
import { toggleTheme } from '../../../store/slices/themeSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  return (
    <button
      id="theme-toggle-btn"
      className="icon-btn"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
