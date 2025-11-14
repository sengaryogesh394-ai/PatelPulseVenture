import { NextRequest, NextResponse } from 'next/server';
import { razorpayService } from '@/lib/razorpay';
import connectDB from '@/lib/mongodb';
import Sale from '@/models/Sale';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = razorpayService.verifyWebhookSignature(body, signature);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    
    await connectDB();

    // Handle payment success event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert from paise to rupees
      
      console.log('Payment captured:', {
        orderId,
        paymentId,
        amount,
        notes: payment.notes
      });

      // Update sale record
      try {
        const sale = await Sale.findOne({ razorpayOrderId: orderId });
        
        if (sale) {
          sale.paymentStatus = 'success';
          sale.orderStatus = 'completed';
          sale.razorpayPaymentId = paymentId;
          sale.paymentCompletedAt = new Date();
          sale.paymentMethod = payment.method || 'unknown';
          
          await sale.save();
          console.log('Sale record updated for successful payment:', sale._id);
        } else {
          console.warn('Sale record not found for order:', orderId);
        }
      } catch (error) {
        console.error('Failed to update sale record:', error);
      }

      // You can add email sending logic here
      // await sendDownloadEmail({
      //   email: payment.notes?.customerEmail,
      //   productName: payment.notes?.productName,
      //   downloadLink: payment.notes?.downloadLink,
      //   orderId: orderId,
      //   amount: amount
      // });
    }

    // Handle payment failure event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const errorDescription = payment.error_description || 'Payment failed';
      
      console.log('Payment failed:', {
        orderId,
        paymentId,
        error: errorDescription
      });

      // Update sale record
      try {
        const sale = await Sale.findOne({ razorpayOrderId: orderId });
        
        if (sale) {
          sale.paymentStatus = 'failed';
          sale.orderStatus = 'failed';
          sale.razorpayPaymentId = paymentId;
          sale.failureReason = errorDescription;
          
          await sale.save();
          console.log('Sale record updated for failed payment:', sale._id);
        } else {
          console.warn('Sale record not found for order:', orderId);
        }
      } catch (error) {
        console.error('Failed to update sale record:', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
