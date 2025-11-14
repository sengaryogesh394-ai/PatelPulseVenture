import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    console.log('Testing blog API...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Test creating a simple blog post
    const testBlog = {
      id: 'test-blog-' + Date.now(),
      title: 'Test Blog Post',
      slug: 'test-blog-post-' + Date.now(),
      excerpt: 'This is a test excerpt',
      content: 'This is test content for the blog post',
      author: 'Test Author',
      imageId: 'blog-default',
      tags: ['test', 'api'],
      category: 'Technology',
      status: 'draft',
      featured: false,
      readTime: 1,
    };
    
    console.log('Creating test blog:', testBlog);
    const newBlog = new Blog(testBlog);
    await newBlog.save();
    console.log('Test blog created successfully:', newBlog);
    
    return NextResponse.json({
      success: true,
      message: 'Blog API test successful',
      data: newBlog,
    });
    
  } catch (error: any) {
    console.error('Blog API test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
