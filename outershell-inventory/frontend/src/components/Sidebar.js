import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const branches = ['all', 'Andheri', 'Bandra', 'Dadar', 'Thane'];

export default function Sidebar({ branch, setBranch, page, setPage }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navTo = (path, p) => { setPage(p); navigate(path); };

  const NavItem = ({ icon, label, path, p }) => {
    const active = location.pathname === path;
    return (
      <div onClick={() => navTo(path, p)} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 20px', cursor: 'pointer', fontSize: 13,
        color: active ? '#378ADD' : '#94a3b8',
        background: active ? '#EBF4FF' : 'transparent',
        borderLeft: `2px solid ${active ? '#378ADD' : 'transparent'}`,
        fontWeight: active ? 500 : 400,
        transition: 'all 0.15s'
      }}>
        <i className={`ti ti-${icon}`} style={{ fontSize: 16 }}></i> {label}
      </div>
    );
  };

  return (
    <div style={{
      width: 220, background: '#0f172a',
      borderRight: '0.5px solid #1e293b',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '0.5px solid #1e3a5f' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
          <i className="ti ti-building-store" style={{ color: '#378ADD', marginRight: 6 }}></i>
          OuterShell
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Inventory Management</div>
      </div>

      {/* Active Branch */}
      <div style={{ margin: '12px 12px 4px', padding: '10px 12px', background: '#1e293b', borderRadius: 8, border: '0.5px solid #1e3a5f' }}>
        <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Branch</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginTop: 3 }}>
          {branch === 'all' ? 'All Branches' : branch}
        </div>
      </div>

      {/* Nav */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#475569', padding: '14px 20px 6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Main</div>
      <NavItem icon="layout-dashboard" label="Dashboard" path="/dashboard" p="dashboard" />
      <NavItem icon="shirt" label="Products" path="/products" p="products" />
      <NavItem icon="shopping-cart" label="Orders" path="/orders" p="orders" />

      {/* Branch Switcher */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#475569', padding: '14px 20px 6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Branches</div>
      {branches.map(b => (
        <div key={b} onClick={() => setBranch(b)} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 20px', cursor: 'pointer', fontSize: 13,
          color: branch === b ? '#38bdf8' : '#94a3b8',
          background: branch === b ? 'rgba(56,189,248,0.08)' : 'transparent',
          transition: 'all 0.15s'
        }}>
          <i className={`ti ti-${b === 'all' ? 'building' : 'map-pin'}`} style={{ fontSize: 15 }}></i>
          {b === 'all' ? 'All Branches' : b}
        </div>
      ))}

      <div style={{ fontSize: 10, fontWeight: 600, color: '#475569', padding: '14px 20px 6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tools</div>
      <NavItem icon="sparkles" label="AI Assistant" path="/ai" p="ai" />

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '0.5px solid #1e3a5f' }}>
        <div style={{ fontSize: 11, color: '#475569' }}>Logged in as</div>
        <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>Aniket Jha</div>
      </div>
    </div>
  );
}
