'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { Suspense } from 'react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'invalid_checksum':
        return 'Payment verification failed. Please try again.';
      case 'callback_error':
        return 'There was an error processing your payment.';
      case 'user_cancelled':
        return 'Payment was cancelled by user.';
      default:
        return error || 'Payment could not be processed. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
            Payment Failed
          </h1>
          <p className="text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>

        {/* Error Details */}
        {orderId && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-gray-900">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-bold text-red-600">Failed</span>
              </div>
            </div>
          </div>
        )}

        {/* What to do next */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">What can you do?</h3>
          <div className="text-left space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Check your internet connection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Verify your payment details</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Try a different payment method</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Contact your bank if needed</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <Link href="/" className="block">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-3">
            Still having trouble? We're here to help!
          </p>
          <a 
            href="mailto:support@digiaddaworld.com" 
            className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
