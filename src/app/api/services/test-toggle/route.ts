import { NextResponse } from 'next/server';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// GET /api/services/test-toggle - Test toggle functionality
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Toggle API endpoint is working!',
      timestamp: new Date().toISOString(),
      endpoints: {
        toggle: '/api/services/[id]/toggle-status',
        method: 'PATCH'
      }
    });
  } catch (error) {
    console.error('Test toggle API failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/services/test-toggle - Test toggle with mock data
export async function POST() {
  try {
    // Simulate toggle response
    const mockResponse = {
      success: true,
      data: {
        id: '1',
        name: 'Test Service',
        status: 'inactive',
        updatedAt: new Date().toISOString()
      },
      message: 'Service deactivated successfully'
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Test toggle POST failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
