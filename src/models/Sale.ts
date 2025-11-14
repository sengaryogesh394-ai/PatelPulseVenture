import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  // Product Information
  productId: string;
  productName: string;
  productCategory: string;
  productPrice: number;
  downloadLink?: string;

  // Customer Information
  userId?: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;

  // Payment Information
  paymentId?: string;
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  paymentMethod?: string;

  // Status Information
  paymentStatus: 'pending' | 'success' | 'failed' | 'cancelled';
  orderStatus: 'created' | 'processing' | 'completed' | 'failed' | 'refunded';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  paymentCompletedAt?: Date;

  // Additional Details
  receiptId: string;
  notes?: Record<string, any>;
  failureReason?: string;
  refundId?: string;
  refundAmount?: number;
  refundStatus?: 'pending' | 'processed' | 'failed';

  // Analytics
  userAgent?: string;
  ipAddress?: string;
  source?: string; // 'web', 'mobile', etc.
}

const SaleSchema = new Schema<ISale>({
  // Product Information
  productId: {
    type: String,
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: true
  },
  productCategory: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  downloadLink: {
    type: String
  },

  // Customer Information
  userId: {
    type: String,
    index: true
  },
  customerEmail: {
    type: String,
    required: true,
    index: true
  },
  customerPhone: {
    type: String
  },
  customerName: {
    type: String
  },

  // Payment Information
  paymentId: {
    type: String,
    index: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  razorpayOrderId: {
    type: String,
    index: true
  },
  razorpayPaymentId: {
    type: String,
    index: true
  },
  razorpaySignature: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String
  },

  // Status Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  orderStatus: {
    type: String,
    enum: ['created', 'processing', 'completed', 'failed', 'refunded'],
    default: 'created',
    index: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  paymentCompletedAt: {
    type: Date
  },

  // Additional Details
  receiptId: {
    type: String,
    required: true
  },
  notes: {
    type: Schema.Types.Mixed
  },
  failureReason: {
    type: String
  },
  refundId: {
    type: String
  },
  refundAmount: {
    type: Number
  },
  refundStatus: {
    type: String,
    enum: ['pending', 'processed', 'failed']
  },

  // Analytics
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  },
  source: {
    type: String,
    default: 'web'
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
SaleSchema.index({ paymentStatus: 1, createdAt: -1 });
SaleSchema.index({ customerEmail: 1, createdAt: -1 });
SaleSchema.index({ userId: 1, createdAt: -1 });
SaleSchema.index({ productId: 1, createdAt: -1 });

// Update the updatedAt field before saving
SaleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);
