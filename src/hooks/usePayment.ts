'use client';

import { useState } from 'react';

interface PaymentData {
  productId?: string;
  serviceId?: string;
  customerEmail?: string;
  customerPhone?: string;
  promoCode?: string;
  customAmount?: number;
}

interface PaymentResponse {
  success: boolean;
  data?: {
    orderId: string;
    amount: number;
    amountInPaise: number;
    currency: string;
    productName: string;
    productId?: string;
    serviceId?: string;
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
        handler: async function (response: any) {
          console.log('Payment successful:', response);
          try {
            let userId = '';
            let email = paymentData.customerEmail || '';
            let phone = paymentData.customerPhone || '';
            try {
              const raw1 = typeof window !== 'undefined' ? localStorage.getItem('ppv_user') : null;
              const raw2 = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
              const raw = raw1 || raw2;
              if (raw) {
                const u = JSON.parse(raw);
                userId = u?._id || u?.id || '';
                email = email || u?.email || '';
              }
            } catch {}

            await fetch('/api/payment/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                status: 'success',
                productId: paymentData.productId,
                serviceId: paymentData.serviceId,
                userId,
                customerEmail: email,
                customerPhone: phone,
                amount: paymentData.amount,
              }),
            });
          } catch (e) {
            console.warn('Failed to confirm payment server-side', e);
          } finally {
            // Redirect to appropriate success page
            if (paymentData.serviceId) {
              window.location.href = `/payment/service/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&serviceId=${paymentData.serviceId}&amount=${paymentData.amount}`;
            } else {
              window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&productId=${paymentData.productId}&amount=${paymentData.amount}`;
            }
            resolve(response);
          }
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
      rzp.on('payment.failed', async function (response: any) {
        console.error('Payment failed:', response.error);
        try {
          let userId = '';
          let email = paymentData.customerEmail || '';
          let phone = paymentData.customerPhone || '';
          try {
            const raw1 = typeof window !== 'undefined' ? localStorage.getItem('ppv_user') : null;
            const raw2 = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            const raw = raw1 || raw2;
            if (raw) {
              const u = JSON.parse(raw);
              userId = u?._id || u?.id || '';
              email = email || u?.email || '';
            }
          } catch {}

          await fetch('/api/payment/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.error?.metadata?.order_id || paymentData.orderId,
              status: 'failed',
              productId: paymentData.productId,
              serviceId: paymentData.serviceId,
              userId,
              customerEmail: email,
              customerPhone: phone,
              amount: paymentData.amount,
            }),
          });
        } catch (e) {
          console.warn('Failed to report failed payment', e);
        } finally {
          // Redirect to failure page
          if (paymentData.serviceId) {
            window.location.href = `/payment/service/failed?status=failed&serviceId=${paymentData.serviceId}&error=${encodeURIComponent(response.error.description)}&amount=${paymentData.amount}`;
          } else {
            window.location.href = `/payment/success?status=failed&productId=${paymentData.productId}&error=${encodeURIComponent(response.error.description)}&amount=${paymentData.amount}`;
          }
          reject(new Error(response.error.description));
        }
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

      const customerDetails = await showCustomerDetailsModal();
      if (customerDetails) {
        if ((customerDetails as any).mode === 'login') {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: (customerDetails as any).email,
              password: (customerDetails as any).password,
            }),
          });
          const data = await res.json();
          if (!data?.success) {
            throw new Error(data?.error || 'Login failed');
          }
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem('ppv_user', JSON.stringify(data.data));
            }
          } catch {}
          await initiatePayment({
            ...paymentData,
            customerEmail: (customerDetails as any).email,
            customerPhone: (customerDetails as any).phone || '',
          });
        } else {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: (customerDetails as any).name,
              email: (customerDetails as any).email,
              password: (customerDetails as any).password,
            }),
          });
          const data = await res.json();
          if (!data?.success && res.status !== 409) {
            throw new Error(data?.error || 'Registration failed');
          }
          if (data?.success) {
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem('ppv_user', JSON.stringify(data.data));
              }
            } catch {}
          } else if (res.status === 409) {
            const loginRes = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: (customerDetails as any).email,
                password: (customerDetails as any).password,
              }),
            });
            const loginData = await loginRes.json();
            if (!loginData?.success) {
              throw new Error(loginData?.error || 'Login failed');
            }
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem('ppv_user', JSON.stringify(loginData.data));
              }
            } catch {}
          }
          await initiatePayment({
            ...paymentData,
            customerEmail: (customerDetails as any).email,
            customerPhone: (customerDetails as any).phone,
          });
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showCustomerDetailsModal = (): Promise<
    | { mode: 'signup'; name: string; email: string; password: string; phone: string }
    | { mode: 'login'; email: string; password: string; phone?: string }
    | null
  > => {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';

      const render = (mode: 'signup' | 'login') => {
        overlay.innerHTML = `
          <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">${
              mode === 'signup' ? 'Create account to continue' : 'Login to continue'
            }</h2>
            <form id="customer-form" class="space-y-4">
              ${mode === 'signup' ? `
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                <input type="text" id="customer-name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your full name" />
              </div>
              ` : ''}
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                <input type="email" id="customer-email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                <input type="password" id="customer-password" required minlength="6" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="${
                  mode === 'signup' ? 'Create a password' : 'Enter your password'
                }" />
              </div>
              ${mode === 'signup' ? `
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" id="customer-phone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your phone number" />
              </div>
              ` : ''}
              <div class="text-sm text-center text-gray-600">
                ${mode === 'signup' ? `Already have an account? <button type="button" id="switch-login" class="text-blue-600 underline">Login</button>` : `New here? <button type="button" id="switch-signup" class="text-blue-600 underline">Create account</button>`}
              </div>
              <div class="flex gap-3 mt-6">
                <button type="button" id="cancel-btn" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-bold transition-all duration-300">Cancel</button>
                <button type="submit" class="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105">${
                  mode === 'signup' ? 'Sign up & Pay' : 'Login & Pay'
                }</button>
              </div>
            </form>
          </div>
        `;

        const form = overlay.querySelector('#customer-form') as HTMLFormElement;
        const cancelBtn = overlay.querySelector('#cancel-btn') as HTMLButtonElement;
        const switchLogin = overlay.querySelector('#switch-login') as HTMLButtonElement | null;
        const switchSignup = overlay.querySelector('#switch-signup') as HTMLButtonElement | null;
        const nameInput = overlay.querySelector('#customer-name') as HTMLInputElement | null;
        const emailInput = overlay.querySelector('#customer-email') as HTMLInputElement;
        const passwordInput = overlay.querySelector('#customer-password') as HTMLInputElement;
        const phoneInput = overlay.querySelector('#customer-phone') as HTMLInputElement | null;

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = emailInput.value.trim();
          const password = passwordInput.value;
          if (mode === 'login') {
            if (email && password) {
              document.body.removeChild(overlay);
              resolve({ mode: 'login', email, password });
            }
            return;
          }
          const name = (nameInput?.value || '').trim();
          const phone = (phoneInput?.value || '').trim();
          if (name && email && password && phone) {
            document.body.removeChild(overlay);
            resolve({ mode: 'signup', name, email, password, phone });
          }
        });

        cancelBtn.addEventListener('click', () => {
          document.body.removeChild(overlay);
          resolve(null);
        });

        if (switchLogin) {
          switchLogin.addEventListener('click', () => render('login'));
        }
        if (switchSignup) {
          switchSignup.addEventListener('click', () => render('signup'));
        }
      };

      render('signup');
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
