import React, { useState, useEffect } from 'react';
import { ordersAPI, productsAPI } from '../api';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const BRANCHES = ['Andheri', 'Bandra', 'Dadar', 'Thane'];
const btn = (primary) => ({ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: primary ? 'none' : '0.5px solid #e2e8f0', background: primary ? '#1d4ed8' : '#fff', color: primary ? '#fff' : '#1e293b', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 });
const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '0.5px solid #e2e8f0', background: '#fff', fontSize: 13, color: '#1e293b', fontFamily: 'DM Sans, sans-serif', outline: 'none' };

const statusStyle = (s) => ({
  'Delivered': { bg: '#EAF3DE', color: '#3B6D11' },
  'Processing': { bg: '#E6F1FB', color: '#185FA5' },
  'Shipped': { bg: '#E6F1FB', color: '#185FA5' },
  'Pending': { bg: '#FAEEDA', color: '#854F0B' },
  'Cancelled': { bg: '#FCEBEB', color: '#A32D2D' },
}[s] || { bg: '#f1f5f9', color: '#64748b' });

export default function Orders({ branch }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState({ product: '', quantity: 1, branch: 'Andheri', customerName: '', customerPhone: '', notes: '' });

  useEffect(() => { loadOrders(); loadProducts(); }, [branch]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll({ branch });
      setOrders(res.data.data);
    } catch { toast.error('Failed to load orders'); }
    setLoading(false);
  };

  const loadProducts = async () => {
    try {
      const res = await productsAPI.getAll({ branch });
      setProducts(res.data.data.filter(p => p.stock > 0));
    } catch {}
  };

  const handleCreateOrder = async () => {
    if (!form.product || !form.quantity) return toast.error('Select a product and quantity');
    try {
      await ordersAPI.create(form);
      toast.success('Order placed successfully!');
      setShowModal(false);
      loadOrders();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to place order');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      toast.success(`Status updated to ${status}`);
      loadOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {});

  return (
    <div className="fade-in">
      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...STATUSES].map(s => {
          const st = statusStyle(s);
          const active = filterStatus === s;
          return (
            <div key={s} onClick={() => setFilterStatus(s)} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontWeight: active ? 500 : 400, background: active ? '#185FA5' : '#fff', color: active ? '#fff' : '#64748b', border: '0.5px solid #e2e8f0', transition: 'all 0.15s' }}>
              {s === 'all' ? 'All Orders' : s} {s !== 'all' && counts[s] > 0 ? `(${counts[s]})` : ''}
            </div>
          );
        })}
        <button style={{ ...btn(true), marginLeft: 'auto' }} onClick={() => setShowModal(true)}>
          <i className="ti ti-plus"></i> New Order
        </button>
      </div>

      <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading orders...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Order ID', 'Product', 'Branch', 'Customer', 'Qty', 'Amount', 'Date', 'Status', 'Update'].map(h => (
                  <th key={h} style={{ fontSize: 11, color: '#64748b', textAlign: 'left', padding: '6px 10px', borderBottom: '0.5px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const s = statusStyle(o.status);
                return (
                  <tr key={o._id} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: 10, fontSize: 12, fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{o.orderId}</td>
                    <td style={{ padding: 10, fontSize: 12 }}>{o.productName}</td>
                    <td style={{ padding: 10, fontSize: 12, color: '#64748b' }}>{o.branch}</td>
                    <td style={{ padding: 10, fontSize: 12, color: '#64748b' }}>{o.customerName}</td>
                    <td style={{ padding: 10, fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{o.quantity}</td>
                    <td style={{ padding: 10, fontSize: 12, fontFamily: 'DM Mono, monospace' }}>Rs.{o.amount?.toLocaleString()}</td>
                    <td style={{ padding: 10, fontSize: 11, color: '#94a3b8' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 20 }}>{o.status}</span>
                    </td>
                    <td style={{ padding: 10 }}>
                      <select style={{ ...inp, width: 'auto', fontSize: 11, padding: '4px 8px' }} value={o.status} onChange={e => updateStatus(o._id, e.target.value)}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 13 }}>
            <i className="ti ti-shopping-cart" style={{ fontSize: 32, color: '#e2e8f0' }}></i>
            <div style={{ marginTop: 8 }}>No orders found</div>
          </div>
        )}
      </div>

      {/* New Order Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 460, maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: '#0f172a' }}>New Purchase Order</span>
              <span onClick={() => setShowModal(false)} style={{ cursor: 'pointer', color: '#64748b', fontSize: 18 }}><i className="ti ti-x"></i></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'block' }}>Product *</label>
                <select style={inp} value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
                  <option value="">Select a product</option>
                  {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.branch}) — {p.stock} left</option>)}
                </select>
              </div>
              {[{ label: 'Quantity *', key: 'quantity', type: 'number' },
                { label: 'Customer Name', key: 'customerName', placeholder: 'Walk-in Customer' },
                { label: 'Customer Phone', key: 'customerPhone', placeholder: '+91 XXXXXXXXXX' }
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'block' }}>{f.label}</label>
                  <input style={inp} type={f.type || 'text'} placeholder={f.placeholder || ''} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'block' }}>Branch</label>
                <select style={inp} value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button style={btn(false)} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={btn(true)} onClick={handleCreateOrder}>Place Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
