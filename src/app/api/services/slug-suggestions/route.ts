import { NextRequest, NextResponse } from 'next/server';
import { generateSlugSuggestions, generateUniqueSlug } from '@/lib/slug-generator';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// POST /api/services/slug-suggestions - Generate unique slug suggestions
export async function POST(request: NextRequest) {
  try {
    const { serviceName, count = 5 } = await request.json();

    if (!serviceName || typeof serviceName !== 'string' || serviceName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Service name is required' },
        { status: 400 }
      );
    }

    const trimmedServiceName = serviceName.trim();

    console.log('Generating slug suggestions for:', trimmedServiceName);

    // Generate multiple suggestions
    const suggestions = await generateSlugSuggestions(trimmedServiceName, count);
    
    // Also generate the primary unique slug
    const primarySlug = await generateUniqueSlug(trimmedServiceName);

    return NextResponse.json({
      success: true,
      data: {
        primarySlug,
        suggestions,
        serviceName: trimmedServiceName
      },
      message: `Generated ${suggestions.length} unique slug suggestions`
    });

  } catch (error) {
    console.error('Slug generation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate slug suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
