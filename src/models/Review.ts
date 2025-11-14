import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    customerEmail: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters']
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0,
      min: [0, 'Helpful count cannot be negative']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying
ReviewSchema.index({ productId: 1, status: 1, createdAt: -1 });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
