import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sale from '@/models/Sale';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      status, // 'success' | 'failed'
      productId,
      serviceId,
      userId,
      customerEmail,
      customerPhone,
      amount,
    } = await request.json();

    if (!razorpayOrderId || !status) {
      return NextResponse.json(
        { success: false, error: 'razorpayOrderId and status are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const sale = await Sale.findOne({ razorpayOrderId });
    if (!sale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found for the given order' },
        { status: 404 }
      );
    }

    if (userId) sale.userId = userId;
    if (customerEmail) sale.customerEmail = customerEmail;
    if (customerPhone) sale.customerPhone = customerPhone;
    if (typeof amount === 'number') sale.amount = amount;

    sale.paymentStatus = status === 'success' ? 'success' : 'failed';
    sale.orderStatus = status === 'success' ? 'completed' : 'failed';
    if (status === 'success') {
      (sale as any).paymentCompletedAt = new Date();
    }
    if (razorpayPaymentId) sale.razorpayPaymentId = razorpayPaymentId;

    if (productId && !sale.productId) sale.productId = productId;
    if (serviceId && !sale.serviceId) (sale as any).serviceId = serviceId;

    await sale.save();

    return NextResponse.json({ success: true, data: { id: sale._id } });
  } catch (error: any) {
    console.error('Payment confirm error:', error);
    return NextResponse.json({ success: false, error: 'Failed to confirm payment' }, { status: 500 });
  }
}
