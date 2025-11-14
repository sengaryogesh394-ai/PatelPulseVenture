import mongoose, { Document, Schema } from 'mongoose';

// Interface for Service Detail
interface ServiceDetail {
  title: string;
  points: string[];
}

// Interface for Service Document
export interface IService extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageId: string;
  longDescription: string;
  details: ServiceDetail[];
  createdAt: Date;
  updatedAt: Date;
}

// Service Detail Schema
const ServiceDetailSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  points: [{
    type: String,
    required: true,
    trim: true
  }]
}, { _id: false });

// Service Schema
const ServiceSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageId: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  cloudinaryPublicId: {
    type: String,
    required: false,
  },
  longDescription: {
    type: String,
    required: true,
    trim: true
  },
  details: [ServiceDetailSchema],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes (removed duplicate slug index)
ServiceSchema.index({ name: 1 });

// Pre-save middleware to generate slug if not provided
ServiceSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Export the model
export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
