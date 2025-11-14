'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2,
  Eye,
  X,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createProject } from '@/lib/projects-api';
import ImageUpload from '@/components/ui/image-upload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url('Must be a valid URL').or(z.literal('#')),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  category: z.string().min(1, 'Category is required'),
  imageId: z.string().optional(),
  imageUrl: z.string().optional(),
}).refine((data) => {
  // Allow either imageId or imageUrl, but at least one should be provided
  const hasImageId = data.imageId && data.imageId.trim() !== '';
  const hasImageUrl = data.imageUrl && data.imageUrl.trim() !== '';
  return hasImageId || hasImageUrl;
}, {
  message: "Either Image ID or Image URL is required",
  path: ["imageId"],
});

type ProjectFormData = z.infer<typeof projectSchema>;

const categories = [
  'E-Commerce',
  'Education', 
  'LLM (ML/AI)',
  'Blockchain (Crypto)',
  'Dashboards (CMS)'
];

export default function NewProject() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string>('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      link: '#',
      technologies: [''],
      category: '',
      imageId: 'project-1',
      imageUrl: '',
    }
  });

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control,
    name: 'technologies'
  });

  const addTechnology = () => {
    appendTech('');
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // Filter out empty technologies
      const cleanedData = {
        ...data,
        technologies: data.technologies.filter(tech => tech.trim() !== ''),
        category: data.category as 'E-Commerce' | 'Education' | 'LLM (ML/AI)' | 'Blockchain (Crypto)' | 'Dashboards (CMS)',
        // Clean up imageId and imageUrl
        imageId: (data.imageId && data.imageId.trim()) || 'project-default',
        imageUrl: (data.imageUrl && data.imageUrl.trim()) || undefined,
        cloudinaryPublicId: cloudinaryPublicId || undefined,
        status: 'active' as const
      };

      console.log('Creating project with cleaned data:', cleanedData);
      console.log('ImageURL being sent:', cleanedData.imageUrl);
      
      // Create project using API
      await createProject(cleanedData);
      
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  if (isPreview) {
    const formData = watch();
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setIsPreview(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Project Preview</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{formData.title}</CardTitle>
                <CardDescription className="mt-2">{formData.description}</CardDescription>
              </div>
              <Badge>{formData.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Technologies Used:</h3>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.filter(tech => tech.trim()).map((tech, index) => (
                  <Badge key={index} variant="outline">{tech}</Badge>
                ))}
              </div>
            </div>
            
            {formData.imageUrl && (
              <div>
                <h3 className="text-sm font-medium mb-2">Project Image:</h3>
                <img 
                  src={formData.imageUrl} 
                  alt={formData.title} 
                  className="w-full max-w-md h-48 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-2">Project Link:</h3>
              <p className="text-sm text-muted-foreground">
                {formData.link === '#' ? 'Coming Soon' : formData.link}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
            <p className="text-muted-foreground">
              Create a new project for your portfolio.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button form="project-form" type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </div>

      <form id="project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>
              Enter the basic details for your project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., E-commerce Platform"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Brief description of the project..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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

              <div className="space-y-2">
                <Label htmlFor="link">Project Link</Label>
                <Input
                  id="link"
                  {...register('link')}
                  placeholder="https://example.com or # for coming soon"
                />
                {errors.link && (
                  <p className="text-sm text-destructive">{errors.link.message}</p>
                )}
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Technologies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Technologies Used</CardTitle>
                <CardDescription>
                  Add the technologies and tools used in this project.
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addTechnology} className="shrink-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Technology
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {techFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`technologies.${index}`)}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="flex-1"
                />
                {techFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTech(index)}
                    className="text-destructive hover:text-destructive shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {errors.technologies && (
              <p className="text-sm text-destructive">{errors.technologies.message}</p>
            )}
            
            {/* Add more space below */}
            <div className="h-4"></div>
          </CardContent>
        </Card>

        {/* Project Image */}
        <Card>
          <CardHeader>
            <CardTitle>Project Image</CardTitle>
            <CardDescription>
              Upload a project image or provide a URL for the project showcase.
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
              folder="projects"
              label="Project Image"
              description="Upload a high-quality image showcasing your project or provide an image URL"
            />
            
            {/* Fallback Image ID */}
            <div className="mt-4 space-y-2">
              <Label htmlFor="imageId">Fallback Image ID (Optional)</Label>
              <Input
                id="imageId"
                {...register('imageId')}
                placeholder="project-default"
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
      </form>
    </div>
  );
}
