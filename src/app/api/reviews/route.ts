import { NextRequest, NextResponse } from 'next/server';
import { ReviewController } from '@/lib/reviewController';

// GET all reviews (admin)
export async function GET(request: NextRequest) {
  try {
    const result = await ReviewController.getAllReviews();
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
