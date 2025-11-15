import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

// GET /api/blog - Get blog posts with optional search and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '9', 10)));

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $elemMatch: { $regex: q, $options: 'i' } } },
      ];
    }

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return NextResponse.json({
      success: true,
      data: blogs,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        q,
        status: status || null,
        category: category || null,
      },
    });
    
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create a new blog post
export async function POST(request: Request) {
  try {
    console.log('POST /api/blog - Starting blog creation...');
    await connectDB();
    console.log('Database connected successfully');
    
    const body = await request.json();
    console.log('Creating blog with data:', body);
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }
    if (!body.excerpt) {
      return NextResponse.json(
        { success: false, error: 'Excerpt is required' },
        { status: 400 }
      );
    }
    if (!body.content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }
    if (!body.author) {
      return NextResponse.json(
        { success: false, error: 'Author is required' },
        { status: 400 }
      );
    }
    if (!body.category) {
      return NextResponse.json(
        { success: false, error: 'Category is required' },
        { status: 400 }
      );
    }
    
    // Generate unique ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const blogId = `blog-${timestamp}-${randomNum}`;
    
    // Generate slug from title
    const baseSlug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Calculate read time (average 200 words per minute)
    const wordCount = body.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // Set published date if status is published
    const publishedAt = body.status === 'published' ? new Date() : undefined;
    
    const blogData = {
      id: blogId,
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author,
      imageId: body.imageId || 'blog-default',
      imageUrl: body.imageUrl || undefined,
      cloudinaryPublicId: body.cloudinaryPublicId || undefined,
      tags: body.tags || [],
      category: body.category,
      status: body.status || 'draft',
      featured: body.featured || false,
      publishedAt,
      readTime,
    };
    
    const newBlog = new Blog(blogData);
    await newBlog.save();
    
    console.log('Blog created successfully:', newBlog);
    
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: newBlog,
    });
    
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
