import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import AIAssistant from './pages/AIAssistant';

export default function App() {
  const [branch, setBranch] = useState('all');
  const [page, setPage] = useState('dashboard');

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar branch={branch} setBranch={setBranch} page={page} setPage={setPage} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Topbar page={page} branch={branch} />
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#f8fafc' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard branch={branch} />} />
              <Route path="/products" element={<Products branch={branch} />} />
              <Route path="/orders" element={<Orders branch={branch} />} />
              <Route path="/ai" element={<AIAssistant />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
