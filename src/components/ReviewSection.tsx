'use client';

import { useState, useEffect } from 'react';

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  helpful: number;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewSectionProps {
  productName: string;
  productCategory?: string;
  productId: string;
  onStatsUpdate?: (stats: ReviewStats) => void;
}

export default function ReviewSection({ productName, productCategory, productId, onStatsUpdate }: ReviewSectionProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Set hydration state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch reviews on component mount
  useEffect(() => {
    if (isHydrated) {
      fetchReviews();
    }
  }, [productId, isHydrated]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews?limit=3`);
      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        setReviews(data.data.reviews);
        
        // Use API stats if available, otherwise calculate from reviews
        let stats = data.data.stats;
        
        // If stats are empty or invalid, calculate from reviews
        if (!stats || stats.totalReviews === 0) {
          const reviews = data.data.reviews || [];
          if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            
            // Calculate rating distribution
            const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            reviews.forEach((review: Review) => {
              ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
            });
            
            stats = {
              averageRating: Math.round(averageRating * 10) / 10,
              totalReviews: reviews.length,
              ratingDistribution
            };
          }
        }
        
        setReviewStats(stats);
        
        // Notify parent component about stats update
        if (onStatsUpdate) {
          onStatsUpdate(stats);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews?limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setAllReviews(data.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching all reviews:', error);
    }
  };

  const handleViewAllReviews = () => {
    fetchAllReviews();
    setIsAllReviewsModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const reviewData = {
      customerName: formData.get('name') as string,
      customerEmail: formData.get('email') as string,
      rating: selectedRating,
      title: formData.get('title') as string,
      comment: formData.get('comment') as string,
    };

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Review submitted successfully! It will be visible after approval.');
        setIsReviewModalOpen(false);
        setSelectedRating(0);
        (e.target as HTMLFormElement).reset();
      } else {
        alert('Error submitting review: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="mb-12">
      {/* Review Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Overall Rating */}
          <div className="text-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <div className="w-32 h-4 bg-gray-300 rounded mx-auto mb-2"></div>
                <div className="w-40 h-3 bg-gray-300 rounded mx-auto"></div>
              </div>
            ) : (
              <>
                <div className="text-6xl md:text-7xl font-black text-yellow-500 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : '0.0'}
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`text-2xl ${star <= Math.round(reviewStats.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 font-semibold">
                  Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-4 bg-gray-300 rounded"></div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2"></div>
                  <div className="w-12 h-4 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : (
              [5, 4, 3, 2, 1].map((starCount) => {
                const count = reviewStats.ratingDistribution[starCount as keyof typeof reviewStats.ratingDistribution] || 0;
                const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                
                return (
                  <div key={starCount} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{starCount}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Write Review Button */}
          <div className="text-center">
            <button 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => setIsReviewModalOpen(true)}
            >
              ✍️ Write a Review
            </button>
            <p className="text-sm text-gray-500 mt-2">Share your experience</p>
          </div>
        </div>
      </div>

      {/* Featured Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="w-20 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="w-full h-3 bg-gray-300 rounded"></div>
                <div className="w-full h-3 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-20 h-3 bg-gray-300 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))
        ) : reviews.length > 0 ? (
          // Real reviews
          reviews.map((review, index) => {
            const borderColors = ['border-yellow-200', 'border-orange-200', 'border-red-200'];
            const gradientColors = [
              'from-blue-500 to-purple-500',
              'from-green-500 to-teal-500', 
              'from-red-500 to-pink-500'
            ];
            
            return (
              <div key={review._id} className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${borderColors[index % 3]} hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${gradientColors[index % 3]} rounded-full flex items-center justify-center text-white font-bold`}>
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.customerName}</h4>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  {review.title && (
                    <h5 className="font-semibold text-gray-800 mb-2">{review.title}</h5>
                  )}
                  <p className="text-gray-700 leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{review.isVerifiedPurchase ? 'Verified Purchase' : 'Customer Review'}</span>
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            );
          })
        ) : (
          // No reviews state
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Reviews Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share your experience with {productName}!</p>
            <button 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
              onClick={() => setIsReviewModalOpen(true)}
            >
              Write First Review
            </button>
          </div>
        )}
      </div>

      {/* View All Reviews Button */}
      {reviewStats.totalReviews > 3 && (
        <div className="text-center">
          <button 
            className="bg-white/80 hover:bg-white border-2 border-orange-300 hover:border-orange-400 text-orange-600 hover:text-orange-700 px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
            onClick={handleViewAllReviews}
          >
            View All {reviewStats.totalReviews} Reviews →
          </button>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Oswald, sans-serif' }}>
                Write a Review
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setIsReviewModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmitReview}>
              {/* Rating */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-3xl transition-colors ${
                        star <= selectedRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                      }`}
                      onClick={() => handleStarClick(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {selectedRating === 0 && (
                  <p className="text-red-500 text-sm mt-1">Please select a rating</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your email"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Review Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Summarize your experience"
                />
              </div>

              {/* Review */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Review *</label>
                <textarea
                  rows={4}
                  name="comment"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Share your detailed experience with this product..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || selectedRating === 0}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* All Reviews Modal */}
      {isAllReviewsModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Oswald, sans-serif' }}>
                All Reviews ({reviewStats.totalReviews})
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setIsAllReviewsModalOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {allReviews.length > 0 ? (
                allReviews.map((review, index) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{review.customerName}</h4>
                          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                            ))}
                          </div>
                          {review.isVerifiedPurchase && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Verified Purchase</span>
                          )}
                          {review.helpful > 0 && (
                            <span className="text-xs text-gray-500">👍 {review.helpful} helpful</span>
                          )}
                        </div>
                        {review.title && (
                          <h5 className="font-semibold text-gray-800 mb-2">{review.title}</h5>
                        )}
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📝</div>
                  <p className="text-gray-500">No reviews available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
