import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import Project from '@/models/Project';
import Team from '@/models/Team';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

interface Activity {
  action: string;
  time: string;
  type: 'service' | 'project' | 'team' | 'blog';
  createdAt: Date;
}

export async function GET() {
  try {
    await connectDB();
    
    const activities: Activity[] = [];

    // Get recent services (last 10)
    const recentServices = await Service.find()
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('name updatedAt createdAt');

    recentServices.forEach(service => {
      const isNew = service.createdAt.getTime() === service.updatedAt.getTime();
      activities.push({
        action: isNew ? `New service "${service.name}" added` : `Service "${service.name}" updated`,
        time: formatTimeAgo(service.updatedAt),
        type: 'service',
        createdAt: service.updatedAt
      });
    });

    // Get recent projects (last 10)
    const recentProjects = await Project.find()
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('title updatedAt createdAt');

    recentProjects.forEach(project => {
      const isNew = project.createdAt.getTime() === project.updatedAt.getTime();
      activities.push({
        action: isNew ? `New project "${project.title}" created` : `Project "${project.title}" updated`,
        time: formatTimeAgo(project.updatedAt),
        type: 'project',
        createdAt: project.updatedAt
      });
    });

    // Get recent team members (last 10)
    const recentTeam = await Team.find()
      .sort({ updatedAt: -1 })
      .limit(2)
      .select('name updatedAt createdAt');

    recentTeam.forEach((member: any) => {
      const isNew = member.createdAt.getTime() === member.updatedAt.getTime();
      activities.push({
        action: isNew ? `New team member "${member.name}" added` : `Team member "${member.name}" updated`,
        time: formatTimeAgo(member.updatedAt),
        type: 'team',
        createdAt: member.updatedAt
      });
    });

    // Get recent blogs (last 10)
    const recentBlogs = await Blog.find()
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('title status updatedAt createdAt publishedAt');

    recentBlogs.forEach(blog => {
      const isNew = blog.createdAt.getTime() === blog.updatedAt.getTime();
      let action = '';
      
      if (blog.status === 'published' && blog.publishedAt) {
        action = `Blog post "${blog.title}" published`;
      } else if (isNew) {
        action = `New blog post "${blog.title}" created`;
      } else {
        action = `Blog post "${blog.title}" updated`;
      }

      activities.push({
        action,
        time: formatTimeAgo(blog.updatedAt),
        type: 'blog',
        createdAt: blog.updatedAt
      });
    });

    // Sort all activities by date (most recent first) and limit to 8
    const sortedActivities = activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 8)
      .map(({ createdAt, ...activity }) => activity); // Remove createdAt from response

    return NextResponse.json({
      success: true,
      data: sortedActivities
    });

  } catch (error: any) {
    console.error('Error fetching dashboard activities:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
}
