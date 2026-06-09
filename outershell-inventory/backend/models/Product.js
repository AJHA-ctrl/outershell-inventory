const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Shorts', 'Accessories'] },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  branch: { type: String, required: true, enum: ['Andheri', 'Bandra', 'Dadar', 'Thane'] },
  sku: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, default: '' },
  aiDescription: { type: String, default: '' },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  }
}, { timestamps: true });

// Auto-update status based on stock
productSchema.pre('save', function (next) {
  if (this.stock === 0) this.status = 'Out of Stock';
  else if (this.stock < 10) this.status = 'Low Stock';
  else this.status = 'In Stock';
  next();
});

module.exports = mongoose.model('Product', productSchema);
