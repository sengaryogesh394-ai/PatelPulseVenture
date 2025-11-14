import { NextRequest, NextResponse } from 'next/server';
import { razorpayService } from '../../../../lib/razorpay';
import connectDB from '../../../../lib/mongodb';
import Sale from '../../../../models/Sale';

export async function POST(request: NextRequest) {
  try {
    const { productId, customerEmail, customerPhone } = await request.json();

    // No authentication required: use provided customer details
    const userId = null;
    const userEmail = customerEmail || '';
    const userName = '';

    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
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

    // Try to get product from both collections (PPV first, then Digiworldadda)
    let product: any = null;
    try {
      let resp = await fetch(`${baseUrl}/api/products/${productId}?company=ppv`);
      let resJson = await resp.json();
      if (resJson?.success && resJson?.data) {
        product = resJson.data;
      } else {
        resp = await fetch(`${baseUrl}/api/products/${productId}?company=digiworldadda`);
        resJson = await resp.json();
        if (resJson?.success && resJson?.data) {
          product = resJson.data;
        }
      }
    } catch {}

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate receipt ID for Razorpay
    const receiptId = razorpayService.generateReceiptId(productId);

    // Convert amount to paise (Razorpay uses paise)
    const amountInPaise = Math.round(product.price * 100);

    try {
      // Create Razorpay order
      const razorpayOrder = await razorpayService.createOrder({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          productId: productId,
          productName: product.name,
          customerEmail: customerEmail || '',
          customerPhone: customerPhone || '',
          downloadLink: product.downloadLink || '',
          instructions: `Download your purchase: ${product.downloadLink || 'Link will be provided'}`,
          supportEmail: 'support@digiaddaworld.com'
        }
      });

      // Debug logging
      console.log('Razorpay order created:', {
        orderId: razorpayOrder.id,
        amount: product.price,
        amountInPaise,
        productName: product.name,
        receiptId,
        customerEmail,
        customerPhone
      });

      // Create sale record in database
      try {
        await connectDB();
        
        const saleData = {
          productId: productId,
          productName: product.name,
          productCategory: product.category || 'Digital Product',
          productPrice: product.price,
          downloadLink: product.downloadLink,
          userId: userId,
          customerEmail: userEmail,
          customerPhone: customerPhone || '',
          customerName: userName,
          orderId: receiptId, // Using receipt ID as our internal order ID
          razorpayOrderId: razorpayOrder.id,
          amount: product.price,
          currency: 'INR',
          receiptId: receiptId,
          notes: {
            razorpayOrderId: razorpayOrder.id,
            productId: productId,
            productName: product.name,
            downloadLink: product.downloadLink,
            userId: userId,
            userEmail: userEmail
          },
          userAgent: request.headers.get('user-agent') || '',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
          source: 'web',
          paymentStatus: 'pending',
          orderStatus: 'created'
        };

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
          amount: product.price,
          amountInPaise: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          productName: product.name,
          productId: productId,
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
