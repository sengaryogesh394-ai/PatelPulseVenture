import mongoose, { Document, Schema } from 'mongoose';

interface ProductDetail {
  title: string;
  points: string[];
}

export interface IProduct extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageId: string;
  imageUrl?: string;
  longDescription: string;
  details: ProductDetail[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ProductDetailSchema = new Schema({
  title: { type: String, required: true, trim: true },
  points: [{ type: String, required: true, trim: true }],
}, { _id: false });

const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  description: { type: String, required: true, trim: true },
  imageId: { type: String, required: true, trim: true },
  imageUrl: { type: String, trim: true, default: '' },
  longDescription: { type: String, required: true, trim: true },
  details: [ProductDetailSchema],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

ProductSchema.index({ name: 1 });

ProductSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
