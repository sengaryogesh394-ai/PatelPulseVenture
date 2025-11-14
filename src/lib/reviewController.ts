import connectDB from '@/lib/mongodb';
import Review, { IReview } from '@/models/Review';
import mongoose from 'mongoose';
import { ProductController } from '@/lib/productController';

export class ReviewController {
  // Get all reviews (admin)
  static async getAllReviews(options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    await connectDB();

    const {
      page = 1,
      limit = 100,
      status
    } = options;

    const skip = (page - 1) * limit;
    const query = status ? { status } : {};

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query)
    ]);

    // Fetch product names for each review
    const reviewsWithProducts = await Promise.all(
      reviews.map(async (review) => {
        const product = await ProductController.getProductById(review.productId.toString(), 'ppv');
        return {
          ...review,
          productName: product?.data?.name || 'Unknown Product'
        };
      })
    );

    return {
      success: true,
      data: reviewsWithProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get reviews for a product
  static async getProductReviews(productId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    await connectDB();

    const {
      page = 1,
      limit = 10,
      status = 'approved'
    } = options;

    const skip = (page - 1) * limit;

    const [reviews, total, stats] = await Promise.all([
      Review.find({ productId: new mongoose.Types.ObjectId(productId), status })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ productId: new mongoose.Types.ObjectId(productId), status }),
      Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId), status } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            ratings: {
              $push: '$rating'
            }
          }
        }
      ])
    ]);

    // Calculate rating distribution
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (stats[0]?.ratings) {
      stats[0].ratings.forEach((rating: number) => {
        ratingDistribution[rating as keyof typeof ratingDistribution]++;
      });
    }

    return {
      success: true,
      data: {
        reviews,
        stats: {
          averageRating: stats[0]?.averageRating || 0,
          totalReviews: stats[0]?.totalReviews || 0,
          ratingDistribution
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };
  }

  // Create a new review
  static async createReview(reviewData: Partial<IReview>) {
    await connectDB();

    // Check if product exists in either collection
    let exists = false;
    try {
      const id = String(reviewData.productId || '');
      let res = await ProductController.getProductById(id, 'ppv');
      if (res?.success && res?.data) {
        exists = true;
      } else {
        res = await ProductController.getProductById(id, 'digiworldadda');
        if (res?.success && res?.data) exists = true;
      }
    } catch {}
    if (!exists) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    const review = new Review(reviewData);
    await review.save();

    // Update product rating
    await this.updateProductRating(reviewData.productId as any);

    return {
      success: true,
      data: review,
      message: 'Review submitted successfully. It will be visible after approval.'
    };
  }

  // Update product rating and review count
  static async updateProductRating(productId: string) {
    await connectDB();

    const stats = await Review.aggregate([
      { $match: { productId: productId as any, status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats[0]) {
      await ProductController.updateProduct(productId, {
        rating: Math.round(stats[0].averageRating * 10) / 10,
        reviewCount: stats[0].totalReviews
      });
    }

    return {
      success: true
    };
  }

  // Approve review
  static async approveReview(reviewId: string) {
    await connectDB();

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status: 'approved' },
      { new: true }
    );

    if (!review) {
      return {
        success: false,
        error: 'Review not found'
      };
    }

    // Update product rating
    await this.updateProductRating(review.productId.toString());

    return {
      success: true,
      data: review,
      message: 'Review approved successfully'
    };
  }

  // Reject review
  static async rejectReview(reviewId: string) {
    await connectDB();

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status: 'rejected' },
      { new: true }
    );

    if (!review) {
      return {
        success: false,
        error: 'Review not found'
      };
    }

    return {
      success: true,
      data: review,
      message: 'Review rejected successfully'
    };
  }

  // Delete review
  static async deleteReview(reviewId: string) {
    await connectDB();

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return {
        success: false,
        error: 'Review not found'
      };
    }

    // Update product rating
    await this.updateProductRating(review.productId.toString());

    return {
      success: true,
      message: 'Review deleted successfully'
    };
  }

  // Mark review as helpful
  static async markHelpful(reviewId: string) {
    await connectDB();

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return {
        success: false,
        error: 'Review not found'
      };
    }

    return {
      success: true,
      data: review
    };
  }
}
