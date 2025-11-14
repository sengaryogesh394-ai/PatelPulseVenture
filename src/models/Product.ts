import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedia {
  id: string;
  url: string;
  hint: string;
  type: 'image' | 'video';
}

export interface IFeature {
  icon: string;
  title: string;
  description: string;
  value: string;
}

export interface ICompatibility {
  title: string;
  details: string[];
  notes?: string;
}

export interface IPromotion {
  enabled: boolean;
  discountPercentage: number;
  timerEndDate?: Date;
  timerDuration?: number; // in hours
}

export interface IPromotionalHeader {
  enabled: boolean;
  topBannerText?: string;
  topBannerSubtext?: string;
  buttonText?: string;
  buttonPrice?: string;
  buttonSubtext?: string;
  headlinePart1?: string;
  headlinePart2?: string;
  subHeading?: string;
  platformText?: string;
  highlightText?: string;
  timerEndDate?: Date;
}

export interface IBenefitItem {
  icon: string;
  title: string;
  description: string;
}

export interface IProductBenefits {
  enabled: boolean;
  mainTitle?: string;
  subtitle?: string;
  benefits: IBenefitItem[];
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  media: IMedia[];
  category: string;
  description: string;
  downloadLink?: string;
  isFeatured: boolean;
  features: IFeature[];
  compatibility?: ICompatibility;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  sales: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  promotion?: IPromotion;
  promotionalHeader?: IPromotionalHeader;
  productBenefits?: IProductBenefits;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>({
  id: { type: String, required: true },
  url: { type: String, required: true },
  hint: { type: String, required: false, default: 'product media' },
  type: { type: String, enum: ['image', 'video'], required: true }
});

const FeatureSchema = new Schema<IFeature>({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: String, required: true }
});

const CompatibilitySchema = new Schema<ICompatibility>({
  title: { type: String, required: true },
  details: [{ type: String, required: true }],
  notes: { type: String }
});

export const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Original price cannot be negative']
    },
    media: {
      type: [MediaSchema],
      required: [true, 'At least one media item is required'],
      validate: {
        validator: function(v: IMedia[]) {
          return v && v.length > 0;
        },
        message: 'Product must have at least one media item'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    downloadLink: {
      type: String,
      trim: true,
      default: ''
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    features: {
      type: [FeatureSchema],
      default: []
    },
    compatibility: {
      type: CompatibilitySchema,
      required: false
    },
    stock: {
      type: Number,
      default: 999,
      min: [0, 'Stock cannot be negative']
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active'
    },
    sales: {
      type: Number,
      default: 0,
      min: [0, 'Sales cannot be negative']
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative']
    },
    tags: {
      type: [String],
      default: []
    },
    promotion: {
      enabled: { 
        type: Boolean, 
        default: false 
      },
      discountPercentage: { 
        type: Number, 
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
      },
      timerEndDate: { 
        type: Date 
      },
      timerDuration: { 
        type: Number, 
        default: 24,
        min: [1, 'Timer duration must be at least 1 hour']
      }
    },
    promotionalHeader: {
      enabled: {
        type: Boolean,
        default: false
      },
      topBannerText: {
        type: String,
        trim: true,
        default: ''
      },
      topBannerSubtext: {
        type: String,
        trim: true,
        default: ''
      },
      buttonText: {
        type: String,
        trim: true,
        default: ''
      },
      buttonPrice: {
        type: String,
        trim: true,
        default: ''
      },
      buttonSubtext: {
        type: String,
        trim: true,
        default: ''
      },
      headlinePart1: {
        type: String,
        trim: true,
        default: ''
      },
      headlinePart2: {
        type: String,
        trim: true,
        default: ''
      },
      subHeading: {
        type: String,
        trim: true,
        default: ''
      },
      platformText: {
        type: String,
        trim: true,
        default: ''
      },
      highlightText: {
        type: String,
        trim: true,
        default: ''
      },
      timerEndDate: {
        type: Date
      }
    },
    productBenefits: {
      enabled: {
        type: Boolean,
        default: false
      },
      mainTitle: {
        type: String,
        trim: true,
        default: ''
      },
      subtitle: {
        type: String,
        trim: true,
        default: ''
      },
      benefits: [{
        icon: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true,
          trim: true
        },
        description: {
          type: String,
          required: true,
          trim: true
        }
      }]
    }
  },
  {
    timestamps: true
  }
);

// Generate slug from name before saving
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Update status based on stock
ProductSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  }
  next();
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
