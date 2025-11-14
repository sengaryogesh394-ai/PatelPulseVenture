import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

// POST /api/test-imageurl - Test imageUrl saving
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Find the Multimallpro project
    const projectId = '6915a4e5e85f62bd6a77711e';
    
    console.log('TEST API: Looking for project:', projectId);
    
    // First, check the schema
    console.log('TEST API: Project schema paths:', Object.keys(Project.schema.paths));
    console.log('TEST API: Has imageUrl in schema?', 'imageUrl' in Project.schema.paths);
    
    // Try to update with imageUrl
    const testImageUrl = 'https://picsum.photos/800/600';
    
    console.log('TEST API: Attempting to update with imageUrl:', testImageUrl);
    
    const updateResult = await Project.updateOne(
      { id: projectId },
      { 
        $set: { 
          imageUrl: testImageUrl,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('TEST API: Update result:', updateResult);
    
    // Verify the update
    const updatedProject = await Project.findOne({ id: projectId });
    console.log('TEST API: Updated project:', JSON.stringify(updatedProject, null, 2));
    
    // Also try a raw MongoDB operation to see if it's a Mongoose issue
    const rawUpdate = await Project.collection.updateOne(
      { id: projectId },
      { 
        $set: { 
          imageUrl: 'https://picsum.photos/900/700',
          rawTestField: 'test123'
        }
      }
    );
    console.log('TEST API: Raw MongoDB update result:', rawUpdate);
    
    // Check raw result
    const rawProject = await Project.collection.findOne({ id: projectId });
    console.log('TEST API: Raw project after update:', JSON.stringify(rawProject, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Test completed',
      updateResult,
      updatedProject
    });
    
  } catch (error: any) {
    console.error('TEST API: Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
