'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import PromotionalHeaderTimer from '../../../components/PromotionalHeaderTimer';

import { PlaceHolderImages } from '@/lib/placeholder-images';
// Removed ProductController import to avoid client-side MongoDB connection
import ProductDetailClient from '../../../components/product/ProductDetailClient';
import ProductReviews from '../../../components/product/ProductReviews';
import ReviewSectionWithHeader from '../../../components/ReviewSectionWithHeader';
import { usePayment } from '../../../hooks/usePayment';

import { Zap, Check, ArrowLeft, Home } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ProductDetailsPageProps {
  params: Promise<{ productId: string }>;
}

const ProductDetailsPage = ({ params }: ProductDetailsPageProps) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState<any>(null);
  const { initiatePaymentWithModal, loading: paymentLoading } = usePayment();
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);
  const allowLeaveRef = useRef(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const resolvedParams = await params;
        const idOrSlug = resolvedParams.productId;

        // Try PPV first
        let response = await fetch(`/api/products/${idOrSlug}?company=ppv`);
        let result = await response.json();

        // If not found, try Digiworldadda
        if (!result?.success || !result?.data) {
          response = await fetch(`/api/products/${idOrSlug}?company=digiworldadda`);
          result = await response.json();
        }

        if (!result?.success || !result?.data) {
          router.push('/404');
          return;
        }

        const productData = result.data;
        setProduct(productData);
        
        // Calculate pricing
        const pricingData = {
          timerEndDate: productData.promotion?.timerEndDate || productData.promotionalHeader?.timerEndDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
          discountPercentage: productData.promotion?.enabled ? productData.promotion.discountPercentage : 0,
          currentPrice: productData.price,
          originalPrice: productData.originalPrice || (productData.promotion?.enabled && productData.promotion.discountPercentage > 0 
            ? Math.round(productData.price / (1 - productData.promotion.discountPercentage / 100))
            : productData.price * 2),
          hasPromotion: productData.promotion?.enabled && productData.promotion.discountPercentage > 0,
          buttonText: productData.promotionalHeader?.buttonText || 'Get Started Today',
          buttonPrice: `at ₹${productData.price}`
        };
        
        setPricing(pricingData);
      } catch (error) {
        console.error('Error loading product:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params, router]);

  // Exit-intent on browser back: show discount modal
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Push a new history state so the first back triggers our handler
    const statePushed = { __ppv_stay__: true };
    try {
      window.history.pushState(statePushed, '');
    } catch {}

    const onPopState = (e: PopStateEvent) => {
      if (allowLeaveRef.current) return; // allow natural back when requested
      // Immediately push state again to keep the user on the page, then show modal
      try { window.history.pushState(statePushed, ''); } catch {}
      setShowExitModal(true);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const handlePayment = async () => {
    if (!product) return;
    
    try {
      await initiatePaymentWithModal({
        productId: product._id,
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const getImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    return { 
      id: image?.id || '', 
      url: image?.imageUrl || 'https://res.cloudinary.com/dssmutzly/image/upload/v1763116120/photo-1587567818566-3272be7d64c9_qoz5mq.webp', 
      hint: image?.imageHint || 'guarantee' 
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product || !pricing) {
    return null;
  }

  const exitDiscountPercent = 10;
  const exitDiscountedPrice =
    pricing.currentPrice && pricing.currentPrice > 0
      ? Math.max(1, Math.round(pricing.currentPrice * (1 - exitDiscountPercent / 100)))
      : pricing.currentPrice;
  const exitSavings =
    pricing.currentPrice && exitDiscountedPrice
      ? Math.max(0, pricing.currentPrice - exitDiscountedPrice)
      : 0;

  const handleExitConfirmPurchase = async () => {
    setShowExitModal(false);
    if (!product) return;

    try {
      await initiatePaymentWithModal({
        productId: product._id,
        customAmount: exitDiscountedPrice || pricing.currentPrice,
        promoCode: 'EXIT10',
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleExitLeave = () => {
    allowLeaveRef.current = true;
    router.back();
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 touch-manipulation" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Exit-Intent Discount Modal */}
        {showExitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-orange-300/60 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 px-6 py-4 text-white text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-90 mb-1">wait! special offer</p>
                <p className="text-xl md:text-2xl font-black">Before you go, enjoy an extra {exitDiscountPercent}% off {product.name}</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-800 dark:text-gray-100 text-sm md:text-base">
                  You're about to leave this page. Lock in instant access to the complete {product.category || 'digital'} business system with a built-in exit discount.
                </p>
                <div className="rounded-2xl border border-orange-200 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/20 p-4 flex items-center justify-between gap-4">
                  <div>
                    {pricing.originalPrice && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-through mb-0.5">MRP ₹{pricing.originalPrice}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300">Standard Price: ₹{pricing.currentPrice || '394'}</p>
                    <p className="text-2xl font-black text-orange-600 dark:text-orange-300">Exit Price: ₹{exitDiscountedPrice || pricing.currentPrice || '394'}</p>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">
                      Extra {exitDiscountPercent}% OFF applied automatically{exitSavings ? ` (Save ₹${exitSavings})` : ''}
                    </p>
                  </div>
                  <div className="text-center text-[11px] text-gray-700 dark:text-gray-200">
                    <p className="font-semibold mb-1">Instant Download</p>
                    <p>30-Day Money Back Guarantee</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={handleExitConfirmPurchase}
                    disabled={paymentLoading}
                    className="flex-1 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 hover:from-red-700 hover:via-orange-700 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-full text-sm md:text-base font-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {paymentLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-b-2 border-white rounded-full animate-spin" />
                        Processing Payment...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span className="hidden sm:inline">🔥</span>
                        Yes, Claim {exitDiscountPercent}% OFF
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleExitLeave}
                    className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 px-4 py-3 rounded-full text-sm md:text-base font-semibold bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    No Thanks, Take Me Back
                  </button>
                </div>
                <button
                  onClick={() => setShowExitModal(false)}
                  className="mt-2 w-full text-center text-[11px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Continue browsing this page
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Promotional Header Section - Exact Design from Image */}
        {product.promotionalHeader?.enabled && (
          <section className="w-screen">
            {/* Top Red Banner with Timer */}
            <div className="w-full bg-[#FF0000] py-2 px-2 sm:px-4">
              {/* Mobile Layout - Stacked */}
              <div className="flex overflow-hidden flex-col items-center justify-center gap-3 md:hidden">
                <div className="text-center text-white">
                  <p className="text-sm font-black uppercase tracking-normal" style={{ fontFamily: '"Roboto Condensed", sans-serif', fontOpticalSizing: 'auto', fontWeight: 600, fontStyle: 'normal' }}>
                    {product.promotionalHeader.topBannerText || 'ATTENTION! PRICE GOES UP AGAIN WHEN TIMER HITS 0!'}
                  </p>
                  {product.promotionalHeader.topBannerSubtext && (
                    <p className="text-xs font-bold uppercase tracking-normal" style={{ fontFamily: '"Roboto Condensed", sans-serif', fontOpticalSizing: 'auto', fontWeight: 600, fontStyle: 'normal' }}>
                      + {product.promotionalHeader.topBannerSubtext}
                    </p>
                  )}
                </div>
                
                {/* Mobile Timer & Button */}
                <div className="flex items-center gap-3">
                  <PromotionalHeaderTimer endDate={new Date(pricing.timerEndDate)} />
                  <button 
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="flex flex-col items-center bg-green-500 hover:bg-green-400 disabled:bg-gray-400 text-white px-2 py-2 rounded-full text-center font-extrabold whitespace-nowrap transition-colors shadow-lg border border-green-300" 
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.3)' }}
                  >
                    <span className="text-xs leading-none">{pricing.buttonText} {pricing.buttonPrice}</span>
                    <span className="text-[8px] leading-none opacity-90">Risk FREE - 30 Days Money Back Guarantee</span>
                  </button>
                </div>
              </div>

              {/* Desktop Layout - Side by Side */}
              <div className="hidden overflow-hidden md:flex md:flex-row items-center justify-center gap-12">
                <div className="flex items-center justify-center text-white text-center">
                  <div className="text-center">
                    <p className="text-base md:text-lg font-black uppercase tracking-normal" style={{ fontFamily: '"Roboto Condensed", sans-serif', fontOpticalSizing: 'auto', fontWeight: 600, fontStyle: 'normal' }}>
                      {product.promotionalHeader.topBannerText || 'ATTENTION! PRICE GOES UP AGAIN WHEN TIMER HITS 0!'}
                    </p>
                    {product.promotionalHeader.topBannerSubtext && (
                      <p className="text-xs md:text-sm font-bold uppercase tracking-normal" style={{ fontFamily: '"Roboto Condensed", sans-serif', fontOpticalSizing: 'auto', fontWeight: 600, fontStyle: 'normal' }}>
                        + {product.promotionalHeader.topBannerSubtext}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Desktop Timer & Button */}
                <div className="flex items-center gap-4">
                  <PromotionalHeaderTimer endDate={new Date(pricing.timerEndDate)} />
                  
                  {/* Green Button - Desktop */}
                  <button 
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="flex flex-col items-center bg-green-500 hover:bg-green-400 disabled:bg-gray-400 text-white px-6 py-2 rounded-full text-center font-extrabold whitespace-nowrap transition-colors shadow-lg border-2 border-green-300" 
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.3)' }}
                  >
                    <span className="text-sm md:text-base leading-tight">{pricing.buttonText} {pricing.buttonPrice}</span>
                    <span className="text-xs md:text-sm leading-tight mt-1 opacity-90">Risk FREE - 30 Days Money Back Guarantee</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area - Beige Background */}
            <div className="w-screen overflow-hidden bg-[#FAF0E6] py-12 md:py-16 px-4">
              {/* Back Button - Very Left (opens exit popup) */}
           

              <div className="w-screen overflow-hidden ml-[-1rem] mt-[-3rem] md:mt-[-5rem] mx-auto relative">
                {/* Hero Section Background with Shadow */}
                <div className="relative bg-gradient-to-br from-orange-50 via-white to-teal-50 md:bg-gradient-to-br md:from-orange-50 md:via-white md:to-teal-50 overflow-hidden md:rounded-none shadow-xl md:shadow-none">
                  {/* Background Pattern/Texture */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-teal-100/30 md:from-orange-100/20 md:via-transparent md:to-teal-100/20"></div>
                  
                  {/* Mobile Decorative Elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-orange-400 rounded-full opacity-60 animate-pulse md:hidden"></div>
                  <div className="absolute top-8 right-6 w-6 h-6 bg-teal-400 rounded-full opacity-50 animate-bounce md:hidden"></div>
                  <div className="absolute bottom-12 left-8 w-4 h-4 bg-purple-400 rounded-full opacity-70 animate-ping md:hidden"></div>
                  <div className="absolute bottom-6 right-4 w-10 h-10 bg-green-400 rounded-full opacity-40 animate-pulse md:hidden"></div>
                  
                  {/* Desktop Animated Icons - Left Side */}
                  <div className="absolute left-4 p-24 top-1/4 transform -translate-y-1/2 space-y-[20rem] hidden lg:block">
                    <div className="w-12 h-12 flex items-center justify-center animate-bounce">
                      <span className="text-white opacity-30 text-7xl">📊</span>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center animate-bounce">
                      <span className="text-white opacity-30 text-7xl">💡</span>
                    </div>
                  </div>

                  {/* Desktop Animated Icons - Right Side */}
                  <div className="absolute right-4 top-1/4 transform -translate-y-1/2 space-y-[20rem] hidden lg:block">
                    <div className="w-10 h-10 flex items-center justify-center animate-bounce">
                      <span className="text-white opacity-30 text-7xl">🚀</span>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center animate-bounce">
                      <span className="text-white opacity-30 text-7xl">💰</span>
                    </div>
                  </div>

                  {/* Main Content - Mobile First, Responsive Layout */}
                  <div className="relative z-10 text-center space-y-6 md:space-y-8 py-8 md:py-16 px-4 md:px-8">

                    {/* Main Headlines - Mobile First, Bold and Centered */}
                    <div className="space-y-4 md:space-y-6 max-w-full md:max-w-5xl mx-auto px-2 md:px-0">
                      {/* Orange Headline Part 1 */}
                      {product.promotionalHeader.headlinePart1 && (
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-orange-500 leading-tight" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 800 }}>
                          {product.promotionalHeader.headlinePart1}
                        </h1>
                      )}

                      {/* Teal/Green Headline Part 2 */}
                      {product.promotionalHeader.headlinePart2 && (
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-teal-600 leading-tight" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 800 }}>
                          {product.promotionalHeader.headlinePart2}
                        </h2>
                      )}

                      {/* Product Name with Yellow Gradient Background - Mobile Optimized */}
                      <div className="relative inline-block mt-6 md:mt-8 mb-4 md:mb-6 mx-2 md:mx-0">
                        <div className="absolute inset-0 bg-gradient-to-l from-yellow-400 via-yellow-300 to-yellow-500 transform -skew-x-2 md:-skew-x-3 rounded-lg"></div>
                        <h2 className="relative text-lg sm:text-xl md:text-4xl lg:text-5xl font-black text-black px-4 md:px-8 py-2 md:py-4 leading-tight" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 900 }}>
                          {product.name} 
                        </h2>
                      </div>

                      {/* Additional Product Information - Mobile Optimized */}
                      <div className="bg-white/90 md:bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg md:shadow-xl border border-gray-200 max-w-full md:max-w-4xl mx-auto mt-6 md:mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          {/* Left Column - Product Details */}
                          <div className="space-y-3 md:space-y-4">
                            <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}>
                              What You Get:
                            </h4>
                            <div className="space-y-2 md:space-y-3">
                              <div className="flex items-start gap-2 md:gap-3">
                                <span className="text-green-500 text-base md:text-lg flex-shrink-0">✓</span>
                                <p className="text-sm md:text-lg text-gray-700 font-medium">
                                  Complete {product.name} System & Training
                                </p>
                              </div>
                              <div className="flex items-start gap-2 md:gap-3">
                                <span className="text-green-500 text-base md:text-lg flex-shrink-0">✓</span>
                                <p className="text-sm md:text-lg text-gray-700 font-medium">
                                  {product.category} Marketing Automation Platform
                                </p>
                              </div>
                             
                              <div className="flex items-start gap-2 md:gap-3">
                                <span className="text-green-500 text-base md:text-lg flex-shrink-0">✓</span>
                                <p className="text-sm md:text-lg text-gray-700 font-medium">
                                  Step-by-Step Success Blueprint
                                </p>
                              </div>
                            </div>
                            
                            {/* Get It Now Button - Mobile Optimized with Payment */}
                            <div className="mt-4 md:mt-6">
                              <button 
                                onClick={handlePayment}
                                disabled={paymentLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-full text-base md:text-lg font-black shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed border-2 border-white/30 min-h-[48px] md:min-h-[56px]" 
                                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                              >
                                {paymentLoading ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Processing...
                                  </span>
                                ) : (
                                  <>Get It Now - ₹{pricing.currentPrice || '394'}</>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Right Column - Pricing & Benefits - Mobile Optimized */}
                          <div className="space-y-3 md:space-y-4 mt-6 md:mt-0">
                            <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}>
                              Special Launch Price:
                            </h4>
                            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-green-200">
                              <div className="text-center">
                                <p className="text-xs md:text-sm text-gray-600 line-through">
                                  Regular Price: ₹{pricing.originalPrice || '997'}
                                </p>
                                <p className="text-2xl md:text-4xl font-black text-green-600" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                  Only ₹{pricing.currentPrice || '394'}
                                </p>
                                <p className="text-xs md:text-sm text-red-600 font-bold mt-1 md:mt-2">
                                  Save ₹{(pricing.originalPrice || 997) - (pricing.currentPrice || 394)}! Limited Time
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2 mt-3 md:mt-4">
                              <div className="flex items-center gap-2">
                                <span className="text-orange-500 text-base md:text-lg">🚀</span>
                                <p className="text-xs md:text-base text-gray-700 font-medium">
                                  Instant Access After Purchase
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-blue-500 text-base md:text-lg">💡</span>
                                <p className="text-xs md:text-base text-gray-700 font-medium">
                                  Beginner-Friendly Setup
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-purple-500 text-base md:text-lg">📈</span>
                                <p className="text-xs md:text-base text-gray-700 font-medium">
                                  Proven Results System
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dark Subheading - Mobile Responsive */}
                      {product.promotionalHeader.subHeading && (
                        <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mt-6 md:mt-8 px-2 md:px-0" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 800 }}>
                          {product.promotionalHeader.subHeading}
                        </h3>
                      )}
                    </div>

                    {/* Platform Description - Mobile Responsive */}
                    {product.promotionalHeader.platformText && (
                      <p className="text-base sm:text-lg md:text-2xl text-gray-800 leading-relaxed max-w-full md:max-w-4xl mx-auto font-bold px-4 md:px-0" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600 }}>
                        {product.promotionalHeader.platformText}
                      </p>
                    )}

                    {/* Green Button - Mobile Responsive */}
                    <div className="flex justify-center mt-6 md:mt-8 px-4 md:px-0">
                      <button 
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className="flex flex-col items-center bg-green-500 hover:bg-green-400 disabled:bg-gray-400 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full text-center font-extrabold whitespace-nowrap transition-colors shadow-lg border-2 border-green-300 w-full sm:w-auto max-w-sm md:max-w-none" 
                        style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.3)' }}
                      >
                        <span className="text-sm md:text-lg leading-tight">{pricing.buttonText} {pricing.buttonPrice}</span>
                        <span className="text-[10px] md:text-[14px] leading-tight mt-1 opacity-90">Risk FREE - 30 Days Money Back Guarantee</span>
                      </button>
                    </div>

                    {/* Product Showcase Section - Image Left, Content Right */}
                    {product.media && product.media[0] && (
                      <div className="mt-16 md:mt-16 px-4 md:px-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
                          
                          {/* Left Side - 4 Image Gallery (2x2 Grid) */}
                          <div className="flex justify-center lg:justify-start">
                            <div className="relative w-full max-w-md lg:max-w-lg">
                              {/* 2x2 iPhone Mockup Grid */}
                              <div className="grid grid-cols-2 gap-4 md:gap-6">
                                {/* Top Row - 2 iPhone Mockups */}
                                <div className="relative group">
                                  {/* iPhone Frame */}
                                  <div className="relative w-full aspect-[9/19] bg-black rounded-[2rem] md:rounded-[2.5rem] p-1 md:p-1.5 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                                    {/* iPhone Screen */}
                                    <div className="relative w-full h-full bg-white rounded-[1.7rem] md:rounded-[2.2rem] overflow-hidden">
                                      {/* Status Bar */}
                                      <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-black rounded-t-[1.7rem] md:rounded-t-[2.2rem] flex items-center justify-center z-10">
                                        <div className="w-16 md:w-20 h-1 bg-white rounded-full opacity-60"></div>
                                      </div>
                                      
                                      {/* Image Content */}
                                      <div className="absolute inset-0 pt-6 md:pt-8">
                                        <Image
                                          src={product.media[0]?.url || 'https://picsum.photos/seed/1/300/600'}
                                          alt={`${product.name} - iPhone Preview 1`}
                                          fill
                                          className="object-cover"
                                          priority
                                        />
                                      </div>
                                      
                                      {/* Home Indicator */}
                                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 md:w-10 h-1 bg-black rounded-full opacity-30"></div>
                                      
                                      {/* Hover Overlay */}
                                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[1.7rem] md:rounded-[2.2rem]"></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="relative group">
                                  {/* iPhone Frame */}
                                  <div className="relative w-full aspect-[9/19] bg-black rounded-[2rem] md:rounded-[2.5rem] p-1 md:p-1.5 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                                    {/* iPhone Screen */}
                                    <div className="relative w-full h-full bg-white rounded-[1.7rem] md:rounded-[2.2rem] overflow-hidden">
                                      {/* Status Bar */}
                                      <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-black rounded-t-[1.7rem] md:rounded-t-[2.2rem] flex items-center justify-center z-10">
                                        <div className="w-16 md:w-20 h-1 bg-white rounded-full opacity-60"></div>
                                      </div>
                                      
                                      {/* Image Content */}
                                      <div className="absolute inset-0 pt-6 md:pt-8">
                                        <Image
                                          src={product.media[1]?.url || 'https://picsum.photos/seed/2/300/600'}
                                          alt={`${product.name} - iPhone Preview 2`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      
                                      {/* Discount Badge */}
                                      <div className="absolute top-8 md:top-10 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-black shadow-lg animate-pulse z-20" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}>
                                        {pricing.discountPercentage > 0 ? `${pricing.discountPercentage}% OFF` : 'NEW'}
                                      </div>
                                      
                                      {/* Home Indicator */}
                                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 md:w-10 h-1 bg-black rounded-full opacity-30"></div>
                                      
                                      {/* Hover Overlay */}
                                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[1.7rem] md:rounded-[2.2rem]"></div>
                                    </div>
                                  </div>
                                </div>

                                {/* Bottom Row - 2 iPhone Mockups */}
                                <div className="relative group">
                                  {/* iPhone Frame */}
                                  <div className="relative w-full aspect-[9/19] bg-black rounded-[2rem] md:rounded-[2.5rem] p-1 md:p-1.5 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                                    {/* iPhone Screen */}
                                    <div className="relative w-full h-full bg-white rounded-[1.7rem] md:rounded-[2.2rem] overflow-hidden">
                                      {/* Status Bar */}
                                      <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-black rounded-t-[1.7rem] md:rounded-t-[2.2rem] flex items-center justify-center z-10">
                                        <div className="w-16 md:w-20 h-1 bg-white rounded-full opacity-60"></div>
                                      </div>
                                      
                                      {/* Image Content */}
                                      <div className="absolute inset-0 pt-6 md:pt-8">
                                        <Image
                                          src={product.media[2]?.url || 'https://picsum.photos/seed/3/300/600'}
                                          alt={`${product.name} - iPhone Preview 3`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      
                                      {/* Home Indicator */}
                                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 md:w-10 h-1 bg-black rounded-full opacity-30"></div>
                                      
                                      {/* Hover Overlay */}
                                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[1.7rem] md:rounded-[2.2rem]"></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="relative group">
                                  {/* iPhone Frame */}
                                  <div className="relative w-full aspect-[9/19] bg-black rounded-[2rem] md:rounded-[2.5rem] p-1 md:p-1.5 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                                    {/* iPhone Screen */}
                                    <div className="relative w-full h-full bg-white rounded-[1.7rem] md:rounded-[2.2rem] overflow-hidden">
                                      {/* Status Bar */}
                                      <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-black rounded-t-[1.7rem] md:rounded-t-[2.2rem] flex items-center justify-center z-10">
                                        <div className="w-16 md:w-20 h-1 bg-white rounded-full opacity-60"></div>
                                      </div>
                                      
                                      {/* Image Content */}
                                      <div className="absolute inset-0 pt-6 md:pt-8">
                                        <Image
                                          src={product.media[3]?.url || 'https://picsum.photos/seed/4/300/600'}
                                          alt={`${product.name} - iPhone Preview 4`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      
                                      {/* Home Indicator */}
                                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 md:w-10 h-1 bg-black rounded-full opacity-30"></div>
                                      
                                      {/* Hover Overlay */}
                                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[1.7rem] md:rounded-[2.2rem]"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Decorative Elements Around Gallery */}
                              <div className="absolute -top-3 -left-3 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full opacity-80 animate-pulse shadow-lg"></div>
                              <div className="absolute -bottom-3 -right-3 w-8 h-8 md:w-10 md:h-10 bg-teal-400 rounded-full opacity-60 animate-bounce shadow-lg"></div>
                              <div className="absolute top-1/2 -left-4 w-4 h-4 md:w-6 md:h-6 bg-orange-400 rounded-full opacity-70 animate-ping shadow-lg"></div>
                              <div className="absolute top-1/4 -right-4 w-5 h-5 md:w-7 md:h-7 bg-purple-400 rounded-full opacity-70 animate-pulse shadow-lg"></div>
                              
                              {/* Gallery Count Badge */}
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                                <span className="flex items-center gap-1">
                                  <span>📸</span>
                                 
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side - Database Content with Gradients & Animations */}
                          <div className="space-y-6 lg:space-y-8">
                            
                            {/* Animated Heading with Gradient Background */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                              <div className="relative bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-white/50 shadow-xl">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                  🚀 Transform Your {product.category || 'Digital'} Business Today!
                                </h3>
                                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  Join thousands of successful entrepreneurs who've built profitable businesses with our proven system.
                                </p>
                              </div>
                            </div>

                            {/* Database Benefits Section */}
                            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg">
                              {product.productBenefits?.enabled && product.productBenefits.benefits.length > 0 ? (
                                <>
                                  <h4 className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                    <span className="animate-bounce">💎</span> {product.productBenefits.mainTitle || 'Key Benefits'}
                                  </h4>
                                  <div className="space-y-3">
                                    {product.productBenefits.benefits.slice(0, 4).map((benefit: any, index: number) => (
                                      <div key={index} className="flex items-start gap-3 group hover:transform hover:scale-105 transition-all duration-300">
                                        <span className="text-green-500 text-lg animate-pulse">{benefit.icon || '✨'}</span>
                                        <div>
                                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                                            <strong>{benefit.title}</strong> - {benefit.description}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <h4 className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                    <span className="animate-bounce">💎</span> What You'll Get
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-3 group hover:transform hover:scale-105 transition-all duration-300">
                                      <span className="text-green-500 text-lg animate-pulse">✨</span>
                                      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                                        <strong>Complete {product.name} System</strong> - Everything you need to start earning immediately
                                      </p>
                                    </div>
                                    <div className="flex items-start gap-3 group hover:transform hover:scale-105 transition-all duration-300">
                                      <span className="text-green-500 text-lg animate-pulse">🎯</span>
                                      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                                        <strong>Professional {product.category} Tools</strong> - Industry-standard resources and templates
                                      </p>
                                    </div>
                                    <div className="flex items-start gap-3 group hover:transform hover:scale-105 transition-all duration-300">
                                      <span className="text-green-500 text-lg animate-pulse">💰</span>
                                      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                                        <strong>Proven Money-Making System</strong> - Step-by-step guide to generate income
                                      </p>
                                    </div>
                                    <div className="flex items-start gap-3 group hover:transform hover:scale-105 transition-all duration-300">
                                      <span className="text-green-500 text-lg animate-pulse">🔥</span>
                                      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                                        <strong>Instant Access & Support</strong> - Download immediately with lifetime updates
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Pricing Highlight with Animation */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl animate-pulse opacity-20"></div>
                              <div className="relative bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800 shadow-xl">
                                <div className="text-center">
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-through mb-2">
                                    Regular Price: ₹{pricing.originalPrice || '997'}
                                  </p>
                                  <p className="text-3xl md:text-4xl font-black text-orange-600 dark:text-orange-400 mb-2 animate-bounce" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                    Special Price: ₹{pricing.currentPrice || '394'}
                                  </p>
                                  <p className="text-sm md:text-base text-red-600 dark:text-red-400 font-bold">
                                    🔥 Save ₹{(pricing.originalPrice || 997) - (pricing.currentPrice || 394)}! Limited Time Only
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Call to Action Button with Animation and Payment */}
                            <div className="space-y-4">
                              <button 
                                onClick={handlePayment}
                                disabled={paymentLoading}
                                className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 md:px-8 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed border-2 border-white/30 animate-pulse min-h-[56px] md:min-h-[64px] touch-manipulation" 
                                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                              >
                                {paymentLoading ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Processing Payment...
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-center gap-2 md:gap-3">
                                    <span className="animate-bounce">🚀</span>
                                    Get Instant Access Now - ₹{pricing.currentPrice || '394'}
                                    <span className="animate-bounce">💎</span>
                                  </span>
                                )}
                              </button>
                              
                              {/* Guarantee Badge */}
                              <div className="flex items-center justify-center gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
                                <span className="animate-pulse">🛡️</span>
                                <span className="font-semibold">30-Day Money-Back Guarantee</span>
                                <span className="animate-pulse">✅</span>
                              </div>
                            </div>

                            {/* Urgency Timer */}
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-red-200 dark:border-red-800 text-center">
                              <p className="text-sm md:text-base text-red-600 dark:text-red-400 font-bold animate-pulse">
                                ⏰ Special Launch Price Ends Soon! Don't Miss Out!
                              </p>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Promotional Header Section */}
                <div className="w-screen mx-auto mt-12 md:mt-16">
                  <div className="relative overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse opacity-20"></div>
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse"></div>
                    
                    {/* Floating Animation Elements */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
                    <div className="absolute top-8 right-8 w-6 h-6 bg-orange-400 rounded-full animate-pulse opacity-70"></div>
                    <div className="absolute bottom-4 left-8 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-50"></div>
                    <div className="absolute bottom-8 right-4 w-10 h-10 bg-yellow-500 rounded-full animate-bounce opacity-40"></div>

                    <div className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 py-12 md:py-16 px-4">
                      <div className="container mx-auto max-w-6xl text-center">
                        
                        {/* Main Highlight Text with Enhanced Styling */}
                        {product.promotionalHeader.highlightText ? (
                          <div className="mb-8">
                            <div className="inline-block relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transform -skew-x-2 rounded-2xl animate-pulse opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <h2 className="relative text-2xl md:text-4xl lg:text-5xl font-black text-black px-8 md:px-12 py-4 md:py-6 leading-tight" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 900 }}>
                                {product.promotionalHeader.highlightText}
                              </h2>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-8">
                            <div className="inline-block relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transform -skew-x-2 rounded-2xl animate-pulse opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <h2 className="relative text-2xl md:text-4xl lg:text-5xl font-black text-black px-8 md:px-12 py-4 md:py-6 leading-tight" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 900 }}>
                                🔥 {product.name} - Transform Your Business Today! 🚀
                              </h2>
                            </div>
                          </div>
                        )}

                        {/* Compelling Subheading */}
                        <div className="mb-8 max-w-4xl mx-auto">
                          <p className="text-lg md:text-xl lg:text-2xl text-gray-800 dark:text-gray-200 font-bold leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Join <span className="text-orange-600 animate-pulse">10,000+</span> successful entrepreneurs who've already transformed their businesses with our proven system!
                          </p>
                        </div>

                        {/* Key Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-200 transform hover:scale-105 transition-all duration-300">
                            <div className="text-3xl mb-3 animate-bounce">💰</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                              Instant Profit
                            </h3>
                            <p className="text-sm text-gray-700">
                              Start earning within 24 hours of implementation
                            </p>
                          </div>
                          
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200 transform hover:scale-105 transition-all duration-300">
                            <div className="text-3xl mb-3 animate-pulse">🎯</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                              Zero Experience
                            </h3>
                            <p className="text-sm text-gray-700">
                              Complete beginner? No problem! Step-by-step guidance
                            </p>
                          </div>
                          
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-200 transform hover:scale-105 transition-all duration-300">
                            <div className="text-3xl mb-3 animate-bounce">🚀</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                              Proven System
                            </h3>
                            <p className="text-sm text-gray-700">
                              Battle-tested methods that guarantee results
                            </p>
                          </div>
                        </div>

                        {/* Pricing Highlight */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                          <div className="text-center text-white">
                            <p className="text-sm md:text-base opacity-90 mb-2">Limited Time Special Price</p>
                            <div className="flex items-center justify-center gap-4 mb-4">
                              <span className="text-lg md:text-xl line-through opacity-70">₹{pricing.originalPrice || '997'}</span>
                              <span className="text-3xl md:text-4xl lg:text-5xl font-black animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                ₹{pricing.currentPrice || '394'}
                              </span>
                            </div>
                            <p className="text-sm md:text-base font-bold">
                              🔥 Save ₹{(pricing.originalPrice || 997) - (pricing.currentPrice || 394)}! Offer Ends Soon!
                            </p>
                          </div>
                        </div>

                        {/* Call to Action Buttons */}
                        <div className="space-y-4">
                          {/* Primary CTA with Payment */}
                          <button 
                            onClick={handlePayment}
                            disabled={paymentLoading}
                            className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl lg:text-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed border-4 border-white animate-pulse min-h-[56px] md:min-h-[64px] touch-manipulation" 
                            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                          >
                            {paymentLoading ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Processing Payment...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2 md:gap-3">
                                <span className="animate-bounce">🚀</span>
                                Get Instant Access Now - ₹{pricing.currentPrice || '394'}
                                <span className="animate-bounce">💎</span>
                              </span>
                            )}
                          </button>

                          {/* Secondary Info */}
                          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <span className="animate-pulse">✅</span>
                              <span className="font-semibold">Instant Download</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="animate-pulse">🛡️</span>
                              <span className="font-semibold">30-Day Guarantee</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="animate-pulse">⚡</span>
                              <span className="font-semibold">Lifetime Updates</span>
                            </div>
                          </div>
                        </div>

                        {/* Urgency Counter */}
                        <div className="mt-8 bg-red-100 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl p-4 animate-pulse">
                          <p className="text-red-700 dark:text-red-400 font-bold text-lg md:text-xl" style={{ fontFamily: 'Oswald, sans-serif' }}>
                            ⏰ WARNING: Price increases to ₹{pricing.originalPrice || '997'} in 24 hours!
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Enhanced Dynamic Business Section */}
        <section className="w-screen mt-[-4rem] relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-12 h-12 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-16 right-12 w-8 h-8 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-12 left-16 w-6 h-6 bg-red-400 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-10 h-10 bg-yellow-500 rounded-full opacity-20 animate-bounce"></div>

          <div className="relative py-16 md:py-24 px-4">
            <div className="container mx-auto max-w-7xl">
              
              {/* Main Headline Section */}
              <div className="text-center mb-16">
                <div className="inline-block relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 blur-lg opacity-30 animate-pulse"></div>
                  <h1 className="relative text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 leading-tight px-4" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 900 }}>
                    Start Your <span className="text-red-500">{product.name}</span> Business Today!
                  </h1>
                </div>
                
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Beginner-Friendly & 100% Ready-Made System
                </p>
                
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Join thousands of entrepreneurs who've built successful {product.category || 'digital'} businesses with our proven, step-by-step system. No experience required!
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-yellow-200 transform hover:scale-105 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-black text-yellow-600 mb-2 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    10K+
                  </div>
                  <p className="text-sm md:text-base font-semibold text-gray-700">Happy Customers</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-orange-200 transform hover:scale-105 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-black text-orange-600 mb-2 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    24H
                  </div>
                  <p className="text-sm md:text-base font-semibold text-gray-700">Quick Results</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-red-200 transform hover:scale-105 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-black text-red-600 mb-2 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    ₹50K
                  </div>
                  <p className="text-sm md:text-base font-semibold text-gray-700">Avg Monthly</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-green-200 transform hover:scale-105 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-black text-green-600 mb-2 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    100%
                  </div>
                  <p className="text-sm md:text-base font-semibold text-gray-700">Success Rate</p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-8 shadow-xl border border-yellow-200 transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-4 animate-bounce">🚀</div>
                  <h3 className="text-xl md:text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    Launch in Minutes
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Get your {product.category || 'digital'} business up and running in just minutes with our ready-made templates and automated setup process.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-8 shadow-xl border border-orange-200 transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-4 animate-pulse">💰</div>
                  <h3 className="text-xl md:text-2xl font-bold text-orange-800 dark:text-orange-200 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    Instant Monetization
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Start earning from day one with our proven monetization strategies and built-in payment systems.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-8 shadow-xl border border-red-200 transform hover:scale-105 transition-all duration-300 md:col-span-2 lg:col-span-1">
                  <div className="text-4xl mb-4 animate-bounce">🎯</div>
                  <h3 className="text-xl md:text-2xl font-bold text-red-800 dark:text-red-200 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    Expert Support
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Get 24/7 expert support and guidance to ensure your success every step of the way.
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-gray-500 via-purple-500 to-blue-500 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 mb-8">
                  <div className="text-center text-white">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                      Ready to Transform Your Life?
                    </h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Join the success story and start building your profitable business today!
                    </p>
                    
                    {/* Pricing Display */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <span className="text-xl md:text-2xl line-through opacity-60">₹{pricing.originalPrice || '997'}</span>
                      <span className="text-4xl md:text-5xl lg:text-6xl font-black text-yellow-200 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                        ₹{pricing.currentPrice || '394'}
                      </span>
                    </div>

                    {/* Primary CTA Buttons with Payment */}
                    <div className="space-y-4">
                      {pricing.hasPromotion ? (
                        <button 
                          onClick={handlePayment}
                          disabled={paymentLoading}
                          className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl lg:text-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed border-4 border-white/30 animate-pulse min-h-[56px] md:min-h-[64px] touch-manipulation" 
                          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                        >
                          {paymentLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Processing Payment...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center ">
                             
                              MEGA SALE! Get {pricing.discountPercentage}% OFF Now
                              
                            </span>
                          )}
                        </button>
                      ) : (
                        <button 
                          onClick={handlePayment}
                          disabled={paymentLoading}
                          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl lg:text-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed border-4 border-white/30 animate-pulse min-h-[56px] md:min-h-[64px] touch-manipulation" 
                          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                        >
                          {paymentLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Processing Payment...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2 md:gap-3">
                              <span className="animate-bounce">🚀</span>
                              GET STARTED TODAY - ₹{pricing.currentPrice || '394'}
                              <span className="animate-bounce">💎</span>
                            </span>
                          )}
                        </button>
                      )}
                      
                      {/* Secondary CTA */}
                      <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm md:text-base opacity-90">
                        <div className="flex items-center gap-2">
                          <span className="animate-pulse">✅</span>
                          <span>Instant Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="animate-pulse">🛡️</span>
                          <span>30-Day Money Back</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="animate-pulse">⚡</span>
                          <span>Lifetime Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgency Banner */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-4 md:p-6 animate-pulse">
                  <p className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    ⚠️ LIMITED TIME: Only {Math.floor(Math.random() * 50) + 10} spots left at this price!
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Enhanced Header Section - Only show if no promotional header */}
        {!product.promotionalHeader?.enabled && (
          <section className="w-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-8 left-8 w-8 h-8 bg-yellow-400 rounded-full opacity-30 animate-bounce"></div>
            <div className="absolute top-12 right-12 w-6 h-6 bg-orange-400 rounded-full opacity-40 animate-pulse"></div>
            <div className="absolute bottom-12 left-12 w-4 h-4 bg-red-400 rounded-full opacity-35 animate-ping"></div>
            <div className="absolute bottom-8 right-8 w-10 h-10 bg-yellow-500 rounded-full opacity-25 animate-bounce"></div>

            <div className="relative py-16 px-4">
              {/* Back Button - Enhanced */}
              <div className="mb-12 text-center">
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="bg-white/90 hover:bg-white border-orange-300 text-orange-700 hover:text-orange-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="font-bold">← Back to Home</span>
                  </Link>
                </Button>
              </div>
              
              <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                  {/* Enhanced Headline */}
                  <div className="inline-block relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 blur-lg opacity-30 animate-pulse"></div>
                    <h1 className="relative text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 leading-tight px-4" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 900 }}>
                      Start Your <span className="text-red-500">{product.name}</span> Business Today!
                    </h1>
                  </div>
                  
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Beginner-Friendly & 100% Ready-Made Projects
                  </p>

                  {/* Promotion Badge */}
                  {pricing.hasPromotion && (
                    <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-black px-8 py-4 rounded-full mb-8 shadow-2xl animate-pulse transform hover:scale-105 transition-all duration-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <Zap className="inline-block w-6 h-6 mr-3 animate-bounce" /> 
                      MEGA SALE IS ON! {pricing.discountPercentage}% OFF
                      <span className="ml-3 animate-bounce">🔥</span>
                    </div>
                  )}

                  {/* CTA Button with Payment */}
                  <div className="mt-8">
                    <button 
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className="w-full md:w-auto bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-700 hover:via-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl lg:text-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed border-4 border-white/30 animate-pulse min-h-[56px] md:min-h-[64px] touch-manipulation" 
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                    >
                      {paymentLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing Payment...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                         
                          Get Started Now - ₹{pricing.currentPrice || '394'}
                          
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
            
        {/* Enhanced Image Gallery */}
        <section className="w-screen relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10"></div>
          
          <div className="relative py-16 px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-block relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 blur-lg opacity-20 animate-pulse"></div>
                <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  📱 See {product.name} in Action
                </h2>
              </div>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Preview how your {product.category || 'digital'} business will look on mobile devices with our professional templates
              </p>
            </div>

            {/* iPhone Gallery */}
            <div className="container mx-auto max-w-6xl px-4">
              <div className="flex flex-wrap justify-center items-end gap-3 md:gap-5 lg:gap-6 mb-12">
                {product.media.slice(0, 4).map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className="relative transform hover:scale-105 transition-all duration-300 hover:-translate-y-2"
                    style={{ 
                      width: 'clamp(160px, 22vw, 240px)',
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))'
                    }}
                  >
                    {/* iPhone Frame */}
                    <div className="relative bg-black rounded-[2.75rem] p-[0.4rem] shadow-2xl">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-3xl z-10"></div>
                      
                      {/* Screen */}
                      <div className="relative aspect-[9/19.5] w-full rounded-[2.4rem] overflow-hidden bg-white">
                        {item.type === 'video' ? (
                          <video
                            src={item.url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Image
                            src={item.url}
                            alt={`${product.name} preview ${index + 1}`}
                            fill
                            className="object-cover"
                            data-ai-hint={item.hint}
                            priority={index < 2}
                          />
                        )}
                      </div>
                      
                      {/* Home Indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gallery CTA */}
              <div className="text-center">
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-700 hover:via-orange-700 hover:to-red-700 text-white px-10 py-4 rounded-full text-lg md:text-xl font-black shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" 
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                >
                  {paymentLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Payment...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Get These Templates Now - ₹{pricing.currentPrice || '394'}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
            
        {/* Enhanced Business Opportunity Section */}
        <section className="w-screen relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-10 h-10 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-16 right-12 w-8 h-8 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-12 left-16 w-6 h-6 bg-red-400 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-12 h-12 bg-yellow-500 rounded-full opacity-20 animate-bounce"></div>

          <div className="relative py-16 px-4">
            <div className="container mx-auto max-w-6xl text-center">
              {/* Section Header */}
              <div className="mb-12">
                <div className="inline-block relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 blur-lg opacity-30 animate-pulse"></div>
                  <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    👋 Hello, Future Entrepreneur!
                  </h2>
                </div>
                <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Ready to Earn ₹35,000 - ₹45,000/week from Home? 💰🏠
                </p>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Start your profitable {product.category || 'digital'} business with our {product.name} system - no experience required, no costly software, no lengthy training!
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-yellow-200 transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-4 animate-bounce">🎉</div>
                  <h3 className="text-xl font-bold text-yellow-800 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    Complete Bundle
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Get everything you need: {product.name} templates, training videos, and step-by-step guides
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-200 transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-4 animate-pulse">📦</div>
                  <h3 className="text-xl font-bold text-orange-800 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    Ready-Made System
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    No costly software needed - everything works with free tools and platforms
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-200 transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-4 animate-bounce">🚀</div>
                  <h3 className="text-xl font-bold text-red-800 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    Quick Start
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Launch your business today - no long training periods or complex setup required
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-gray-800 via-orange-800 to-red-800 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="text-white text-center">
                  <h3 className="text-2xl md:text-3xl font-black mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    Transform Your Life Today!
                  </h3>
                  <p className="text-lg md:text-xl mb-8 opacity-90">
                    Join thousands who've built successful businesses with {product.name}
                  </p>
                  
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white lg:px-12 px-4 lg:py-5 py-2 rounded-full text-xl md:text-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-4 border-white/30 animate-pulse" 
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                  >
                    <span className="flex items-center justify-center lg:gap-3 gap-0">
                      <span className="animate-bounce opacity-0 lg:opacity-100">🛒</span>
                      Start Your Business - ₹{pricing.currentPrice || '394'}
                      <span className="animate-bounce opacity-0 lg:opacity-100">🎁</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

       

      

       

        {/* Enhanced What You Get Section */}
        <section className="w-screen relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-8 h-8 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-16 right-12 w-6 h-6 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-12 left-16 w-4 h-4 bg-red-400 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-10 h-10 bg-yellow-500 rounded-full opacity-20 animate-bounce"></div>

          <div className="relative py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              {/* Enhanced Section Header */}
              <div className="text-center mb-12">
                <div className="inline-block relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 blur-lg opacity-30 animate-pulse"></div>
                  <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    🎁 What You Get Inside This ₹{pricing.currentPrice.toFixed(0)} Pack
                  </h2>
                </div>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Everything you need to build a successful {product.category || 'digital'} business - worth over ₹15,000+
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="space-y-4">
                  {/* Value Highlight */}
                  <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-2xl p-6 text-center shadow-xl">
                    <div className="text-2xl md:text-3xl font-black text-orange-800 dark:text-orange-200 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                      <span className="mr-3 animate-bounce">🎉</span>
                      {product.features.length}+ Premium Features: Complete Business System
                      <span className="ml-3 animate-bounce">💎</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Total Value: <span className="line-through opacity-70">₹15,000+</span> → Your Price: ₹{pricing.currentPrice.toFixed(0)}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature: any, index: number) => (
                      <Card key={index} className="bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-lg border border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <CardContent className="p-6 flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-sm">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              <span className="text-2xl">{feature.icon}</span>
                              <div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                  <span dangerouslySetInnerHTML={{ __html: feature.title }} />
                                </h3>
                                {feature.description && (
                                  <p className="text-gray-700 dark:text-gray-400 mt-1 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {feature.description}
                                  </p>
                                )}
                                {feature.value && (
                                  <p className="text-orange-600 dark:text-orange-400 font-semibold mt-1 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Value: {feature.value}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div className="text-center mt-12">
                    <div className="bg-gradient-to-r from-gray-800 via-orange-800 to-red-800 rounded-3xl p-8 shadow-2xl">
                      <div className="text-white">
                        <h3 className="text-2xl md:text-3xl font-black mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                          Ready to Get Everything?
                        </h3>
                        <p className="text-lg md:text-xl mb-6 opacity-90">
                          Complete {product.name} system with {product.features.length}+ premium features
                        </p>
                        
                       <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white lg:px-12 px-4 lg:py-5 py-2 rounded-full text-xl md:text-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-4 border-white/30 animate-pulse" 
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                  >
                    <span className="flex items-center justify-center lg:gap-3 gap-0">
                      <span className="animate-bounce opacity-0 lg:opacity-100">🛒</span>
                      Get This for - ₹{pricing.currentPrice || '394'}
                      <span className="animate-bounce opacity-0 lg:opacity-100">🎁</span>
                    </span>
                  </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Compatibility Section */}
        {product.compatibility && (
          <section className="w-screen bg-gradient-to-br from-gray-50 to-slate-50 py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                    <Card className="bg-white dark:bg-card shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
                                Compatibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="text-gray-700 dark:text-gray-300 space-y-2">
                            <p>{product.compatibility.title}</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                {product.compatibility.details.map((detail: string, i: number) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: detail }} />
                                ))}
                            </ul>
                            {product.compatibility.notes && <p className="pt-2">{product.compatibility.notes}</p>}
                            </div>
                        </CardContent>
                    </Card>
            </div>
          </section>
        )}

        {/* Limited Time Offer Section */}
        <section className="w-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 md:py-16 px-3 md:px-4">
          <div className="container mx-auto max-w-6xl">
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 md:border-4 border-orange-400 dark:border-orange-600 rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12 shadow-2xl">
                    {/* Alert Icon & Title */}
                    <div className="text-center mb-4 md:mb-6">
                        <div className="inline-flex flex-col md:flex-row items-center gap-2 md:gap-3 text-orange-600 dark:text-orange-400 mb-3 md:mb-4">
                            <Zap className="w-6 h-6 md:w-8 md:h-8 animate-pulse" />
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Limited Time Offer!
                            </h2>
                        </div>
                        <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200 px-2 md:px-0" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            The next 3 months are the GOLDEN PERIOD for {product.category} products
                        </p>
                    </div>

                    {/* Product Benefits Section */}
                    {product.productBenefits?.enabled && product.productBenefits.benefits.length > 0 && (
                        <div className="py-6 md:py-8 lg:py-12 px-3 md:px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl md:rounded-2xl mt-6 md:mt-8">
                            <div className="max-w-4xl mx-auto">
                                {/* Title Section */}
                                <div className="text-center mb-8 md:mb-12">
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-3 md:mb-4 px-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {product.productBenefits.mainTitle}
                                    </h2>
                                    {product.productBenefits.subtitle && (
                                        <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 px-2">
                                            {product.productBenefits.subtitle}
                                        </p>
                                    )}
                                </div>

                                {/* Benefits Grid - Mobile First */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                                    {product.productBenefits.benefits.map((benefit: any, index: number) => (
                                        <div 
                                            key={index}
                                            className="flex gap-3 md:gap-4 p-4 md:p-6 rounded-lg md:rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700"
                                        >
                                            {/* Icon */}
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center text-xl md:text-2xl lg:text-3xl">
                                                    {benefit.icon}
                                                </div>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    {benefit.title}
                                                </h3>
                                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {benefit.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Decorative Divider */}
                                <div className="mt-8 md:mt-12 flex items-center justify-center px-4">
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent w-full max-w-2xl"></div>
                                </div>
                            </div>
                        </div>
                    )}

                  

                    {/* Price Info */}
                    <div className="text-center mb-6 md:mb-8 px-2">
                        <p className="text-base md:text-lg lg:text-xl text-red-600 dark:text-red-400 font-bold mb-2 md:mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Price Returns to ₹{pricing.originalPrice.toFixed(0)} Tomorrow – Enroll Now at ₹{pricing.currentPrice.toFixed(0)}!
                        </p>
                        <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-white mb-3 md:mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Only ₹{pricing.currentPrice.toFixed(0)}
                        </div>
                    </div>

                    {/* What's Inside */}
                    <div className="mb-6 md:mb-8 px-2">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Here's What You'll Get Inside
                        </h3>
                        <div className="space-y-2 md:space-y-3 max-w-4xl mx-auto">
                            {product.features && product.features.slice(0, 7).map((feature: any, index: number) => (
                                <div key={index} className="flex items-start gap-2 md:gap-3 text-gray-700 dark:text-gray-300 p-2 md:p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 md:mt-1" />
                                    <span className="text-sm md:text-base lg:text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <span dangerouslySetInnerHTML={{ __html: feature.title }} />
                                        {feature.description && ` - ${feature.description}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mb-6 md:mb-8 px-2">
                        <button 
                            onClick={handlePayment}
                            disabled={paymentLoading}
                            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 md:py-4 px-6 md:px-12 rounded-full text-base md:text-lg lg:text-xl shadow-2xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-300 inline-flex items-center justify-center gap-2 md:gap-3 min-h-[48px] md:min-h-[56px] touch-manipulation" 
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            {paymentLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    GET LIFETIME ACCESS at ₹{product.price.toFixed(0)}/- 🔒
                                </>
                            )}
                        </button>
                    </div>

                    {/* Guarantee Badges */}
                    <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-3 md:gap-4 lg:gap-8 text-xs md:text-sm lg:text-base text-gray-700 dark:text-gray-300 px-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <div className="flex items-center gap-1 md:gap-2">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                            <span className="font-semibold">Instant Course Access</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                            <span className="font-semibold">24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                            <span className="font-semibold">Lifetime Updates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="font-semibold">30-Day Guarantee</span>
                        </div>
                    </div>
                </div>
          </div>
        </section>

        {/* WhatsApp Success Stories / Testimonials Section */}
        <section className="w-screen bg-gradient-to-br from-green-50 to-emerald-50 py-16">
          <div className="w-full">
            <div className="text-center mb-12 px-4">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Success Stories/ <span className="text-green-600">Testimonials</span>
              </h2>
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Real customers sharing their success with {product.name}
              </p>
            </div>

            <div className="flex overflow-x-auto gap-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* WhatsApp Chat 1 - Real WhatsApp Style */}
              <div className="bg-white shadow-lg overflow-hidden border border-gray-200 flex-shrink-0 w-80" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {/* WhatsApp Header - Exact Style */}
                <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
                  <button className="text-white">←</button>
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">Aman Singh</p>
                    <p className="text-xs text-gray-200">online</p>
                  </div>
                  <div className="flex gap-4 text-white">
                    <span>📞</span>
                    <span>📹</span>
                    <span>⋮</span>
                  </div>
                </div>
                
                {/* Chat Area - Real WhatsApp Background */}
                <div className="bg-[#E5DDD5] p-4 space-y-3 min-h-[350px]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="260" height="260" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M24.37 16c.2.65.39 1.32.54 2H21.17l1.17-2h2.03zm9.78 0l-.69 2H29.5l.69-2h3.96zm2.96 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'  }}>
                  
                  {/* Date Bubble */}
                  <div className="flex justify-center">
                    <div className="bg-white/80 px-3 py-1 rounded-full shadow-sm">
                      <p className="text-xs text-gray-600">4 February 2025</p>
                    </div>
                  </div>
                  
                  {/* Encryption Notice - System Message */}
                  <div className="flex justify-center">
                    <div className="bg-[#FFFBF0] border border-[#F7E98E] px-3 py-2 rounded-lg max-w-[280px] shadow-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-600 text-sm">🔒</span>
                        <p className="text-xs text-gray-700 leading-relaxed">Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Tap to learn more.</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Message Bubbles */}
                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg rounded-bl-sm shadow-sm max-w-[250px] relative">
                      <p className="text-sm text-gray-900">Hello sir</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">8:45 AM</span>
                      </div>
                      {/* WhatsApp Tail */}
                      <div className="absolute -bottom-0 -left-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-white border-t-8 border-t-white"></div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg rounded-bl-sm shadow-sm max-w-[250px] relative">
                      <p className="text-sm text-gray-900">Invoice send kijiye sir</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">8:52 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                    </div>
                  </div>

                  {/* Business Reply - Right Side */}
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] px-3 py-2 rounded-lg rounded-br-sm shadow-sm max-w-[250px] relative">
                      {/* PDF Document */}
                      <div className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">📄</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Invoice-250240203296540.pdf</p>
                            <p className="text-xs text-gray-500">1 page • 106 kB • PDF</p>
                          </div>
                          <button className="text-gray-400">⬇</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs text-gray-600">8:56 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                      {/* WhatsApp Tail */}
                      <div className="absolute -bottom-0 -right-2 w-0 h-0 border-l-8 border-l-[#DCF8C6] border-r-8 border-r-transparent border-t-8 border-t-[#DCF8C6]"></div>
                    </div>
                  </div>

                  {/* Thank You Card - Business Message */}
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] px-3 py-2 rounded-lg rounded-br-sm shadow-sm max-w-[250px] relative">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg text-center">
                        <h3 className="font-bold text-sm mb-2">🎉 Thank You For Placing Order!</h3>
                        <p className="text-xs opacity-90">500+ {product.category.toUpperCase()}</p>
                        <p className="text-xs opacity-90">PROJECTS OF 2024.pdf</p>
                        <p className="text-xs mt-2 opacity-75">1 page • 17 kB • PDF</p>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <span className="text-xs text-gray-600">9:01 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* WhatsApp Input Area */}
                <div className="bg-[#F0F0F0] px-4 py-3 flex items-center gap-3">
                  <span className="text-gray-500">😊</span>
                  <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-500">Type a message</div>
                  <span className="text-gray-500">📎</span>
                  <div className="w-8 h-8 bg-[#075E54] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🎤</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat 2 - Audio Messages Real Style */}
              <div className="bg-white shadow-lg overflow-hidden border border-gray-200 flex-shrink-0 w-80" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
                  <button className="text-white">←</button>
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">R</div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">Rohit Sharma</p>
                    <p className="text-xs text-gray-200">last seen today at 1:20 PM</p>
                  </div>
                  <div className="flex gap-4 text-white">
                    <span>📞</span>
                    <span>📹</span>
                    <span>⋮</span>
                  </div>
                </div>
                
                <div className="bg-[#E5DDD5] p-4 space-y-3 min-h-[350px]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="260" height="260" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M24.37 16c.2.65.39 1.32.54 2H21.17l1.17-2h2.03zm9.78 0l-.69 2H29.5l.69-2h3.96zm2.96 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'  }}>
                  
                  {/* Audio Message - Business Side */}
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] px-3 py-2 rounded-lg rounded-br-sm shadow-sm max-w-[250px] relative">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">▶</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <div className="w-1 h-1 bg-green-300 rounded-full"></div>
                            <div className="w-1 h-1 bg-green-300 rounded-full"></div>
                          </div>
                          <p className="text-xs text-gray-600">0:05</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-600">1:14 PM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                      <div className="absolute -bottom-0 -right-2 w-0 h-0 border-l-8 border-l-[#DCF8C6] border-r-8 border-r-transparent border-t-8 border-t-[#DCF8C6]"></div>
                    </div>
                  </div>

                  {/* Customer Messages */}
                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg rounded-bl-sm shadow-sm max-w-[250px] relative">
                      <p className="text-sm text-gray-900">Check karke batata hun sir</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">1:19 PM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                      <div className="absolute -bottom-0 -left-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-white border-t-8 border-t-white"></div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg rounded-bl-sm shadow-sm max-w-[250px] relative">
                      <p className="text-sm text-gray-900">Ok</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">1:19 PM</span>
                      </div>
                    </div>
                  </div>

                  {/* Business Thank You Card */}
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] px-3 py-2 rounded-lg rounded-br-sm shadow-sm max-w-[250px] relative">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg text-center">
                        <h3 className="font-bold text-sm mb-2">🎉 Thank You For Placing Order!</h3>
                        <p className="text-xs opacity-90">500+ {product.category.toUpperCase()}</p>
                        <p className="text-xs opacity-90">PROJECTS OF 2024.pdf</p>
                        <p className="text-xs mt-2 opacity-75">1 page • 17 kB • PDF</p>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <span className="text-xs text-gray-600">2:57 PM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="bg-[#F0F0F0] px-4 py-3 flex items-center gap-3">
                  <span className="text-gray-500">😊</span>
                  <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-500">Type a message</div>
                  <span className="text-gray-500">📎</span>
                  <div className="w-8 h-8 bg-[#075E54] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🎤</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat 3 - Real WhatsApp Style */}
              <div className="bg-white shadow-lg overflow-hidden border border-gray-200 flex-shrink-0 w-80" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
                  <button className="text-white">←</button>
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">S</div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">Suresh Patel</p>
                    <p className="text-xs text-gray-200">last seen today at 7:15 AM</p>
                  </div>
                  <div className="flex gap-4 text-white">
                    <span>📞</span>
                    <span>📹</span>
                    <span>⋮</span>
                  </div>
                </div>
                
                <div className="bg-[#E5DDD5] p-4 space-y-3 min-h-[350px]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="260" height="260" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M24.37 16c.2.65.39 1.32.54 2H21.17l1.17-2h2.03zm9.78 0l-.69 2H29.5l.69-2h3.96zm2.96 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'  }}>
                  
                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg rounded-bl-sm shadow-sm max-w-[250px] relative">
                      <p className="text-sm text-gray-900">Yes</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">7:08 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                      <div className="absolute -bottom-0 -left-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-white border-t-8 border-t-white"></div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg rounded-bl-sm shadow-sm max-w-[250px] relative">
                      <p className="text-sm text-gray-900">Invoice send kijiye sir</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">7:09 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg rounded-bl-sm shadow-sm max-w-[250px] relative">
                      <p className="text-sm text-gray-900">Email per bill aaya hoga</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">7:09 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] px-3 py-2 rounded-lg rounded-br-sm shadow-sm max-w-[250px] relative">
                      <div className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">📄</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Invoice-250208011506iEIV.pdf</p>
                            <p className="text-xs text-gray-500">1 page • 107 kB • PDF</p>
                          </div>
                          <button className="text-gray-400">⬇</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs text-gray-600">7:10 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                      <div className="absolute -bottom-0 -right-2 w-0 h-0 border-l-8 border-l-[#DCF8C6] border-r-8 border-r-transparent border-t-8 border-t-[#DCF8C6]"></div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] px-3 py-2 rounded-lg rounded-br-sm shadow-sm max-w-[250px] relative">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg text-center">
                        <h3 className="font-bold text-sm mb-2">🎉 Thank You For Placing Order!</h3>
                        <p className="text-xs opacity-90">500+ {product.category.toUpperCase()}</p>
                        <p className="text-xs opacity-90">PROJECTS OF 2024.pdf</p>
                        <p className="text-xs mt-2 opacity-75">1 page • 17 kB • PDF</p>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <span className="text-xs text-gray-600">7:10 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F0F0F0] px-4 py-3 flex items-center gap-3">
                  <span className="text-gray-500">😊</span>
                  <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-500">Type a message</div>
                  <span className="text-gray-500">📎</span>
                  <div className="w-8 h-8 bg-[#075E54] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🎤</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat 4 - Real WhatsApp Style */}
              <div className="bg-white shadow-lg overflow-hidden border border-gray-200 flex-shrink-0 w-80" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
                  <button className="text-white">←</button>
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm">M</div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">Manish Kumar</p>
                    <p className="text-xs text-gray-200">online</p>
                  </div>
                  <div className="flex gap-4 text-white">
                    <span>📞</span>
                    <span>📹</span>
                    <span>⋮</span>
                  </div>
                </div>
                
                <div className="bg-[#E5DDD5] p-4 space-y-3 min-h-[350px]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="260" height="260" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M24.37 16c.2.65.39 1.32.54 2H21.17l1.17-2h2.03zm9.78 0l-.69 2H29.5l.69-2h3.96zm2.96 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04zm2.95 0l-.69 2h-2.04l.69-2h2.04z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'  }}>
                  
                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg rounded-bl-sm shadow-sm max-w-[250px] relative">
                      <p className="text-sm text-gray-900">Ok</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">11:37 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                      <div className="absolute -bottom-0 -left-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-white border-t-8 border-t-white"></div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg rounded-bl-sm shadow-sm max-w-[250px] relative">
                      <p className="text-sm text-gray-900">Jo email per aaya tha</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">11:37 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] px-3 py-2 rounded-lg rounded-br-sm shadow-sm max-w-[250px] relative">
                      <div className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">📄</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Invoice-250131055468XVXK.pdf</p>
                            <p className="text-xs text-gray-500">1 page • 17 kB • PDF</p>
                          </div>
                          <button className="text-gray-400">⬇</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs text-gray-600">11:38 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                      <div className="absolute -bottom-0 -right-2 w-0 h-0 border-l-8 border-l-[#DCF8C6] border-r-8 border-r-transparent border-t-8 border-t-[#DCF8C6]"></div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] px-3 py-2 rounded-lg rounded-br-sm shadow-sm max-w-[250px] relative">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg text-center">
                        <h3 className="font-bold text-sm mb-2">🎉 Thank You For Placing Order!</h3>
                        <p className="text-xs opacity-90">500+ {product.category.toUpperCase()}</p>
                        <p className="text-xs opacity-90">PROJECTS OF 2024.pdf</p>
                        <p className="text-xs mt-2 opacity-75">1 page • 17 kB • PDF</p>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <span className="text-xs text-gray-600">11:38 AM</span>
                        <span className="text-blue-500 text-xs">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F0F0F0] px-4 py-3 flex items-center gap-3">
                  <span className="text-gray-500">😊</span>
                  <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-500">Type a message</div>
                  <span className="text-gray-500">📎</span>
                  <div className="w-8 h-8 bg-[#075E54] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🎤</span>
                  </div>
                </div>
              </div>
              {/* WhatsApp Chat 5 - Tutorial Request */}
              <div className="bg-white shadow-lg overflow-hidden border border-gray-200 flex-shrink-0 w-80">
                <div className="bg-green-600 text-white p-2 flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">V</div>
                  <div className="flex-1">
                    <p className="font-semibold text-xs">Vikash Gupta</p>
                    <p className="text-xs opacity-90">+91 ●●●●● ●●076</p>
                  </div>
                  <div className="text-xs opacity-90">6:09</div>
                </div>
                
                <div className="p-3 space-y-2 bg-gray-50 min-h-[320px]">
                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] text-xs">
                    <p className="text-gray-800">Sir maine kr lia h purchase</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">1:54 pm <span className="text-blue-500">✓✓</span></div>
                  </div>

                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] text-xs">
                    <p className="text-gray-800">where can I find the tutorial video</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">1:54 pm <span className="text-blue-500">✓✓</span></div>
                  </div>

                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] text-xs">
                    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">📄</div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold">Invoice-250240811130COL.pdf</p>
                        <p className="text-xs text-gray-500">1 page • 107 kB • PDF</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">1:55 pm</div>
                  </div>

                  <div className="bg-orange-500 text-white p-3 rounded-lg text-center text-xs">
                    <h3 className="font-bold mb-1">Thank You For Placing</h3>
                    <p>500+ {product.category.toUpperCase()}</p>
                    <p>PROJECTS OF 2024.pdf</p>
                    <p className="mt-1">1 page • 17 kB • PDF</p>
                    <div className="mt-1 flex items-center justify-center gap-1">1:56 am ✓✓</div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat 6 - Payment Confirmation */}
              <div className="bg-white shadow-lg overflow-hidden border border-gray-200 flex-shrink-0 w-80">
                <div className="bg-green-600 text-white p-2 flex items-center gap-2">
                  <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">P</div>
                  <div className="flex-1">
                    <p className="font-semibold text-xs">Pradeep Singh</p>
                    <p className="text-xs opacity-90">+91 ●●●●● ●●065</p>
                  </div>
                  <div className="text-xs opacity-90">6:19</div>
                </div>
                
                <div className="p-3 space-y-2 bg-gray-50 min-h-[320px]">
                  {/* Transaction Success Screen */}
                  <div className="bg-purple-600 text-white p-3 rounded-lg text-center text-xs">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">✓</span>
                      </div>
                    </div>
                    <h3 className="font-bold mb-1">Transaction Successful</h3>
                    <p className="text-xs">₹394 has been paid</p>
                    <div className="mt-2 text-xs">
                      <p>Paid to</p>
                      <p className="font-bold">COSMOFEED TECHNOLOGIES...</p>
                      <p>Paytm • 7303919@paytm</p>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] text-xs">
                    <p className="text-gray-800">Hello sir</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">8:01 am <span className="text-blue-500">✓✓</span></div>
                  </div>

                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] text-xs">
                    <p className="text-gray-800">Invoice send kijye sir</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">8:01 am <span className="text-blue-500">✓✓</span></div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat 7 - Thank You Response */}
              <div className="bg-white shadow-lg overflow-hidden border border-gray-200 flex-shrink-0 w-80">
                <div className="bg-green-600 text-white p-2 flex items-center gap-2">
                  <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
                  <div className="flex-1">
                    <p className="font-semibold text-xs">Ajay Verma</p>
                    <p className="text-xs opacity-90">+91 ●●●●● ●●054</p>
                  </div>
                  <div className="text-xs opacity-90">2:07</div>
                </div>
                
                <div className="p-3 space-y-2 bg-gray-50 min-h-[320px]">
                  <div className="bg-orange-500 text-white p-3 rounded-lg text-center text-xs">
                    <h3 className="font-bold mb-1">Thank You For Placing</h3>
                    <p>500+ {product.category.toUpperCase()}</p>
                    <p>PROJECTS OF 2024.pdf</p>
                    <p className="mt-1">1 page • 17 kB • PDF</p>
                    <div className="mt-1 flex items-center justify-center gap-1">8:44 am ✓✓</div>
                  </div>

                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] text-xs">
                    <p className="text-gray-800">Thank you</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">9:23 am <span className="text-blue-500">✓✓</span></div>
                  </div>

                  <div className="bg-orange-500 text-white p-3 rounded-lg text-center text-xs">
                    <h3 className="font-bold mb-1">Thank You For Placing</h3>
                    <p>WEDDING BUNDLE 2024.pdf</p>
                    <p className="mt-1">1 page • 17 kB • PDF</p>
                    <div className="mt-1 flex items-center justify-center gap-1">8:44 am ✓✓</div>
                  </div>

                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] text-xs">
                    <p className="text-gray-800">Thank you 🙏</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">2:07 pm <span className="text-blue-500">✓✓</span></div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat 8 - Sharing Appreciation */}
              <div className="bg-white shadow-lg overflow-hidden border border-gray-200 flex-shrink-0 w-80">
                <div className="bg-green-600 text-white p-2 flex items-center gap-2">
                  <div className="w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">D</div>
                  <div className="flex-1">
                    <p className="font-semibold text-xs">Deepak Jain</p>
                    <p className="text-xs opacity-90">+91 ●●●●● ●●043</p>
                  </div>
                  <div className="text-xs opacity-90">2:10</div>
                </div>
                
                <div className="p-3 space-y-2 bg-gray-50 min-h-[320px]">
                  <div className="bg-orange-500 text-white p-3 rounded-lg text-center text-xs">
                    <h3 className="font-bold mb-1">Thank You For Placing</h3>
                    <p>500+ {product.category.toUpperCase()}</p>
                    <p>PROJECTS OF 2024.pdf</p>
                    <p className="mt-1">1 page • 17 kB • PDF</p>
                    <div className="mt-1 flex items-center justify-center gap-1">9:01 am ✓✓</div>
                  </div>

                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] text-xs">
                    <p className="text-gray-800">thanks for sharing</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">2:10 pm <span className="text-blue-500">✓✓</span></div>
                  </div>

                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] text-xs">
                    <p className="text-gray-800">😊</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">2:10 pm <span className="text-blue-500">✓✓</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Icon */}
           
          </div>
        </section>

        {/* Enhanced Guarantee Section */}
        <section className="w-screen relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-8 h-8 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-16 right-12 w-6 h-6 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-12 left-16 w-4 h-4 bg-red-400 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-10 h-10 bg-yellow-500 rounded-full opacity-20 animate-bounce"></div>

          <div className="relative py-16 px-4">
            <div className="container mx-auto max-w-6xl text-center">
              
              {/* Enhanced Section Header */}
              <div className="mb-12">
                <div className="inline-block relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 blur-lg opacity-30 animate-pulse"></div>
                  <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    🛡️ 100% Risk-Free Guarantee
                  </h2>
                </div>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  We're so confident in {product.name} that we offer a complete money-back guarantee!
                </p>
              </div>

              {/* Guarantee Badge and Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                
                {/* Left Side - Guarantee Badge */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-white rounded-full p-4 shadow-2xl border-4 border-green-500 transform hover:scale-105 transition-all duration-300">
                      <Image 
                        src={getImage('promo-guarantee').url} 
                        alt="30-Day Money-Back Guarantee" 
                        width={200} 
                        height={200} 
                        className="rounded-full" 
                        data-ai-hint={getImage('promo-guarantee').hint} 
                      />
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-bounce opacity-70"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-400 rounded-full animate-pulse opacity-60"></div>
                  </div>
                </div>

                {/* Right Side - Guarantee Details */}
                <div className="text-left lg:text-left space-y-6">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    30-Day Money-Back Guarantee
                  </h3>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Try {product.name} completely risk-free. If you don't see results or aren't satisfied, get a full refund within 30 days.
                  </p>
                  
                  {/* Guarantee Features */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 group hover:transform hover:scale-105 transition-all duration-300">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white"/>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg" style={{ fontFamily: 'Oswald, sans-serif' }}>
                          94% Recover Investment in 1 Week
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">Most users see positive ROI within their first week</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 group hover:transform hover:scale-105 transition-all duration-300">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white"/>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg" style={{ fontFamily: 'Oswald, sans-serif' }}>
                          Step-by-Step Success System
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">Complete roadmap from beginner to profitable business</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 group hover:transform hover:scale-105 transition-all duration-300">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white"/>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg" style={{ fontFamily: 'Oswald, sans-serif' }}>
                          Personal Mentorship to First Sale
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">One-on-one guidance until you make your first sale</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action Section */}
              <div className="bg-gradient-to-r from-gray-800 via-orange-800 to-red-800 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="text-white text-center">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    Ready to Start Risk-Free?
                  </h3>
                  <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                    Join thousands who've transformed their lives with {product.name}. Your success is guaranteed or your money back!
                  </p>
                  
                  {/* Pricing Display */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <span className="text-xl md:text-2xl line-through opacity-60">₹{pricing.originalPrice || '997'}</span>
                    <span className="text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                      ₹{pricing.currentPrice || '394'}
                    </span>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white lg:px-12 px-4 lg:py-5 py-2 rounded-full text-xl md:text-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-4 border-white/30 animate-pulse" 
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                  >
                    <span className="flex items-center justify-center lg:gap-3 gap-0">
                      <span className="animate-bounce opacity-0 lg:opacity-100">🛒</span>
                      Start Risk Free - ₹{pricing.currentPrice || '394'}
                      <span className="animate-bounce opacity-0 lg:opacity-100">🎁</span>
                    </span>
                  </button>

                  {/* Trust Indicators */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 text-sm md:text-base opacity-90">
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">⚡</span>
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">🛡️</span>
                      <span>30-Day Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">💎</span>
                      <span>Lifetime Support</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Enhanced Customer Reviews Section */}
        <section className="w-screen relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-8 h-8 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-16 right-12 w-6 h-6 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-12 left-16 w-4 h-4 bg-red-400 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-10 h-10 bg-yellow-500 rounded-full opacity-20 animate-bounce"></div>

          <div className="relative py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              
              {/* Enhanced Reviews Section with Dynamic Header */}
              <ReviewSectionWithHeader 
                productId={product._id.toString()}
                productName={product.name}
                productCategory={product.category}
              />

              {/* Call to Action Section */}
              <div className="bg-gradient-to-r from-gray-800 via-orange-800 to-red-800 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="text-white text-center">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    Join These Success Stories!
                  </h3>
                  <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                    Don't just read about success - become the next success story with {product.name}!
                  </p>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                        10K+
                      </div>
                      <p className="text-sm md:text-base opacity-90">Happy Customers</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                        4.9★
                      </div>
                      <p className="text-sm md:text-base opacity-90">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                        98%
                      </div>
                      <p className="text-sm md:text-base opacity-90">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                        24H
                      </div>
                      <p className="text-sm md:text-base opacity-90">Quick Results</p>
                    </div>
                  </div>

                   <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white lg:px-12 px-4 lg:py-5 py-2 rounded-full text-xl md:text-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-4 border-white/30 animate-pulse" 
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                  >
                    <span className="flex items-center justify-center lg:gap-3 gap-0">
                      <span className="animate-bounce opacity-0 lg:opacity-100">🛒</span>
                      Join Risk Free - ₹{pricing.currentPrice || '394'}
                      <span className="animate-bounce opacity-0 lg:opacity-100">🎁</span>
                    </span>
                  </button>

                  {/* Trust Indicators */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 text-sm md:text-base opacity-90">
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">⚡</span>
                      <span>Instant Download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">🛡️</span>
                      <span>Money-Back Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">💎</span>
                      <span>Premium Support</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Final Call-to-Action Section */}
        <section className="w-screen relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/10 dark:via-orange-900/10 dark:to-yellow-900/10"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-12 h-12 bg-red-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-16 right-12 w-8 h-8 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-12 left-16 w-6 h-6 bg-yellow-400 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-14 h-14 bg-red-500 rounded-full opacity-20 animate-bounce"></div>

          <div className="relative py-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              
              {/* Final CTA Header */}
              <div className="mb-12">
                <div className="inline-block relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 blur-xl opacity-40 animate-pulse"></div>
                  <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    🔥 Last Chance!
                  </h2>
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Transform Your Life with {product.name}
                </p>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Don't let this opportunity slip away. Join thousands who've already started their success journey!
                </p>
              </div>

              {/* Urgency Section */}
              <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 md:p-12 shadow-2xl mb-8 animate-pulse">
                <div className="text-white text-center">
                  <h3 className="text-2xl md:text-3xl font-black mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    ⏰ Special Launch Price Ending Soon!
                  </h3>
                  <p className="text-lg md:text-xl mb-6 opacity-90">
                    Price increases to ₹{pricing.originalPrice || '997'} after this promotion ends
                  </p>
                  
                  {/* Final Pricing */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <span className="text-2xl md:text-3xl line-through opacity-60">₹{pricing.originalPrice || '997'}</span>
                    <span className="text-5xl md:text-6xl lg:text-7xl font-black text-yellow-300 animate-pulse" style={{ fontFamily: 'Oswald, sans-serif' }}>
                      ₹{pricing.currentPrice || '394'}
                    </span>
                  </div>

                  <button 
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="w-full md:w-auto bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 disabled:from-gray-400 disabled:to-gray-500 text-gray-900 disabled:text-gray-600 px-12 md:px-16 py-5 md:py-6 rounded-full text-xl md:text-2xl lg:text-3xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 disabled:transform-none disabled:cursor-not-allowed border-4 border-white animate-bounce min-h-[64px] md:min-h-[72px] touch-manipulation" 
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}
                  >
                    {paymentLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        Processing Payment...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3 md:gap-4">
                        <span className="animate-pulse">🚀</span>
                        GET {product.name} NOW!
                        <span className="animate-pulse">💎</span>
                      </span>
                    )}
                  </button>

                  {/* Final Trust Indicators */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8 text-base md:text-lg opacity-90">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl animate-bounce">⚡</span>
                      <span className="font-bold">Instant Access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl animate-bounce">🛡️</span>
                      <span className="font-bold">30-Day Guarantee</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl animate-bounce">💎</span>
                      <span className="font-bold">Lifetime Value</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Message */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 italic" style={{ fontFamily: 'Poppins, sans-serif' }}>
                "The best time to plant a tree was 20 years ago. The second best time is now." - Start your {product.name} journey today!
              </p>

            </div>
          </div>
        </section>
    </div>
  );
};

export default ProductDetailsPage;
