import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { projects } from '@/lib/data';

export const dynamic = 'force-dynamic';

// POST /api/projects/seed - Seed database with existing projects
export async function POST() {
  try {
    await connectDB();

    const existingCount = await Project.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Projects already exist in database. Click "Reset & Seed" to update with new details.',
          existingCount,
        },
        { status: 400 }
      );
    }

    const projectsWithDefaults = projects.map((p) => ({
      ...p,
      status: p.status || 'active',
    }));

    const inserted = await Project.insertMany(projectsWithDefaults);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted.length} projects`,
      data: inserted,
    });
  } catch (error: any) {
    console.error('Error seeding projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed projects', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/seed - Reset and reseed projects
export async function DELETE() {
  try {
    await connectDB();

    await Project.deleteMany({});

    const projectsWithDefaults = projects.map((p) => ({
      ...p,
      status: p.status || 'active',
    }));

    const inserted = await Project.insertMany(projectsWithDefaults);

    return NextResponse.json({
      success: true,
      message: `Successfully reset and seeded ${inserted.length} projects`,
      data: inserted,
    });
  } catch (error: any) {
    console.error('Error resetting projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset projects', details: error.message },
      { status: 500 }
    );
  }
}
