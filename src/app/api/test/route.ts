import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing API route...');
    
    // Test basic response
    const basicTest = {
      success: true,
      message: 'API route is working!',
      timestamp: new Date().toISOString(),
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV
      }
    };
    
    // Test MongoDB connection
    try {
      await connectDB();
      basicTest.message += ' MongoDB connection successful!';
    } catch (dbError) {
      console.error('MongoDB test failed:', dbError);
      return NextResponse.json({
        ...basicTest,
        success: false,
        message: 'API working but MongoDB connection failed',
        dbError: dbError instanceof Error ? dbError.message : 'Unknown DB error'
      });
    }
    
    return NextResponse.json(basicTest);
  } catch (error) {
    console.error('API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
