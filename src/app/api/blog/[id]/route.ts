import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

// GET /api/blog/[id] - Get a specific blog post
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findOne({ id });
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: blog,
    });
    
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id] - Update a blog post
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    console.log('Updating blog:', id, 'with data:', body);
    
    // Calculate read time if content changed
    let readTime = body.readTime;
    if (body.content) {
      const wordCount = body.content.split(/\s+/).length;
      readTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    
    // Set published date if status changed to published
    let publishedAt = body.publishedAt;
    if (body.status === 'published' && !publishedAt) {
      publishedAt = new Date();
    }
    
    const updateData = {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author,
      imageId: body.imageId,
      imageUrl: body.imageUrl,
      cloudinaryPublicId: body.cloudinaryPublicId,
      tags: body.tags,
      category: body.category,
      status: body.status,
      featured: body.featured,
      publishedAt,
      readTime,
      updatedAt: new Date()
    };
    
    const updateResult = await Blog.updateOne(
      { id },
      { $set: updateData }
    );
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    const updatedBlog = await Blog.findOne({ id });
    
    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedBlog,
    });
    
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Delete a blog post
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedBlog = await Blog.findOneAndDelete({ id });
    
    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
      data: deletedBlog,
    });
    
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
