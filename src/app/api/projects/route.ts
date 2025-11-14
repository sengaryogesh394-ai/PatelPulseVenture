import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// GET /api/projects - Get all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Debug logging
    console.log('Creating project with body:', body);
    console.log('ImageURL received:', body.imageUrl);
    
    const { title, description, link, technologies, category, imageId, imageUrl, status } = body;
    
    if (!title || !description || !link || !technologies || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Require either imageId or imageUrl
    if (!imageId && !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Either imageId or imageUrl is required' },
        { status: 400 }
      );
    }

    // Generate unique ID with retry logic
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      try {
        const projectId = new mongoose.Types.ObjectId().toString();
        
        const newProject = new Project({
          id: projectId,
          title,
          description,
          link,
          technologies,
          category,
          imageId,
          imageUrl,
          status: status || 'active'
        });

        const savedProject = await newProject.save();
        
        return NextResponse.json({
          success: true,
          data: savedProject,
          message: 'Project created successfully'
        }, { status: 201 });
        
      } catch (error: any) {
        if (error.code === 11000) {
          attempts++;
          if (attempts >= maxAttempts) {
            return NextResponse.json(
              { success: false, error: 'Failed to generate unique project ID after multiple attempts' },
              { status: 500 }
            );
          }
          continue;
        }
        throw error;
      }
    }
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project', details: error.message },
      { status: 500 }
    );
  }
}
