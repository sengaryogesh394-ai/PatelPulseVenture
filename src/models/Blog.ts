import mongoose, { Document, Schema } from 'mongoose';

// Interface for Blog Document
export interface IBlog extends Document {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  imageId?: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt?: Date;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

// Blog Schema
const BlogSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
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
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  imageId: {
    type: String,
    required: false,
    trim: true
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true
  },
  cloudinaryPublicId: {
    type: String,
    required: false,
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  readTime: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true,
});

// Force delete cached model to ensure schema updates are applied
if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

// Create indexes for better performance
BlogSchema.index({ id: 1 });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ featured: 1 });
BlogSchema.index({ publishedAt: -1 });

const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
