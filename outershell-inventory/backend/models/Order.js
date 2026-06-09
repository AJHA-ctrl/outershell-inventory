const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  amount: { type: Number, required: true },
  branch: { type: String, required: true, enum: ['Andheri', 'Bandra', 'Dadar', 'Thane'] },
  customerName: { type: String, default: 'Walk-in Customer' },
  customerPhone: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate order ID
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD-${String(1000 + count + 1)}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
