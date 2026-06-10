import React, { useState, useEffect } from 'react';
import { mockProducts, mockOrders, getStats } from '../mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MetricCard = ({ label, value, delta, deltaType, icon }) => (
  <div style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:16 }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
      <div style={{ fontSize:11, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
      <i className={`ti ti-${icon}`} style={{ fontSize:18, color:'#3b82f6' }}></i>
    </div>
    <div style={{ fontSize:24, fontWeight:500, color:'#0f172a', margin:'6px 0 2px', fontFamily:'DM Mono, monospace' }}>{value}</div>
    <div style={{ fontSize:12, color: deltaType==='up'?'#3B6D11': deltaType==='down'?'#A32D2D':'#64748b' }}>{delta}</div>
  </div>
);

export default function Dashboard({ branch }) {
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [lowItems, setLowItems] = useState([]);

  useEffect(() => {
    const s = getStats(branch);
    setStats(s);
    const fp = branch === 'all' ? mockProducts : mockProducts.filter(p => p.branch === branch);
    const fo = branch === 'all' ? mockOrders : mockOrders.filter(o => o.branch === branch);
    setProducts(fp);
    setOrders(fo.slice(0,5));
    const cats = {};
    fp.forEach(p => { cats[p.category] = (cats[p.category]||0) + p.stock; });
    setChartData(Object.entries(cats).map(([name, stock]) => ({ name, stock })));
    setLowItems(fp.filter(p => p.stock > 0 && p.stock < 10).slice(0,4));
  }, [branch]);

  const statusColor = (s) => s==='Delivered'?'#3B6D11':s==='Processing'||s==='Shipped'?'#185FA5':'#854F0B';
  const statusBg = (s) => s==='Delivered'?'#EAF3DE':s==='Processing'||s==='Shipped'?'#E6F1FB':'#FAEEDA';

  return (
    <div className="fade-in">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <MetricCard label="Total Products" value={stats.total} delta="Active SKUs" deltaType="neutral" icon="shirt" />
        <MetricCard label="Total Stock" value={stats.totalStock} delta="Units in inventory" deltaType="neutral" icon="packages" />
        <MetricCard label="Inventory Value" value={`Rs.${stats.totalValue?.toLocaleString()}`} delta="Estimated stock value" deltaType="up" icon="chart-line" />
        <MetricCard label="Today's Revenue" value={`Rs.${stats.todayRevenue?.toLocaleString()}`} delta={`${stats.todayOrders} orders today`} deltaType="up" icon="cash" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        <div style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:16 }}>
          <div style={{ fontSize:13, fontWeight:500, color:'#0f172a', marginBottom:14 }}>
            <i className="ti ti-chart-bar" style={{ marginRight:6, color:'#378ADD' }}></i>Stock by Category
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} />
              <YAxis tick={{ fontSize:10, fill:'#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize:12, borderRadius:8 }} />
              <Bar dataKey="stock" fill="#378ADD" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:500, color:'#0f172a' }}>
              <i className="ti ti-alert-triangle" style={{ marginRight:6, color:'#E24B4A' }}></i>Low Stock Alerts
            </div>
            <span style={{ background:'#FCEBEB', color:'#A32D2D', fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:20 }}>
              {lowItems.length} items
            </span>
          </div>
          {lowItems.length === 0
            ? <div style={{ textAlign:'center', padding:32, color:'#64748b', fontSize:13 }}>All stock levels healthy!</div>
            : lowItems.map(p => (
              <div key={p._id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'0.5px solid #f1f5f9' }}>
                <div style={{ fontSize:12, color:'#1e293b', flex:1 }}>{p.name}</div>
                <div style={{ flex:2, height:6, background:'#f1f5f9', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min((p.stock/20)*100,100)}%`, background:'#E24B4A', borderRadius:3 }}></div>
                </div>
                <div style={{ fontSize:11, fontWeight:600, color:'#A32D2D', fontFamily:'DM Mono, monospace', width:40, textAlign:'right' }}>{p.stock} left</div>
              </div>
            ))
          }
          {stats.outOfStock > 0 && (
            <div style={{ marginTop:10, padding:'8px 10px', background:'#FCEBEB', borderRadius:6, fontSize:12, color:'#A32D2D' }}>
              <i className="ti ti-x"></i> {stats.outOfStock} product(s) out of stock
            </div>
          )}
        </div>
      </div>

      <div style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:16 }}>
        <div style={{ fontSize:13, fontWeight:500, color:'#0f172a', marginBottom:14 }}>
          <i className="ti ti-shopping-cart" style={{ marginRight:6, color:'#378ADD' }}></i>Recent Orders
        </div>
        {orders.map(o => (
          <div key={o._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'0.5px solid #f1f5f9' }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'#E6F1FB', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className="ti ti-package" style={{ fontSize:15, color:'#185FA5' }}></i>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:500, color:'#0f172a' }}>{o.orderId} — {o.productName}</div>
              <div style={{ fontSize:11, color:'#64748b', marginTop:1 }}>{o.branch} · Qty: {o.quantity} · {o.customerName}</div>
            </div>
            <span style={{ background:statusBg(o.status), color:statusColor(o.status), fontSize:11, fontWeight:500, padding:'2px 10px', borderRadius:20 }}>{o.status}</span>
            <div style={{ fontSize:13, fontWeight:500, fontFamily:'DM Mono, monospace' }}>Rs.{o.amount?.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
