import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<Index />} />
      <Route path="/certifications" element={<Index />} />
      <Route path="/skills" element={<Index />} />
      <Route path="/contact" element={<Index />} />
      <Route path="/experience-education" element={<Index />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
};

export default App;
