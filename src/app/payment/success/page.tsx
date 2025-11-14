'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, Home, ExternalLink } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  downloadLink: string;
  price: number;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId');
  const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');
  const txnId = searchParams.get('txnId');
  const amount = searchParams.get('amount');
  const status = searchParams.get('status'); // 'failed' or null (success)
  const paymentError = searchParams.get('error');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPaymentFailed = status === 'failed';
  const isPaymentSuccess = !isPaymentFailed;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      // If we have payment success info, we should always try to fetch product
      const productId = searchParams.get('productId');
      
      if (!productId) {
        setError('Product information not found');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching product details for ID:', productId);
        // Try PPV first, then Digiworldadda
        let resp = await fetch(`/api/products/${productId}?company=ppv`);
        let result = await resp.json();
        if (!(result?.success && result?.data)) {
          resp = await fetch(`/api/products/${productId}?company=digiworldadda`);
          result = await resp.json();
        }

        if (result?.success && result?.data) {
          setProduct(result.data);
          console.log('Product loaded:', result.data);
        } else {
          console.error('Product fetch failed:', result);
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isPaymentSuccess 
        ? 'bg-gradient-to-br from-green-50 to-teal-50' 
        : 'bg-gradient-to-br from-orange-50 to-yellow-50'
    }`}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* Status Icon */}
        <div className="mb-6">
          {isPaymentSuccess ? (
            <>
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Your order has been confirmed and processed successfully.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                Payment Issue
              </h1>
              <p className="text-gray-600 mb-2">
                There was an issue with your payment, but you can still access your download.
              </p>
              {paymentError && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  Error: {decodeURIComponent(paymentError)}
                </p>
              )}
            </>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>
          <div className="space-y-2 text-sm">
            {product && (
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-semibold text-gray-900">{product.name}</span>
              </div>
            )}
            {orderId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-gray-900 text-xs">{orderId}</span>
              </div>
            )}
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono text-gray-900 text-xs">{paymentId}</span>
              </div>
            )}
            {txnId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-gray-900 text-xs">{txnId}</span>
              </div>
            )}
            {(amount || product?.price) && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-bold text-green-600">₹{amount || product?.price}</span>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            {isPaymentSuccess ? "What's Next?" : "Access Your Product"}
          </h3>
          <div className="text-left space-y-2 text-sm text-gray-600">
            {isPaymentSuccess ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>You'll receive a confirmation email shortly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Download your product using the button below</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Contact support if you need any help</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>You can still download your product below</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Try payment again if needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Contact support for payment assistance</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {loading ? (
            <div className="w-full bg-gray-200 text-gray-500 py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
              Loading product details...
            </div>
          ) : product ? (
            // Always show download button if we have product info
            <a 
              href={product.downloadLink || '#'} 
              target={product.downloadLink ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`block w-full py-3 px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                product.downloadLink 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              onClick={!product.downloadLink ? (e) => e.preventDefault() : undefined}
            >
              <div className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                {product.downloadLink ? `Download ${product.name}` : 'Download Link Coming Soon'}
                {product.downloadLink && <ExternalLink className="w-4 h-4" />}
              </div>
            </a>
          ) : (
            <div className="w-full bg-yellow-100 text-yellow-700 py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2">
              <span>📧</span>
              Download link will be sent via email
            </div>
          )}
          
          <Link href="/" className="block">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@digiaddaworld.com" className="text-blue-600 hover:underline">
              support@digiaddaworld.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
