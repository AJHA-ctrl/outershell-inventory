import React, { useState } from 'react';
import { aiAPI } from '../api';
import toast from 'react-hot-toast';

const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '0.5px solid #e2e8f0', background: '#fff', fontSize: 13, color: '#1e293b', fontFamily: 'DM Sans, sans-serif', outline: 'none' };
const CATEGORIES = ['T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Shorts', 'Accessories'];

export default function AIAssistant() {
  const [tab, setTab] = useState('describe');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('T-Shirts');
  const [notes, setNotes] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!name) return toast.error('Enter a product name first');
    setLoading(true);
    setOutput('');
    try {
      let res;
      if (tab === 'describe') res = await aiAPI.describe({ name, category, notes });
      else res = await aiAPI.marketing({ name, category, notes });
      setOutput(tab === 'describe' ? res.data.description : res.data.content);
      toast.success('Generated!');
    } catch { toast.error('AI generation failed. Check API key in .env'); }
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 680 }}>
      <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#0f172a' }}>
              <i className="ti ti-sparkles" style={{ color: '#534AB7', marginRight: 6 }}></i>AI Assistant
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Powered by Claude AI — Generate descriptions & marketing copy</div>
          </div>
          <span style={{ background: '#EEEDFE', color: '#534AB7', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>Claude AI</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '0.5px solid #e2e8f0', marginBottom: 16 }}>
          {[{ key: 'describe', label: 'Product Description' }, { key: 'marketing', label: 'Full Marketing Copy' }].map(t => (
            <div key={t.key} onClick={() => { setTab(t.key); setOutput(''); }} style={{ padding: '8px 16px', fontSize: 13, cursor: 'pointer', color: tab === t.key ? '#378ADD' : '#64748b', borderBottom: `2px solid ${tab === t.key ? '#378ADD' : 'transparent'}`, fontWeight: tab === t.key ? 500 : 400, marginBottom: -0.5, transition: 'all 0.15s' }}>
              {t.label}
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'block' }}>Product Name *</label>
            <input style={inp} placeholder="e.g. Slim Fit Cargo Pants" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'block' }}>Category</label>
            <select style={inp} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 5, display: 'block' }}>Style Notes (optional)</label>
            <input style={inp} placeholder="e.g. Streetwear, beige color, 6 pockets, oversized fit" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        <button onClick={generate} disabled={loading} style={{ width: '100%', padding: 11, borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #534AB7, #378ADD)', color: '#fff', fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.8 : 1 }}>
          <i className="ti ti-sparkles"></i> {loading ? 'Generating...' : tab === 'describe' ? 'Generate Description' : 'Generate Full Marketing Copy'}
        </button>

        {/* Output */}
        {(output || loading) && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#534AB7', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#534AB7', display: 'inline-block', animation: loading ? 'pulse 1s infinite' : 'none' }}></span>
              AI Output
            </div>
            <div style={{ background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 8, padding: 14, fontSize: 13, color: loading ? '#94a3b8' : '#1e293b', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontStyle: loading ? 'italic' : 'normal', minHeight: 80 }}>
              {loading ? 'Generating your content...' : output}
            </div>
            {output && (
              <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied!'); }} style={{ marginTop: 8, padding: '6px 14px', borderRadius: 8, border: '0.5px solid #e2e8f0', background: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, sans-serif', color: '#64748b' }}>
                <i className="ti ti-copy"></i> Copy to Clipboard
              </button>
            )}
          </div>
        )}

        {/* Tips */}
        {!output && !loading && (
          <div style={{ marginTop: 16, padding: 14, background: '#f8fafc', borderRadius: 8, border: '0.5px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#0f172a', marginBottom: 8 }}>Tips for better results:</div>
            {['Be specific with product name — "Baggy Cargo Pants" is better than "Pants"',
              'Add style notes like color, fit, material for more accurate copy',
              'Full Marketing Copy generates Instagram caption + WhatsApp message too'
            ].map((tip, i) => (
              <div key={i} style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                <i className="ti ti-bulb" style={{ color: '#534AB7', marginRight: 6 }}></i>{tip}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
