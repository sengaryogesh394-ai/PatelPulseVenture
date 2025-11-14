import { Blog } from './types';

const API_BASE = '/api/blog';

// Get all blog posts
export async function getBlogs(): Promise<Blog[]> {
  try {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch blogs');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

// Get a specific blog post
export async function getBlog(id: string): Promise<Blog> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch blog');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
}

// Create a new blog post
export async function createBlog(blogData: Omit<Blog, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create blog');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}

// Update a blog post
export async function updateBlog(id: string, blogData: Partial<Blog>): Promise<Blog> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update blog');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
}

// Delete a blog post
export async function deleteBlog(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete blog');
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}
