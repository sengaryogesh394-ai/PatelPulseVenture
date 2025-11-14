'use client';

import { useState } from 'react';

interface PaymentData {
  productId: string;
  customerEmail?: string;
  customerPhone?: string;
}

interface PaymentResponse {
  success: boolean;
  data?: {
    orderId: string;
    amount: number;
    amountInPaise: number;
    currency: string;
    productName: string;
    productId: string;
    keyId: string;
    customerEmail?: string;
    customerPhone?: string;
    receiptId: string;
  };
  error?: string;
}

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const openRazorpayCheckout = (paymentData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        initializeRazorpay();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    } else {
      initializeRazorpay();
    }

    function initializeRazorpay() {
      const options = {
        key: paymentData.keyId,
        amount: paymentData.amountInPaise,
        currency: paymentData.currency,
        name: 'DigiAdda',
        description: paymentData.productName,
        order_id: paymentData.orderId,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          // Redirect to success page with product ID
          window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&productId=${paymentData.productId}&amount=${paymentData.amount}`;
          resolve(response);
        },
        prefill: {
          name: '',
          email: paymentData.customerEmail || '',
          contact: paymentData.customerPhone || ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        // Still redirect to success page but with failure status so user can access download
        window.location.href = `/payment/success?status=failed&productId=${paymentData.productId}&error=${encodeURIComponent(response.error.description)}&amount=${paymentData.amount}`;
        reject(new Error(response.error.description));
      });

      rzp.open();
    }
  });
};

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (paymentData: PaymentData) => {
    try {
      setLoading(true);
      setError(null);

      // Call payment initiation API
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result: PaymentResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Payment initiation failed');
      }

      if (!result.data) {
        throw new Error('Invalid payment response');
      }

      console.log('Initiating Razorpay payment:', result.data);

      // Open Razorpay checkout
      await openRazorpayCheckout(result.data);

      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Payment initiation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initiatePaymentWithModal = async (paymentData: PaymentData) => {
    try {
      setLoading(true);
      setError(null);

      // Show customer details modal first
      const customerDetails = await showCustomerDetailsModal();
      
      if (customerDetails) {
        await initiatePayment({
          ...paymentData,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showCustomerDetailsModal = (): Promise<{ email: string; phone: string } | null> => {
    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      
      // Create modal content
      overlay.innerHTML = `
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Complete Your Purchase</h2>
          <form id="customer-form" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
              <input 
                type="email" 
                id="customer-email" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
              <input 
                type="tel" 
                id="customer-phone" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
            <div class="flex gap-3 mt-6">
              <button 
                type="button" 
                id="cancel-btn"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-bold transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
              >
                Proceed to Pay
              </button>
            </div>
          </form>
        </div>
      `;

      // Add event listeners
      const form = overlay.querySelector('#customer-form') as HTMLFormElement;
      const cancelBtn = overlay.querySelector('#cancel-btn') as HTMLButtonElement;
      const emailInput = overlay.querySelector('#customer-email') as HTMLInputElement;
      const phoneInput = overlay.querySelector('#customer-phone') as HTMLInputElement;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        
        if (email && phone) {
          document.body.removeChild(overlay);
          resolve({ email, phone });
        }
      });

      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        resolve(null);
      });

      // Add to document
      document.body.appendChild(overlay);
    });
  };

  return {
    initiatePayment,
    initiatePaymentWithModal,
    loading,
    error,
  };
};
