'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getService, updateService } from '@/lib/services-api';
import type { Service } from '@/lib/types';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).optional(),
  details: z.array(z.object({
    title: z.string().min(1, 'Detail title is required'),
    points: z.array(z.string().min(1, 'Point cannot be empty'))
  }))
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function EditService() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      longDescription: '',
      imageId: '',
      imageUrl: '',
      status: 'active',
      details: []
    }
  });

  const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
    control,
    name: 'details'
  });

  // Load service data
  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const service = await getService(serviceId);
        
        // Reset form with service data
        reset({
          name: service.name,
          slug: service.slug,
          description: service.description,
          longDescription: service.longDescription,
          imageId: service.imageId,
          imageUrl: service.imageUrl || '',
          status: service.status || 'active',
          details: service.details || []
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load service');
        console.error('Error loading service:', err);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      loadService();
    }
  }, [serviceId, reset]);

  const addPointToDetail = (detailIndex: number) => {
    const currentPoints = watch(`details.${detailIndex}.points`);
    setValue(`details.${detailIndex}.points`, [...currentPoints, '']);
  };

  const removePointFromDetail = (detailIndex: number, pointIndex: number) => {
    const currentPoints = watch(`details.${detailIndex}.points`);
    const newPoints = currentPoints.filter((_, index) => index !== pointIndex);
    setValue(`details.${detailIndex}.points`, newPoints);
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      // Update service via API
      await updateService(serviceId, data);
      
      // Redirect to services list
      router.push('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
      setError(error instanceof Error ? error.message : 'Failed to update service');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-muted-foreground">Loading service...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/services">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading service:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/services">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Service</h1>
            <p className="text-muted-foreground">Update service information and details</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button 
            form="service-form" 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Service
              </>
            )}
          </Button>
        </div>
      </div>

      <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Management */}
        <Card>
          <CardHeader>
            <CardTitle>Service Image</CardTitle>
            <CardDescription>
              Manage the service image and visual representation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageId">Image ID</Label>
                  <Input
                    id="imageId"
                    {...register('imageId')}
                    placeholder="e.g., service-1, venture-2"
                  />
                  {errors.imageId && (
                    <p className="text-sm text-red-600">{errors.imageId.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Reference ID for placeholder images in the system
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Custom Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    {...register('imageUrl')}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Override placeholder with custom image URL
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Image Preview</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {watch('imageUrl') ? (
                    <div className="space-y-2">
                      <img
                        src={watch('imageUrl')}
                        alt="Service preview"
                        className="max-w-full h-32 object-cover rounded-lg mx-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="text-sm text-green-600">Custom image loaded</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        <Eye className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {watch('imageId') 
                          ? `Using placeholder: ${watch('imageId')}`
                          : 'No image selected'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic details of your service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Website Development"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="e.g., website-development"
                />
                {errors.slug && (
                  <p className="text-sm text-red-600">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  {...register('status')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Brief description of the service..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea
                id="longDescription"
                {...register('longDescription')}
                placeholder="Detailed description of the service..."
                rows={4}
              />
              {errors.longDescription && (
                <p className="text-sm text-red-600">{errors.longDescription.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Service Details</CardTitle>
                <CardDescription>
                  Add detailed sections about your service offerings
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => appendDetail({ title: '', points: [''] })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Detail Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {detailFields.map((field, detailIndex) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`details.${detailIndex}.title`}>Section Title</Label>
                    <Input
                      {...register(`details.${detailIndex}.title`)}
                      placeholder="e.g., Frontend Development"
                    />
                    {errors.details?.[detailIndex]?.title && (
                      <p className="text-sm text-red-600">
                        {errors.details[detailIndex]?.title?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDetail(detailIndex)}
                    className="ml-4 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Points</Label>
                  {watch(`details.${detailIndex}.points`).map((_, pointIndex) => (
                    <div key={pointIndex} className="flex items-center gap-2">
                      <Input
                        {...register(`details.${detailIndex}.points.${pointIndex}`)}
                        placeholder="Enter a point..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePointFromDetail(detailIndex, pointIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addPointToDetail(detailIndex)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Point
                  </Button>
                </div>
              </div>
            ))}

            {detailFields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No detail sections added yet.</p>
                <p className="text-sm">Click "Add Detail Section" to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
