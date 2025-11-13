import { NextRequest, NextResponse } from 'next/server';
import { generateServiceWithAI, generateFallbackService } from '@/lib/ai-service-generator';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// POST /api/services/generate - Generate service details with AI
export async function POST(request: NextRequest) {
  try {
    const { serviceName } = await request.json();

    if (!serviceName || typeof serviceName !== 'string' || serviceName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Service name is required' },
        { status: 400 }
      );
    }

    const trimmedServiceName = serviceName.trim();

    console.log('Generating service details for:', trimmedServiceName);

    try {
      // Try AI generation first
      const generatedService = await generateServiceWithAI(trimmedServiceName);
      
      console.log('AI generation successful');
      
      return NextResponse.json({
        success: true,
        data: generatedService,
        message: 'Service details generated successfully with AI',
        source: 'ai'
      });

    } catch (aiError) {
      console.warn('AI generation failed, using fallback:', aiError);
      
      // Use fallback if AI fails
      const fallbackService = await generateFallbackService(trimmedServiceName);
      
      return NextResponse.json({
        success: true,
        data: fallbackService,
        message: 'Service details generated with fallback template (AI unavailable)',
        source: 'fallback',
        warning: 'AI generation failed, using template. You can edit the details manually.'
      });
    }

  } catch (error) {
    console.error('Service generation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate service details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
