import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

// PATCH /api/projects/[id]/toggle-status - Toggle project status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const project = await Project.findOne({ id: params.id });
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Toggle status
    const newStatus = project.status === 'active' ? 'inactive' : 'active';
    
    const updatedProject = await Project.findOneAndUpdate(
      { id: params.id },
      { status: newStatus, updatedAt: new Date() },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: `Project status changed to ${newStatus}`
    });
  } catch (error: any) {
    console.error('Error toggling project status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle project status', details: error.message },
      { status: 500 }
    );
  }
}
