'use client';

import { useState } from 'react';
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
  Filter,
  Calendar,
  User,
  FileText,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock blog data
const mockBlogs = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    slug: 'future-ai-web-development',
    excerpt: 'Exploring how artificial intelligence is revolutionizing the way we build websites and web applications.',
    content: 'Full blog content here...',
    author: 'Adarsh Deep Sachan',
    status: 'published',
    category: 'Technology',
    tags: ['AI', 'Web Development', 'Future Tech'],
    publishedAt: '2024-11-10',
    views: 1250,
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Building Scalable E-commerce Solutions',
    slug: 'building-scalable-ecommerce-solutions',
    excerpt: 'Best practices for creating e-commerce platforms that can handle growth and high traffic.',
    content: 'Full blog content here...',
    author: 'Anand Patel',
    status: 'published',
    category: 'E-commerce',
    tags: ['E-commerce', 'Scalability', 'Architecture'],
    publishedAt: '2024-11-08',
    views: 890,
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'UX Design Trends for 2024',
    slug: 'ux-design-trends-2024',
    excerpt: 'The latest trends in user experience design that will shape digital products in 2024.',
    content: 'Full blog content here...',
    author: 'Yogesh Sengar',
    status: 'draft',
    category: 'Design',
    tags: ['UX', 'Design', 'Trends'],
    publishedAt: null,
    views: 0,
    readTime: '4 min read'
  },
  {
    id: '4',
    title: 'Mobile-First Development Strategy',
    slug: 'mobile-first-development-strategy',
    excerpt: 'Why mobile-first approach is crucial for modern web development and how to implement it.',
    content: 'Full blog content here...',
    author: 'Shruti Sachan',
    status: 'published',
    category: 'Mobile',
    tags: ['Mobile', 'Development', 'Strategy'],
    publishedAt: '2024-11-05',
    views: 675,
    readTime: '6 min read'
  },
  {
    id: '5',
    title: 'Digital Marketing in the AI Era',
    slug: 'digital-marketing-ai-era',
    excerpt: 'How artificial intelligence is transforming digital marketing strategies and customer engagement.',
    content: 'Full blog content here...',
    author: 'Alisha',
    status: 'scheduled',
    category: 'Marketing',
    tags: ['Marketing', 'AI', 'Digital'],
    publishedAt: '2024-11-15',
    views: 0,
    readTime: '8 min read'
  }
];

export default function BlogsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState(mockBlogs);

  const statuses = ['all', 'published', 'draft', 'scheduled'];
  const categories = ['all', ...Array.from(new Set(mockBlogs.map(b => b.category)))];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterBlogs(term, selectedStatus, selectedCategory);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    filterBlogs(searchTerm, status, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterBlogs(searchTerm, selectedStatus, category);
  };

  const filterBlogs = (term: string, status: string, category: string) => {
    let filtered = mockBlogs;

    if (term) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(term.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(term.toLowerCase()) ||
        blog.author.toLowerCase().includes(term.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(blog => blog.status === status);
    }

    if (category !== 'all') {
      filtered = filtered.filter(blog => blog.category === category);
    }

    setFilteredBlogs(filtered);
  };

  const handleDelete = (blogId: string) => {
    const updated = filteredBlogs.filter(blog => blog.id !== blogId);
    setFilteredBlogs(updated);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'scheduled': 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-purple-100 text-purple-800',
      'E-commerce': 'bg-blue-100 text-blue-800',
      'Design': 'bg-pink-100 text-pink-800',
      'Mobile': 'bg-green-100 text-green-800',
      'Marketing': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const totalViews = mockBlogs.reduce((sum, blog) => sum + blog.views, 0);
  const publishedBlogs = mockBlogs.filter(blog => blog.status === 'published').length;
  const draftBlogs = mockBlogs.filter(blog => blog.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your blog posts and articles.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="w-4 h-4 mr-2" />
            Write New Post
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBlogs.length}</div>
            <p className="text-xs text-muted-foreground">
              All blog posts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedBlogs}</div>
            <p className="text-xs text-muted-foreground">
              Live blog posts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftBlogs}</div>
            <p className="text-xs text-muted-foreground">
              Unpublished drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All-time views
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Blog Posts</CardTitle>
              <CardDescription>
                View and manage all your blog content
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Status: {selectedStatus === 'all' ? 'All' : selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                    >
                      {status === 'all' ? 'All Statuses' : status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Category: {selectedCategory === 'all' ? 'All' : selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold line-clamp-1">{blog.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {blog.excerpt}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {blog.readTime}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{blog.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(blog.category)}>
                      {blog.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(blog.status)}>
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {blog.publishedAt ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not published</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{blog.views.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/blog/${blog.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(blog.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No blog posts found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by writing your first blog post.'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && selectedCategory === 'all' && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/blogs/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Write New Post
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
