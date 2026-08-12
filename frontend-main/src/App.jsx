import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Home from './components/pages/Public/Home';
import FinancialBackground from './components/UI/FinancialBackground';
import WhatsAppFloatingBtn from './components/UI/WhatsAppFloatingBtn';
import { trackVisit } from './services/api';
import { WifiOff, Loader2 } from 'lucide-react';

// Lazy load non-homepage routes to optimize initial bundle size & load speed
const Post = lazy(() => import('./components/pages/Public/Post'));
const Login = lazy(() => import('./components/pages/Admin/Login'));
const Dashboard = lazy(() => import('./components/pages/Admin/Dashboard'));
const Editor = lazy(() => import('./components/pages/Admin/Editor'));
const AdminSeedPanel = lazy(() => import('./components/pages/Admin/AdminSeedPanel'));

const RouteLoader = () => (
  <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
    <Loader2 className="w-8 h-8 text-[#0D47A1] animate-spin" />
    <span className="text-xs font-bold uppercase tracking-widest text-[#0D47A1]/70">Loading Module...</span>
  </div>
);

const ScrollToTopOnRoute = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const NetworkStatusNotifier = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-rose-600 text-white text-xs font-bold py-2 px-4 flex items-center justify-center gap-2 shadow-lg animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>You are currently offline. Check your network connection.</span>
    </div>
  );
};

export const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    trackVisit();
  }, []);

  return (
    <Router>
      <ScrollToTopOnRoute />
      <NetworkStatusNotifier />
      <div className="relative flex flex-col min-h-screen text-[#0D47A1] font-sans antialiased">
        <FinancialBackground />
        <Header onSearchChange={setSearchTerm} searchTerm={searchTerm} />

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
              <Route path="/post/:id" element={<Post />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/seed" element={<AdminSeedPanel />} />
              <Route path="/admin/editor" element={<Editor />} />
              <Route path="/admin/editor/:id" element={<Editor />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <WhatsAppFloatingBtn />
      </div>
    </Router>
  );
};

export default App;
