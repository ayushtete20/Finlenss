import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Home from './components/pages/Public/Home';
import Post from './components/pages/Public/Post';
import Login from './components/pages/Admin/Login';
import Dashboard from './components/pages/Admin/Dashboard';
import Editor from './components/pages/Admin/Editor';
import AdminSeedPanel from './components/pages/Admin/AdminSeedPanel';
import FinancialBackground from './components/UI/FinancialBackground';
import WhatsAppFloatingBtn from './components/UI/WhatsAppFloatingBtn';
import { trackVisit } from './services/api';

const ScrollToTopOnRoute = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

export const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    trackVisit();
  }, []);

  return (
    <Router>
      <ScrollToTopOnRoute />
      <div className="relative flex flex-col min-h-screen text-[#0D47A1] font-sans antialiased">
        <FinancialBackground />
        <Header onSearchChange={setSearchTerm} searchTerm={searchTerm} />

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </main>

        <Footer />
        <WhatsAppFloatingBtn />
      </div>
    </Router>
  );
};

export default App;
