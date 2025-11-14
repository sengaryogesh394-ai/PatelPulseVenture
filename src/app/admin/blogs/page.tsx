'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Calendar,
  Clock,
  Users,
  Star,
  Database,
  RotateCcw,
  Filter,
  MoreVertical,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { Blog } from '@/lib/types';
import { getBlogs, deleteBlog } from '@/lib/blog-api';

export default function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Load blogs from database
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const blogData = await getBlogs();
        setBlogs(blogData);
        setFilteredBlogs(blogData);
      } catch (error) {
        console.error('Error loading blogs:', error);
        alert('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(term.toLowerCase()) ||
        blog.author.toLowerCase().includes(term.toLowerCase()) ||
        blog.category.toLowerCase().includes(term.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredBlogs(filtered);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await deleteBlog(blogId);
      const updated = filteredBlogs.filter(blog => blog.id !== blogId);
      setFilteredBlogs(updated);
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
      alert('Blog post deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog post');
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will replace all existing blog posts with seed data. Are you sure?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/blog/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully seeded ${result.data.length} blog posts!`);
        // Reload blogs
        const blogData = await getBlogs();
        setBlogs(blogData);
        setFilteredBlogs(blogData);
      } else {
        alert(`Failed to seed blog posts: ${result.error}`);
      }
    } catch (error) {
      console.error('Error seeding blogs:', error);
      alert('Failed to seed blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('This will delete ALL blog posts. This action cannot be undone. Are you sure?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/blog/seed', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully deleted ${result.deletedCount} blog posts!`);
        // Clear local state
        setBlogs([]);
        setFilteredBlogs([]);
      } else {
        alert(`Failed to reset blog posts: ${result.error}`);
      }
    } catch (error) {
      console.error('Error resetting blogs:', error);
      alert('Failed to reset blog posts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Architecture': 'bg-indigo-100 text-indigo-800',
      'DevOps': 'bg-orange-100 text-orange-800',
      'Business': 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading blog posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="border-b border-border pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
                <p className="text-muted-foreground">
                  Create and manage your blog posts and articles
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Data Management Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSeed}
                disabled={loading}
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
              >
                <Database className="w-4 h-4 mr-2" />
                Seed Data
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReset}
                disabled={loading}
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            
            {/* Primary Action */}
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link href="/admin/blogs/new">
                <Plus className="w-4 h-4 mr-2" />
                New Blog Post
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Posts</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{blogs.length}</div>
            <p className="text-xs text-blue-600 mt-1">
              {blogs.length === 1 ? 'Blog post' : 'Blog posts'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Published</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Eye className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {blogs.filter(b => b.status === 'published').length}
            </div>
            <p className="text-xs text-green-600 mt-1">
              Live blog posts
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Drafts</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
              <Edit className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">
              {blogs.filter(b => b.status === 'draft').length}
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Draft posts
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Featured</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Star className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {blogs.filter(b => b.featured).length}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Featured posts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Blog Grid */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Blog Posts
                <Badge variant="secondary" className="ml-2">
                  {filteredBlogs.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                Manage your blog posts and articles
              </CardDescription>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or category..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64 bg-white border-gray-200 focus:border-primary"
                />
              </div>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No blog posts found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters.' 
                  : 'Get started by creating your first blog post.'
                }
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/blogs/new">
                      <Plus className="w-4 h-4 mr-2" />
                      New Blog Post
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <Card key={blog.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-0">
                    {/* Header with Image */}
                    <div className="relative">
                      {blog.imageUrl ? (
                        <img 
                          src={blog.imageUrl} 
                          alt={blog.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={getStatusColor(blog.status)}>
                          {blog.status}
                        </Badge>
                      </div>
                      
                      {/* Featured Badge */}
                      {blog.featured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      
                      {/* Action Menu */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 bg-white/90" asChild>
                          <Link href={`/blog/${blog.slug}`}>
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-50 bg-white/90" asChild>
                          <Link href={`/admin/blogs/${blog.id}/edit`}>
                            <Edit className="h-4 w-4 text-green-600" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(blog.id)}
                          className="h-8 w-8 hover:bg-red-50 text-red-600 hover:text-red-700 bg-white/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(blog.category)}>
                            {blog.category}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {blog.readTime} min read
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {blog.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {blog.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Not published'}
                          </div>
                        </div>
                        
                        {/* Tags */}
                        {blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {blog.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{blog.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${blog.status === 'published' ? 'bg-green-500' : blog.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                          <span className={`text-xs font-medium ${blog.status === 'published' ? 'text-green-700' : blog.status === 'draft' ? 'text-yellow-700' : 'text-gray-700'}`}>
                            {blog.status === 'published' ? 'Live' : blog.status === 'draft' ? 'Draft' : 'Archived'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">#{blog.id.slice(-6)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
