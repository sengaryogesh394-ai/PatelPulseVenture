// Note: Install razorpay package with: npm install razorpay
// For now, using dynamic import to handle potential missing package
let Razorpay: any;

interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

interface CreateOrderParams {
  amount: number; // Amount in paise (multiply by 100)
  currency: string;
  receipt: string;
  notes?: Record<string, any>;
}

interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

class RazorpayService {
  private razorpay: any = null;
  private config: RazorpayConfig;

  constructor() {
    this.config = {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || ''
    };
  }

  // Initialize Razorpay instance
  private async initializeRazorpay() {
    if (!this.razorpay && this.isConfigured()) {
      try {
        const RazorpayClass = (await import('razorpay')).default;
        this.razorpay = new RazorpayClass({
          key_id: this.config.keyId,
          key_secret: this.config.keySecret
        });
      } catch (error) {
        console.error('Failed to initialize Razorpay:', error);
        throw new Error('Razorpay package not installed. Run: npm install razorpay');
      }
    }
  }

  // Check if Razorpay is properly configured
  public isConfigured(): boolean {
    return !!(this.config.keyId && this.config.keySecret);
  }

  // Create a Razorpay order
  public async createOrder(params: CreateOrderParams): Promise<RazorpayOrder> {
    console.log('Creating Razorpay order with params:', params);
    console.log('Razorpay config check:', {
      keyId: this.config.keyId ? 'SET' : 'MISSING',
      keySecret: this.config.keySecret ? 'SET' : 'MISSING',
      isConfigured: this.isConfigured()
    });

    await this.initializeRazorpay();
    
    if (!this.razorpay) {
      throw new Error('Razorpay not configured - missing credentials');
    }

    try {
      const orderData = {
        amount: params.amount, // Amount in paise
        currency: params.currency,
        receipt: params.receipt,
        notes: params.notes || {}
      };

      console.log('Sending order data to Razorpay:', orderData);
      
      const order = await this.razorpay.orders.create(orderData);
      
      console.log('Razorpay order created successfully:', order);
      return order as RazorpayOrder;
    } catch (error: any) {
      console.error('Razorpay order creation failed - Full error:', error);
      
      // Razorpay errors have nested structure: error.error contains the actual error details
      const razorpayError = error.error || error;
      
      console.error('Razorpay error details:', {
        message: razorpayError.message,
        code: razorpayError.code,
        description: razorpayError.description,
        source: razorpayError.source,
        step: razorpayError.step,
        reason: razorpayError.reason,
        metadata: razorpayError.metadata
      });
      
      // Provide more specific error messages
      if (razorpayError.code === 'BAD_REQUEST_ERROR') {
        throw new Error(`Razorpay Bad Request: ${razorpayError.description || razorpayError.message || 'Invalid request parameters'}`);
      } else if (razorpayError.code === 'UNAUTHORIZED') {
        throw new Error('Razorpay Authentication Failed: Invalid Key ID or Key Secret');
      } else {
        throw new Error(`Razorpay Error: ${razorpayError.description || razorpayError.message || error.message || 'Unknown error occurred'}`);
      }
    }
  }

  // Verify payment signature
  public verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    if (!this.razorpay) {
      throw new Error('Razorpay not configured');
    }

    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.config.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Payment signature verification failed:', error);
      return false;
    }
  }

  // Verify webhook signature
  public verifyWebhookSignature(body: string, signature: string): boolean {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.config.keySecret)
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  // Generate receipt ID (max 40 characters for Razorpay)
  public generateReceiptId(productId: string): string {
    const timestamp = Date.now();
    const shortProductId = productId.slice(-8); // Last 8 characters of product ID
    const shortTimestamp = timestamp.toString().slice(-8); // Last 8 digits of timestamp
    return `rcpt_${shortProductId}_${shortTimestamp}`; // Format: rcpt_12345678_87654321 (max 25 chars)
  }

  // Get Razorpay key ID for frontend
  public getKeyId(): string {
    return this.config.keyId;
  }

  // Convert rupees to paise
  public static rupeesToPaise(rupees: number): number {
    return Math.round(rupees * 100);
  }

  // Convert paise to rupees
  public static paiseToRupees(paise: number): number {
    return paise / 100;
  }
}

export const razorpayService = new RazorpayService();
export type { RazorpayOrder, CreateOrderParams };
