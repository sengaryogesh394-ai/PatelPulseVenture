import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sale from '@/models/Sale';

export const dynamic = 'force-dynamic';

// GET /api/sales?userId=... | ?email=...
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;
    const email = searchParams.get('email') || undefined;

    if (!userId && !email) {
      return NextResponse.json({ success: false, error: 'Missing userId or email' }, { status: 400 });
    }

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (email) filter.customerEmail = email;

    const sales = await Sale.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: sales });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
