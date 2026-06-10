export const mockProducts = [
  { _id:'1', name:'Classic White Tee', category:'T-Shirts', price:599, stock:42, branch:'Andheri', sku:'OS-001', status:'In Stock', createdAt: new Date() },
  { _id:'2', name:'Slim Fit Black Jeans', category:'Jeans', price:1299, stock:8, branch:'Bandra', sku:'OS-002', status:'Low Stock', createdAt: new Date() },
  { _id:'3', name:'Bomber Jacket Grey', category:'Jackets', price:2499, stock:0, branch:'Dadar', sku:'OS-003', status:'Out of Stock', createdAt: new Date() },
  { _id:'4', name:'Oversized Hoodie Navy', category:'Hoodies', price:899, stock:31, branch:'Thane', sku:'OS-004', status:'In Stock', createdAt: new Date() },
  { _id:'5', name:'Cargo Shorts Beige', category:'Shorts', price:749, stock:5, branch:'Andheri', sku:'OS-005', status:'Low Stock', createdAt: new Date() },
  { _id:'6', name:'Graphic Tee Vol.2', category:'T-Shirts', price:649, stock:22, branch:'Bandra', sku:'OS-006', status:'In Stock', createdAt: new Date() },
  { _id:'7', name:'Denim Jacket Washed', category:'Jackets', price:1899, stock:14, branch:'Dadar', sku:'OS-007', status:'In Stock', createdAt: new Date() },
  { _id:'8', name:'Leather Belt Brown', category:'Accessories', price:399, stock:3, branch:'Thane', sku:'OS-008', status:'Low Stock', createdAt: new Date() },
];

export const mockOrders = [
  { _id:'1', orderId:'ORD-1042', productName:'Classic White Tee', quantity:3, amount:1797, branch:'Andheri', customerName:'Rahul Sharma', status:'Delivered', createdAt: new Date(Date.now()-3600000) },
  { _id:'2', orderId:'ORD-1041', productName:'Slim Fit Black Jeans', quantity:1, amount:1299, branch:'Bandra', customerName:'Priya Patel', status:'Processing', createdAt: new Date(Date.now()-7200000) },
  { _id:'3', orderId:'ORD-1040', productName:'Oversized Hoodie Navy', quantity:2, amount:1798, branch:'Thane', customerName:'Amit Singh', status:'Shipped', createdAt: new Date(Date.now()-86400000) },
  { _id:'4', orderId:'ORD-1039', productName:'Graphic Tee Vol.2', quantity:5, amount:3245, branch:'Bandra', customerName:'Sneha Joshi', status:'Delivered', createdAt: new Date(Date.now()-172800000) },
  { _id:'5', orderId:'ORD-1038', productName:'Cargo Shorts Beige', quantity:1, amount:749, branch:'Andheri', customerName:'Walk-in Customer', status:'Pending', createdAt: new Date(Date.now()-259200000) },
  { _id:'6', orderId:'ORD-1037', productName:'Denim Jacket Washed', quantity:1, amount:1899, branch:'Dadar', customerName:'Rohit Verma', status:'Delivered', createdAt: new Date(Date.now()-345600000) },
];

export const getStats = (branch) => {
  const p = branch === 'all' ? mockProducts : mockProducts.filter(x => x.branch === branch);
  const o = branch === 'all' ? mockOrders : mockOrders.filter(x => x.branch === branch);
  return {
    total: p.length,
    outOfStock: p.filter(x => x.stock === 0).length,
    lowStock: p.filter(x => x.stock > 0 && x.stock < 10).length,
    totalValue: p.reduce((s, x) => s + x.price * x.stock, 0),
    totalStock: p.reduce((s, x) => s + x.stock, 0),
    todayRevenue: o.filter(x => x.status === 'Delivered').slice(0,2).reduce((s,x) => s + x.amount, 0),
    todayOrders: 2,
  };
};
