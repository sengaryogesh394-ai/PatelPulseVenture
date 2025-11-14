import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// GET /api/team - Get all team members
export async function GET() {
  try {
    await connectDB();
    const teamMembers = await Team.find({ status: 'active' }).sort({ order: 1, createdAt: 1 });
    
    return NextResponse.json({
      success: true,
      data: teamMembers,
    });
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/team - Create a new team member
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Debug logging
    console.log('Creating team member with body:', body);
    console.log('ImageURL received:', body.imageUrl);
    
    const { name, position, bio, imageId, imageUrl, socialLinks, status, order } = body;
    
    if (!name || !position || !bio) {
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
        const teamId = new mongoose.Types.ObjectId().toString();
        
        const newTeamMember = new Team({
          id: teamId,
          name,
          position,
          bio,
          imageId,
          imageUrl,
          socialLinks,
          status: status || 'active',
          order: order || 0
        });

        const savedTeamMember = await newTeamMember.save();
        
        return NextResponse.json({
          success: true,
          data: savedTeamMember,
          message: 'Team member created successfully'
        });
      } catch (error: any) {
        if (error.code === 11000) {
          attempts++;
          if (attempts >= maxAttempts) {
            return NextResponse.json(
              { success: false, error: 'Failed to generate unique ID after multiple attempts' },
              { status: 500 }
            );
          }
          continue;
        }
        throw error;
      }
    }
  } catch (error: any) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
