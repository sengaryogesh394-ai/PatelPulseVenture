'use client';

import { useState, useEffect } from 'react';
import ReviewSection from './ReviewSection';

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

interface ReviewSectionWithHeaderProps {
  productName: string;
  productCategory?: string;
  productId: string;
}

export default function ReviewSectionWithHeader({ productName, productCategory, productId }: ReviewSectionWithHeaderProps) {
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleStatsUpdate = (stats: ReviewStats) => {
    setReviewStats(stats);
  };

  return (
    <>
      {/* Enhanced Section Header */}
      <div className="text-center mb-12">
        <div className="inline-block relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 blur-lg opacity-30 animate-pulse"></div>
          <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600" style={{ fontFamily: 'Oswald, sans-serif' }}>
            ⭐ What Our Customers Say
          </h2>
        </div>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {isHydrated && reviewStats.totalReviews > 0 ? (
            <>
              Real reviews from {reviewStats.totalReviews} customer{reviewStats.totalReviews !== 1 ? 's' : ''} who've transformed their businesses with {productName}
            </>
          ) : (
            <>
              Real reviews from real customers who've transformed their businesses with {productName}
            </>
          )}
        </p>
        {isHydrated && reviewStats.totalReviews > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`text-xl ${star <= Math.round(reviewStats.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-lg font-bold text-gray-700">
              {reviewStats.averageRating.toFixed(1)} out of 5
            </span>
            <span className="text-gray-500">
              ({reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <ReviewSection 
        productId={productId}
        productName={productName}
        productCategory={productCategory}
        onStatsUpdate={handleStatsUpdate}
      />
    </>
  );
}
