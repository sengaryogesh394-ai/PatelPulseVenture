import { NextRequest, NextResponse } from 'next/server';
import { razorpayService } from '../../../../lib/razorpay';
import connectDB from '../../../../lib/mongodb';
import Sale from '../../../../models/Sale';

export async function POST(request: NextRequest) {
  try {
    const { productId, serviceId, customerEmail, customerPhone } = await request.json();

    // No authentication required: use provided customer details
    const userId = null;
    const userEmail = customerEmail || '';
    const userName = '';

    // Validate required fields
    if (!productId && !serviceId) {
      return NextResponse.json(
        { success: false, error: 'Either productId or serviceId is required' },
        { status: 400 }
      );
    }

    // Debug environment variables
    console.log('Environment variables check:', {
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING',
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'MISSING',
      NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'SET' : 'MISSING',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'DEFAULT: http://localhost:9002'
    });

    // Check if Razorpay is configured
    if (!razorpayService.isConfigured()) {
      console.error('Razorpay configuration failed:', {
        keyId: !!process.env.RAZORPAY_KEY_ID,
        keySecret: !!process.env.RAZORPAY_KEY_SECRET
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment gateway not configured. Missing Razorpay credentials in environment variables.',
          debug: {
            keyId: !!process.env.RAZORPAY_KEY_ID,
            keySecret: !!process.env.RAZORPAY_KEY_SECRET,
            publicKeyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
          }
        },
        { status: 500 }
      );
    }

    // Derive base URL from request origin or env
    const baseUrl = request.headers.get('origin')
      || process.env.NEXT_PUBLIC_BASE_URL
      || 'http://localhost:3000';

    // Resolve item (product or service)
    let item: any = null;
    let itemType: 'product' | 'service' = 'product';
    if (serviceId) {
      try {
        const resp = await fetch(`${baseUrl}/api/services/${serviceId}`);
        const resJson = await resp.json();
        if (resJson?.success && resJson?.data) {
          item = resJson.data;
          itemType = 'service';
        }
      } catch {}
    } else if (productId) {
      try {
        let resp = await fetch(`${baseUrl}/api/products/${productId}?company=ppv`);
        let resJson = await resp.json();
        if (resJson?.success && resJson?.data) {
          item = resJson.data;
        } else {
          resp = await fetch(`${baseUrl}/api/products/${productId}?company=digiworldadda`);
          resJson = await resp.json();
          if (resJson?.success && resJson?.data) {
            item = resJson.data;
          }
        }
      } catch {}
    }

    if (!item) {
      return NextResponse.json(
        { success: false, error: itemType === 'service' ? 'Service not found' : 'Product not found' },
        { status: 404 }
      );
    }

    // Generate receipt ID for Razorpay
    const baseId = productId || serviceId;
    const receiptId = razorpayService.generateReceiptId(baseId);

    // Convert amount to paise (Razorpay uses paise)
    const unitAmount = itemType === 'service' 
      ? (typeof item.priceFrom === 'number' ? item.priceFrom : (typeof item.priceTo === 'number' ? item.priceTo : 0))
      : item.price;
    const amountInPaise = Math.round((unitAmount || 0) * 100);

    try {
      // Create Razorpay order
      const razorpayOrder = await razorpayService.createOrder({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          productId: productId || '',
          serviceId: serviceId || '',
          productName: item.name,
          customerEmail: customerEmail || '',
          customerPhone: customerPhone || '',
          downloadLink: item.downloadLink || '',
          instructions: itemType === 'product' ? `Download your purchase: ${item.downloadLink || 'Link will be provided'}` : 'We will contact you to fulfill your service shortly',
          supportEmail: 'support@digiaddaworld.com'
        }
      });

      // Debug logging
      console.log('Razorpay order created:', {
        orderId: razorpayOrder.id,
        amount: unitAmount,
        amountInPaise,
        productName: item.name,
        receiptId,
        customerEmail,
        customerPhone
      });

      // Create sale record in database
      try {
        await connectDB();
        
        const saleData: any = {
          productId: itemType === 'product' ? productId : undefined,
          productName: item.name,
          productCategory: itemType === 'product' ? (item.category || 'Digital Product') : 'Service',
          productPrice: unitAmount,
          downloadLink: item.downloadLink,
          userId: userId,
          customerEmail: userEmail,
          customerPhone: customerPhone || '',
          customerName: userName,
          orderId: receiptId, // Using receipt ID as our internal order ID
          razorpayOrderId: razorpayOrder.id,
          amount: unitAmount,
          currency: 'INR',
          receiptId: receiptId,
          notes: {
            razorpayOrderId: razorpayOrder.id,
            productId: productId,
            serviceId: serviceId,
            productName: item.name,
            downloadLink: item.downloadLink,
            userId: userId,
            userEmail: userEmail
          },
          userAgent: request.headers.get('user-agent') || '',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
          source: 'web',
          paymentStatus: 'pending',
          orderStatus: 'created'
        };
        if (itemType === 'service') {
          saleData.serviceId = serviceId;
        }

        const sale = new Sale(saleData);
        await sale.save();
        
        console.log('Sale record created:', sale._id);
      } catch (saleError) {
        console.error('Failed to create sale record:', saleError);
        // Don't fail the payment initiation if sale record creation fails
      }

      return NextResponse.json({
        success: true,
        data: {
          orderId: razorpayOrder.id,
          amount: unitAmount,
          amountInPaise: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          productName: item.name,
          productId: productId,
          serviceId: serviceId,
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          customerEmail,
          customerPhone,
          receiptId
        }
      });

    } catch (orderError: any) {
      console.error('Razorpay order creation failed:', orderError);
      return NextResponse.json(
        { success: false, error: `Failed to create payment order: ${orderError.message}` },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
