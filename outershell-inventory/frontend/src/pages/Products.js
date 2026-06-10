import React, { useState, useEffect } from 'react';
import { mockProducts } from '../mockData';
import toast from 'react-hot-toast';

const CATEGORIES = ['T-Shirts','Jeans','Jackets','Hoodies','Shorts','Accessories'];
const BRANCHES = ['Andheri','Bandra','Dadar','Thane'];
const EMOJIS = {'T-Shirts':'👕','Jeans':'👖','Jackets':'🧥','Hoodies':'🧣','Shorts':'🩳','Accessories':'👜'};
const inp = { width:'100%', padding:'8px 12px', borderRadius:8, border:'0.5px solid #e2e8f0', background:'#fff', fontSize:13, color:'#1e293b', fontFamily:'DM Sans, sans-serif', outline:'none' };
const btn = (primary) => ({ padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', border:primary?'none':'0.5px solid #e2e8f0', background:primary?'#1d4ed8':'#fff', color:primary?'#fff':'#1e293b', fontFamily:'DM Sans, sans-serif', display:'flex', alignItems:'center', gap:6 });

export default function Products({ branch }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [aiDesc, setAiDesc] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({ name:'', category:'T-Shirts', price:'', stock:'', branch:'Andheri', sku:'', description:'' });

  useEffect(() => {
    let p = branch === 'all' ? [...mockProducts] : mockProducts.filter(x => x.branch === branch);
    if (search) p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.sku.toLowerCase().includes(search.toLowerCase()));
    setProducts(p);
  }, [branch, search]);

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.sku) return toast.error('Fill all required fields');
    toast.success('Product added! (Demo mode — connect backend to save)');
    setShowModal(false);
  };

  const generateAI = async () => {
    if (!form.name) return toast.error('Enter product name first');
    setAiLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          messages:[{role:'user',content:`Write a short punchy product description for OuterShell, a trendy Indian streetwear brand. Product: "${form.name}", Category: ${form.category}. Keep it 2-3 sentences, youthful tone, no hashtags.`}]
        })
      });
      const data = await res.json();
      setAiDesc(data.content?.[0]?.text || 'Could not generate.');
      toast.success('AI description generated!');
    } catch { toast.error('AI generation failed'); }
    setAiLoading(false);
  };

  const statusStyle = (s) => ({
    'In Stock':{ bg:'#EAF3DE', color:'#3B6D11' },
    'Low Stock':{ bg:'#FAEEDA', color:'#854F0B' },
    'Out of Stock':{ bg:'#FCEBEB', color:'#A32D2D' },
  }[s] || { bg:'#f1f5f9', color:'#64748b' });

  return (
    <div className="fade-in">
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
        {['all',...BRANCHES].map(b => (
          <div key={b} style={{ padding:'5px 14px', borderRadius:20, fontSize:12, cursor:'pointer', background:branch===b?'#185FA5':'#fff', color:branch===b?'#fff':'#64748b', border:'0.5px solid #e2e8f0' }}>
            {b==='all'?'All Branches':b}
          </div>
        ))}
      </div>

      <div style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:16 }}>
        <div style={{ display:'flex', gap:10, marginBottom:14 }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'#f8fafc', borderRadius:8, border:'0.5px solid #e2e8f0' }}>
            <i className="ti ti-search" style={{ color:'#94a3b8' }}></i>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{ border:'none', background:'none', fontSize:13, color:'#1e293b', outline:'none', flex:1, fontFamily:'DM Sans, sans-serif' }} />
          </div>
          <button style={btn(true)} onClick={() => setShowModal(true)}><i className="ti ti-plus"></i> Add Product</button>
        </div>

        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Product','SKU','Category','Branch','Price','Stock','Status'].map(h => (
                <th key={h} style={{ fontSize:11, color:'#64748b', textAlign:'left', padding:'6px 10px', borderBottom:'0.5px solid #e2e8f0', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const s = statusStyle(p.status);
              return (
                <tr key={p._id} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                  <td style={{ padding:10, fontSize:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:32, height:32, borderRadius:6, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{EMOJIS[p.category]||'📦'}</div>
                      <span style={{ fontWeight:500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:10, fontSize:12, fontFamily:'DM Mono, monospace', color:'#64748b' }}>{p.sku}</td>
                  <td style={{ padding:10 }}><span style={{ background:'#E6F1FB', color:'#185FA5', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:500 }}>{p.category}</span></td>
                  <td style={{ padding:10, fontSize:12, color:'#64748b' }}>{p.branch}</td>
                  <td style={{ padding:10, fontSize:12, fontFamily:'DM Mono, monospace' }}>Rs.{p.price}</td>
                  <td style={{ padding:10, fontSize:12, fontFamily:'DM Mono, monospace' }}>{p.stock}</td>
                  <td style={{ padding:10 }}><span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:20 }}>{p.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', borderRadius:12, padding:24, width:500, maxWidth:'95vw', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontSize:15, fontWeight:500 }}>Add New Product</span>
              <span onClick={()=>setShowModal(false)} style={{ cursor:'pointer', color:'#64748b', fontSize:18 }}><i className="ti ti-x"></i></span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[{label:'Product Name *',key:'name',placeholder:'e.g. Slim Fit Jeans'},{label:'SKU Code *',key:'sku',placeholder:'e.g. OS-009'},{label:'Price (Rs.) *',key:'price',type:'number',placeholder:'999'},{label:'Stock Qty',key:'stock',type:'number',placeholder:'50'}].map(f=>(
                <div key={f.key}>
                  <label style={{ fontSize:12, color:'#64748b', marginBottom:5, display:'block' }}>{f.label}</label>
                  <input style={inp} type={f.type||'text'} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} />
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, color:'#64748b', marginBottom:5, display:'block' }}>Category</label>
                <select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
              </div>
              <div>
                <label style={{ fontSize:12, color:'#64748b', marginBottom:5, display:'block' }}>Branch</label>
                <select style={inp} value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})}>{BRANCHES.map(b=><option key={b}>{b}</option>)}</select>
              </div>
            </div>
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#534AB7', marginBottom:6 }}>AI Description Generator</div>
              <div style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:8, padding:12, fontSize:12, minHeight:60, lineHeight:1.6, color:aiLoading?'#94a3b8':'#1e293b' }}>
                {aiLoading?'Generating...':aiDesc||'Click Generate to create AI description...'}
              </div>
              <button onClick={generateAI} disabled={aiLoading} style={{ ...btn(false), marginTop:8, width:'100%', justifyContent:'center', background:'linear-gradient(135deg,#534AB7,#378ADD)', color:'#fff', border:'none', padding:10 }}>
                <i className="ti ti-sparkles"></i> Generate AI Description
              </button>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:16 }}>
              <button style={btn(false)} onClick={()=>setShowModal(false)}>Cancel</button>
              <button style={btn(true)} onClick={handleSubmit}>Add Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
