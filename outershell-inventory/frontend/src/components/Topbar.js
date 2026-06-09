import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const titles = {
  '/dashboard': { title: 'Dashboard', sub: 'Overview of all branches' },
  '/products': { title: 'Products', sub: 'Manage your inventory' },
  '/orders': { title: 'Orders', sub: 'Track purchase orders' },
  '/ai': { title: 'AI Assistant', sub: 'Powered by Claude AI' },
};

export default function Topbar({ branch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const info = titles[location.pathname] || { title: 'OuterShell', sub: '' };

  return (
    <div style={{
      background: '#fff', borderBottom: '0.5px solid #e2e8f0',
      padding: '14px 24px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0
    }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#0f172a' }}>{info.title}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
          {info.sub} {branch !== 'all' ? `— ${branch} Branch` : '— All 4 Branches'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => navigate('/orders')} style={{
          padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          cursor: 'pointer', border: '0.5px solid #e2e8f0', background: '#fff',
          color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'DM Sans, sans-serif'
        }}>
          <i className="ti ti-plus"></i> New Order
        </button>
        <button onClick={() => navigate('/products')} style={{
          padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          cursor: 'pointer', border: '0.5px solid #1d4ed8', background: '#1d4ed8',
          color: '#fff', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'DM Sans, sans-serif'
        }}>
          <i className="ti ti-plus"></i> Add Product
        </button>
      </div>
    </div>
  );
}
