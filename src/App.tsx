import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import Layout from './pages/Layout/Layout';
import Pricing from './pages/Pricing/Pricing';
import AppRoutes from './Routes/AppRoutes';

import ProtectedRoute from './Routes/protectedRoute';
import { Suspense, useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { initializeAuth } from './store/features/auth';


function App() {
  const dispatch = useAppDispatch();

  // Initialize auth state from sessionStorage on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>  
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />} />
        <Route path="/authentication" element={<Auth />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected routes with layout */}
        <Route element={<ProtectedRoute />}>
          <Route>
            {AppRoutes.filter((i) => i.loadable).map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <route.component />
                  </Suspense>
                }
              />
            ))}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
