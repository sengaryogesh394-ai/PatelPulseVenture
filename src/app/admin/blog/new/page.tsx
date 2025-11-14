'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  Plus, 
  X,
  FileText,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { createBlog } from '@/lib/blog-api';
import ImageUpload from '@/components/ui/image-upload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Form validation schema
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt must be less than 300 characters'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  imageId: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).min(1, 'At least one tag is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  readTime: z.number().min(1).optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const categories = [
  'Technology',
  'Design',
  'Architecture',
  'DevOps',
  'Business',
  'Tutorial',
  'News',
  'Opinion'
];

export default function NewBlogPost() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string>('');
  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      author: 'Adarsh Deep Sachan',
      imageId: '',
      imageUrl: '',
      tags: [''],
      category: '',
      status: 'draft',
      featured: false,
    },
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags'
  });

  const addTag = () => {
    appendTag('');
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      setIsSubmitting(true);
      
      // Clean up data
      const cleanedData = {
        ...data,
        tags: data.tags.filter(tag => tag.trim() !== ''),
        imageId: (data.imageId && data.imageId.trim()) || 'blog-default',
        imageUrl: (data.imageUrl && data.imageUrl.trim()) || undefined,
        cloudinaryPublicId: cloudinaryPublicId || undefined,
        readTime: estimatedReadTime,
      };

      // Create blog post using API
      await createBlog(cleanedData);
      
      alert('Blog post created successfully!');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert(`Failed to create blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate read time based on content
  const calculateReadTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200)); // Average 200 words per minute
  };

  const watchedContent = watch('content');
  const estimatedReadTime = calculateReadTime(watchedContent || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
            <p className="text-muted-foreground">
              Create a new blog post or article.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button type="submit" form="blog-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </div>

      {isPreview ? (
        // Preview Mode
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              This is how your blog post will appear to readers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {watch('imageUrl') && (
              <img 
                src={watch('imageUrl')} 
                alt={watch('title')} 
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge>{watch('category')}</Badge>
                {watch('featured') && (
                  <Badge variant="secondary">Featured</Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {estimatedReadTime} min read
                </span>
              </div>
              
              <h1 className="text-4xl font-bold">{watch('title')}</h1>
              <p className="text-xl text-muted-foreground">{watch('excerpt')}</p>
              <p className="text-sm text-muted-foreground">By {watch('author')}</p>
              
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{watch('content')}</div>
              </div>
              
              {watch('tags').filter(tag => tag.trim()).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watch('tags').filter(tag => tag.trim()).map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <form id="blog-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for your blog post.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter blog post title..."
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="Brief description of the blog post (max 300 characters)..."
                  rows={3}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between">
                  {errors.excerpt && (
                    <p className="text-sm text-destructive">{errors.excerpt.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-auto">
                    {watch('excerpt')?.length || 0}/300 characters
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    {...register('author')}
                    placeholder="Author name"
                    disabled={isSubmitting}
                  />
                  {errors.author && (
                    <p className="text-sm text-destructive">{errors.author.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setValue('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Write your blog post content. Estimated read time: {estimatedReadTime} minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Blog Content</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  placeholder="Write your blog post content here..."
                  rows={15}
                  disabled={isSubmitting}
                  className="font-mono"
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Supports Markdown formatting. Word count: {watchedContent?.split(/\s+/).length || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Image Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>
                Upload a featured image for your blog post.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={watch('imageUrl')}
                onChange={(url, publicId) => {
                  setValue('imageUrl', url);
                  if (publicId) {
                    setCloudinaryPublicId(publicId);
                  }
                }}
                onRemove={() => {
                  setValue('imageUrl', '');
                  setCloudinaryPublicId('');
                }}
                disabled={isSubmitting}
                folder="blog"
                label="Blog Featured Image"
                description="Upload a high-quality featured image for your blog post or provide an image URL"
              />
              
              {/* Fallback Image ID */}
              <div className="mt-4 space-y-2">
                <Label htmlFor="imageId">Fallback Image ID (Optional)</Label>
                <Input
                  id="imageId"
                  {...register('imageId')}
                  placeholder="blog-default"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Used as fallback if no image URL is provided
                </p>
                {errors.imageId && (
                  <p className="text-sm text-destructive">{errors.imageId.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>
                    Add tags to help categorize your blog post.
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {tagFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`tags.${index}` as const)}
                    placeholder="Enter tag..."
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeTag(index)}
                    disabled={tagFields.length <= 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {errors.tags && (
                <p className="text-sm text-destructive">{errors.tags.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
              <CardDescription>
                Configure how your blog post will be published.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setValue('status', value as 'draft' | 'published' | 'archived')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
