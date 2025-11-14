import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';

export const dynamic = 'force-dynamic';

// POST /api/team/seed - Seed database with existing team members
export async function POST() {
  try {
    await connectDB();
    
    // Existing team members from your website
    const seedTeamMembers = [
      {
        id: 'team-1',
        name: 'Adarsh Deep Sachan',
        position: 'Founder',
        bio: 'Visionary leader with extensive experience in technology and business development. Passionate about building innovative solutions that make a real impact.',
        imageUrl: 'https://alt.tailus.io/images/team/member-one.webp',
        socialLinks: {
          linkedin: '#',
          twitter: '#',
          github: '#',
          email: 'adarsh@patelpulseventures.com',
        },
        status: 'active',
        order: 1,
      },
      {
        id: 'team-2',
        name: 'Anand Patel',
        position: 'Co-Founder - CTO',
        bio: 'Technical expert with deep knowledge in software architecture and system design. Leads our engineering team with innovation and excellence.',
        imageUrl: 'https://alt.tailus.io/images/team/member-two.webp',
        socialLinks: {
          linkedin: '#',
          twitter: '#',
          github: '#',
          email: 'anand@patelpulseventures.com',
        },
        status: 'active',
        order: 2,
      },
      {
        id: 'team-3',
        name: 'Alisha',
        position: 'Sales Manager',
        bio: 'Dynamic sales professional with a proven track record of building strong client relationships and driving business growth.',
        imageUrl: 'https://alt.tailus.io/images/team/member-three.webp',
        socialLinks: {
          linkedin: '#',
          twitter: '#',
          github: '#',
          email: 'alisha@patelpulseventures.com',
        },
        status: 'active',
        order: 3,
      },
      {
        id: 'team-4',
        name: 'Yogesh Sengar',
        position: 'UX Engineer',
        bio: 'Creative UX engineer who bridges the gap between design and development, creating intuitive and engaging user experiences.',
        imageUrl: 'https://alt.tailus.io/images/team/member-four.webp',
        socialLinks: {
          linkedin: '#',
          twitter: '#',
          github: '#',
          email: 'yogesh@patelpulseventures.com',
        },
        status: 'active',
        order: 4,
      },
      {
        id: 'team-5',
        name: 'Shruti Sachan',
        position: 'Interaction Designer',
        bio: 'Talented interaction designer focused on creating seamless and delightful user interactions that enhance the overall user experience.',
        imageUrl: 'https://alt.tailus.io/images/team/member-five.webp',
        socialLinks: {
          linkedin: '#',
          twitter: '#',
          github: '#',
          email: 'shruti@patelpulseventures.com',
        },
        status: 'active',
        order: 5,
      },
      {
        id: 'team-6',
        name: 'Sanya Bhatia',
        position: 'Visual Designer',
        bio: 'Creative visual designer with an eye for aesthetics and brand consistency, bringing ideas to life through compelling visual narratives.',
        imageUrl: 'https://alt.tailus.io/images/team/member-six.webp',
        socialLinks: {
          linkedin: '#',
          twitter: '#',
          github: '#',
          email: 'sanya@patelpulseventures.com',
        },
        status: 'active',
        order: 6,
      },
    ];

    console.log('Seeding team members...');
    
    // Clear existing team members
    await Team.deleteMany({});
    console.log('Cleared existing team members');
    
    // Insert new team members
    const insertedMembers = await Team.insertMany(seedTeamMembers);
    console.log(`Inserted ${insertedMembers.length} team members`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedMembers.length} team members`,
      data: insertedMembers,
    });
    
  } catch (error: any) {
    console.error('Error seeding team members:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/team/seed - Reset/clear all team members
export async function DELETE() {
  try {
    await connectDB();
    
    const result = await Team.deleteMany({});
    console.log(`Deleted ${result.deletedCount} team members`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} team members`,
      deletedCount: result.deletedCount,
    });
    
  } catch (error: any) {
    console.error('Error resetting team members:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
