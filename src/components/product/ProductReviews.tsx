'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpful: number;
  createdAt: string;
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

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      const result = await response.json();
      
      if (result.success) {
        setReviews(result.data.reviews);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Review submitted!",
          description: result.message,
        });
        setFormData({
          customerName: '',
          customerEmail: '',
          rating: 5,
          title: '',
          comment: ''
        });
        setShowForm(false);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <section className="max-w-4xl mx-auto">
      <Card className="bg-white dark:bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          {/* Rating Summary */}
          {stats && stats.totalReviews > 0 && (
            <div className="mb-8 pb-8 border-b">
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-800 dark:text-gray-100">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <div className="mt-2">{renderStars(Math.round(stats.averageRating))}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stats.totalReviews} reviews
                  </div>
                </div>

                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2 mb-1">
                      <span className="text-sm w-12">{rating} star</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${
                              stats.totalReviews > 0
                                ? (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] /
                                    stats.totalReviews) *
                                  100
                                : 0
                            }%`
                          }}
                        />
                      </div>
                      <span className="text-sm w-8 text-right">
                        {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Write Review Button */}
          {!showForm && (
            <div className="mb-6 text-center">
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                Write a Review
              </Button>
            </div>
          )}

          {/* Review Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                {renderStars(formData.rating, true)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    required
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sum up your experience"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Review</label>
                <Textarea
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your thoughts about this product"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.customerName}</span>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                  
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
