import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import Project from '@/models/Project';
import Team from '@/models/Team';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // Get counts from all collections
    const [servicesCount, projectsCount, teamCount, blogsCount, publishedBlogs] = await Promise.all([
      Service.countDocuments(),
      Project.countDocuments(),
      Team.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' })
    ]);

    // Calculate some additional stats
    const draftBlogs = blogsCount - publishedBlogs;
    const featuredBlogs = await Blog.countDocuments({ featured: true });

    const stats = {
      services: {
        total: servicesCount,
        href: '/admin/services'
      },
      projects: {
        total: projectsCount,
        href: '/admin/projects'
      },
      team: {
        total: teamCount,
        href: '/admin/team'
      },
      blogs: {
        total: blogsCount,
        published: publishedBlogs,
        drafts: draftBlogs,
        featured: featuredBlogs,
        href: '/admin/blogs'
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
