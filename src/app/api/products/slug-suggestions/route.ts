import { NextRequest, NextResponse } from 'next/server';
import { generateProductSlugSuggestions, generateUniqueProductSlug } from '@/lib/product-slug-generator';

export const dynamic = 'force-dynamic';

// POST /api/products/slug-suggestions - Generate unique slug suggestions for products
export async function POST(request: NextRequest) {
  try {
    const { productName, count = 5 } = await request.json();

    if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product name is required' },
        { status: 400 }
      );
    }

    const trimmed = productName.trim();

    const suggestions = await generateProductSlugSuggestions(trimmed, count);
    const primarySlug = await generateUniqueProductSlug(trimmed);

    return NextResponse.json({
      success: true,
      data: { primarySlug, suggestions, productName: trimmed },
      message: `Generated ${suggestions.length} unique slug suggestions`
    });
  } catch (error: any) {
    console.error('Product slug generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate product slug suggestions', details: error.message },
      { status: 500 }
    );
  }
}
