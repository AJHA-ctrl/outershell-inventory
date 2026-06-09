import React, { useState, useEffect } from 'react';
import { productsAPI, aiAPI } from '../api';
import toast from 'react-hot-toast';

const CATEGORIES = ['T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Shorts', 'Accessories'];
const BRANCHES = ['Andheri', 'Bandra', 'Dadar', 'Thane'];
const EMOJIS = { 'T-Shirts': '👕', 'Jeans': '👖', 'Jackets': '🧥', 'Hoodies': '🧣', 'Shorts': '🩳', 'Accessories': '👜' };

const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '0.5px solid #e2e8f0', background: '#fff', fontSize: 13, color: '#1e293b', fontFamily: 'DM Sans, sans-serif', outline: 'none' };
const btn = (primary) => ({ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: primary ? 'none' : '0.5px solid #e2e8f0', background: primary ? '#1d4ed8' : '#fff', color: primary ? '#fff' : '#1e293b', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 });

export default function Products({ branch }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [aiDesc, setAiDesc] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'T-Shirts', price: '', stock: '', branch: 'Andheri', sku: '', description: '' });

  useEffect(() => { loadProducts(); }, [branch, search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getAll({ branch, search });
      setProducts(res.data.data);
    } catch { toast.error('Failed to load products'); }
    setLoading(false);
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: '', category: 'T-Shirts', price: '', stock: '', branch: 'Andheri', sku: '', description: '' });
    setAiDesc('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, branch: p.branch, sku: p.sku, description: p.description });
    setAiDesc(p.aiDescription || '');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.sku) return toast.error('Fill all required fields');
    try {
      const payload = { ...form, aiDescription: aiDesc };
      if (editProduct) {
        await productsAPI.update(editProduct._id, payload);
        toast.success('Product updated!');
      } else {
        await productsAPI.create(payload);
        toast.success('Product added!');
      }
      setShowModal(false);
      loadProducts();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted');
      loadProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const generateAI = async () => {
    if (!form.name) return toast.error('Enter product name first');
    setAiLoading(true);
    try {
      const res = await aiAPI.describe({ name: form.name, category: form.category });
      setAiDesc(res.data.description);
      toast.success('AI description generated!');
    } catch { toast.error('AI generation failed'); }
    setAiLoading(false);
  };

  const statusBadge = (s) => {
    const styles = {
      'In Stock': { bg: '#EAF3DE', color: '#3B6D11' },
      'Low Stock': { bg: '#FAEEDA', color: '#854F0B' },
      'Out of Stock': { bg: '#FCEBEB', color: '#A32D2D' },
    };
    return styles[s] || styles['In Stock'];
  };

  return (
    <div className="fade-in">
      {/* Branch Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...BRANCHES].map(b => (
          <div key={b} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontWeight: branch === b ? 500 : 400, background: branch === b ? '#185FA5' : '#fff', color: branch === b ? '#fff' : '#64748b', border: '0.5px solid #e2e8f0', transition: 'all 0.15s' }}>
            {b === 'all' ? 'All Branches' : b}
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
        {/* Search + Add */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '0.5px solid #e2e8f0' }}>
            <i className="ti ti-search" style={{ color: '#94a3b8' }}></i>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, SKU, category..." style={{ border: 'none', background: 'none', fontSize: 13, color: '#1e293b', outline: 'none', flex: 1, fontFamily: 'DM Sans, sans-serif' }} />
          </div>
          <button style={btn(true)} onClick={openAdd}><i className="ti ti-plus"></i> Add Product</button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading products...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Product', 'SKU', 'Category', 'Branch', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ fontSize: 11, color: '#64748b', textAlign: 'left', padding: '6px 10px', borderBottom: '0.5px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const s = statusBadge(p.status);
                return (
                  <tr key={p._id} style={{ transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '10px', fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{EMOJIS[p.category] || '📦'}</div>
                        <span style={{ fontWeight: 500, color: '#0f172a' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: 10, fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#64748b' }}>{p.sku}</td>
                    <td style={{ padding: 10, fontSize: 12 }}>
                      <span style={{ background: '#E6F1FB', color: '#185FA5', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>{p.category}</span>
                    </td>
                    <td style={{ padding: 10, fontSize: 12, color: '#64748b' }}>{p.branch}</td>
                    <td style={{ padding: 10, fontSize: 12, fontFamily: 'DM Mono, monospace' }}>Rs.{p.price}</td>
                    <td style={{ padding: 10, fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{p.stock}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20 }}>{p.status}</span>
                    </td>
                    <td style={{ padding: 10 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openEdit(p)} style={{ ...btn(false), padding: '4px 10px', fontSize: 11 }}><i className="ti ti-edit"></i></button>
                        <button onClick={() => handleDelete(p._id)} style={{ ...btn(false), padding: '4px 10px', fontSize: 11, color: '#A32D2D' }}><i className="ti ti-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 13 }}>
            <i className="ti ti-package" style={{ fontSize: 32, color: '#e2e8f0' }}></i>
            <div style={{ marginTop: 8 }}>No products found. Add your first product!</div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #e2e8f0', padding: 24, width: 500, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: '#0f172a' }}>{editProduct ? 'Edit Product' : 'Add New Product'}</span>
              <span onClick={() => setShowModal(false)} style={{ cursor: 'pointer', color: '#64748b', fontSize: 18 }}><i className="ti ti-x"></i></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ label: 'Product Name *', key: 'name', placeholder: 'e.g. Slim Fit Jeans' },
                { label: 'SKU Code *', key: 'sku', placeholder: 'e.g. OS-001' },
                { label: 'Price (Rs.) *', key: 'price', type: 'number', placeholder: '999' },
                { label: 'Stock Qty', key: 'stock', type: 'number', placeholder: '50' }
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'block' }}>{f.label}</label>
                  <input style={inp} type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'block' }}>Category</label>
                <select style={inp} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'block' }}>Branch</label>
                <select style={inp} value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* AI Description */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#534AB7', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#534AB7', display: 'inline-block', animation: 'pulse 1s infinite' }}></span>
                AI Description Generator
              </div>
              <div style={{ background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 8, padding: 12, fontSize: 12, color: aiLoading ? '#94a3b8' : '#1e293b', minHeight: 60, lineHeight: 1.6, fontStyle: aiLoading ? 'italic' : 'normal' }}>
                {aiLoading ? 'Generating...' : aiDesc || 'Click "Generate AI Description" to create one automatically.'}
              </div>
              <button onClick={generateAI} disabled={aiLoading} style={{ ...btn(false), marginTop: 8, width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #534AB7, #378ADD)', color: '#fff', border: 'none', padding: 10 }}>
                <i className="ti ti-sparkles"></i> {aiLoading ? 'Generating...' : 'Generate AI Description'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button style={btn(false)} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={btn(true)} onClick={handleSubmit}>{editProduct ? 'Update Product' : 'Add Product'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
