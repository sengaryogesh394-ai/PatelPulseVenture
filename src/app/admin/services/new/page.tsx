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
  Sparkles,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createService } from '@/lib/services-api';
import ImageUpload from '@/components/ui/image-upload';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  imageUrl: z.string().optional(),
  details: z.array(z.object({
    title: z.string().min(1, 'Detail title is required'),
    points: z.array(z.string().min(1, 'Point cannot be empty'))
  })).min(1, 'At least one detail section is required')
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function NewService() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string>('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      longDescription: '',
      imageId: 'venture-1',
      details: [
        {
          title: '',
          points: ['']
        }
      ]
    }
  });

  const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
    control,
    name: 'details'
  });

  const watchedName = watch('name');

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const generateUniqueSlug = async (serviceName: string) => {
    if (!serviceName.trim()) return;
    
    try {
      setIsGeneratingSlug(true);
      
      const response = await fetch('/api/services/slug-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceName: serviceName.trim(), count: 5 }),
      });

      const result = await response.json();

      if (result.success) {
        // Set the primary unique slug
        setValue('slug', result.data.primarySlug);
        // Store suggestions for user to choose from
        setSlugSuggestions(result.data.suggestions);
      }
    } catch (error) {
      console.error('Error generating unique slug:', error);
      // Fallback to basic slug generation
      const basicSlug = serviceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', `${basicSlug}-${Date.now().toString().slice(-4)}`);
    } finally {
      setIsGeneratingSlug(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    
    // Clear errors when user starts typing
    if (submitError) setSubmitError(null);
    if (generationError) setGenerationError(null);
    
    // Show preview of what slug might look like (for user reference only)
    if (name.trim().length > 2) {
      const previewSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', `${previewSlug} (preview - will be made unique)`);
    } else {
      setValue('slug', '');
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear errors when user modifies slug
    if (submitError) setSubmitError(null);
  };

  const addDetailSection = () => {
    appendDetail({
      title: '',
      points: ['']
    });
  };

  const addPointToDetail = (detailIndex: number) => {
    const currentPoints = watch(`details.${detailIndex}.points`);
    setValue(`details.${detailIndex}.points`, [...currentPoints, '']);
  };

  const removePointFromDetail = (detailIndex: number, pointIndex: number) => {
    const currentPoints = watch(`details.${detailIndex}.points`);
    const newPoints = currentPoints.filter((_, index) => index !== pointIndex);
    setValue(`details.${detailIndex}.points`, newPoints);
  };

  const generateWithAI = async () => {
    const serviceName = watch('name');
    
    if (!serviceName || serviceName.trim().length === 0) {
      alert('Please enter a service name first');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError(null);

      const response = await fetch('/api/services/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceName: serviceName.trim() }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate service details');
      }

      const generatedData = result.data;

      // Populate the form with AI-generated data
      setValue('name', generatedData.name);
      setValue('slug', generatedData.slug);
      setValue('description', generatedData.description);
      setValue('longDescription', generatedData.longDescription);
      setValue('imageId', generatedData.imageId);
      setValue('details', generatedData.details);

      // Show success message
      if (result.source === 'fallback') {
        alert(`Service details generated with template! ${result.warning || ''}`);
      } else {
        alert(`Service details generated successfully with AI! Generated ${generatedData.details.length} sections.`);
      }

    } catch (error) {
      console.error('AI generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate service details';
      setGenerationError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(null);
      
      console.log('Submitting service data:', data);
      
      // Let backend generate unique slug, don't send frontend slug
      const { slug, ...serviceDataWithoutSlug } = data;
      const serviceData = {
        ...serviceDataWithoutSlug,
        cloudinaryPublicId: cloudinaryPublicId || undefined
      };
      
      // Create service via API
      const createdService = await createService(serviceData);
      console.log('Service created successfully:', createdService);
      
      // Show success message
      setSubmitSuccess(`Service "${data.name}" created successfully with slug "${createdService.slug}"! Redirecting...`);
      
      // Redirect to services list after a short delay
      setTimeout(() => {
        router.push('/admin/services');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating service:', error);
      
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.message.includes('name') && error.message.includes('already exists')) {
          setSubmitError(`A service with the name "${data.name}" already exists. Please choose a different service name.`);
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          setSubmitError('Network error. Please check your connection and try again.');
        } else {
          setSubmitError(`Failed to create service: ${error.message}`);
        }
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <h1 className="text-3xl font-bold tracking-tight">Service Preview</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{formData.name}</CardTitle>
            <CardDescription>{formData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Long Description</h3>
              <p className="text-muted-foreground">{formData.longDescription}</p>
            </div>

            {formData.details.map((detail, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{detail.title}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {detail.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="text-muted-foreground">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
            <Link href="/admin/services">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
            <p className="text-muted-foreground">
              Create a new service offering for your website.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={generateWithAI}
            disabled={isGenerating || isSubmitting}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setIsPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button form="service-form" type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Service'}
          </Button>
        </div>
      </div>

      {/* AI Generation Info */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">AI-Powered Service Generation</h3>
              <p className="text-sm text-purple-700 mb-2">
                Enter a service name and click "Generate with AI" to automatically create comprehensive service details with 6-8 sections.
              </p>
              <p className="text-xs text-purple-600">
                ✨ Powered by Google Gemini AI • Generates professional descriptions, slug, and detailed sections
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {submitSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Success!</h3>
                <p className="text-sm text-green-700">{submitSuccess}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Error Display */}
      {submitError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error Creating Service</h3>
                <p className="text-sm text-red-700 mb-2">{submitError}</p>
                <div className="text-xs text-red-600">
                  <p><strong>Suggestions:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Try a different service name</li>
                    <li>Modify the slug to make it unique</li>
                    <li>Check if a similar service already exists</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Error Display */}
      {generationError && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">AI Generation Error</h3>
                <p className="text-sm text-orange-700">{generationError}</p>
                <p className="text-xs text-orange-600 mt-1">You can still fill out the form manually.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for your service.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  onChange={(e) => {
                    register('name').onChange(e);
                    handleNameChange(e);
                  }}
                  placeholder="e.g., Website Development"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="relative">
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="Auto-generated unique slug will appear here"
                    readOnly
                    className="bg-gray-50"
                    value={watch('slug') || 'Will be generated automatically...'}
                  />
                  {isGeneratingSlug && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  <p>🚀 <strong>Backend will generate a unique slug automatically</strong></p>
                  <p>• No conflicts guaranteed</p>
                  <p>• SEO-friendly format</p>
                  <p>• Professional naming conventions</p>
                </div>
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
                <p className="text-sm text-destructive">{errors.description.message}</p>
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
                <p className="text-sm text-destructive">{errors.longDescription.message}</p>
              )}
            </div>
            <div className="space-y-4">
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
                folder="services"
                label="Service Image"
                description="Upload a high-quality image showcasing your service or provide an image URL"
              />
              
              {/* Fallback Image ID */}
              <div className="space-y-2">
                <Label htmlFor="imageId">Fallback Image ID</Label>
                <Input
                  id="imageId"
                  {...register('imageId')}
                  placeholder="service-default"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Used as fallback if no image URL is provided
                </p>
                {errors.imageId && (
                  <p className="text-sm text-destructive">{errors.imageId.message}</p>
                )}
              </div>
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
                  Add detailed sections with bullet points for your service.
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addDetailSection}>
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {detailFields.map((field, detailIndex) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Section {detailIndex + 1}</Badge>
                  {detailFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDetail(detailIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    {...register(`details.${detailIndex}.title`)}
                    placeholder="e.g., Frontend Development"
                  />
                  {errors.details?.[detailIndex]?.title && (
                    <p className="text-sm text-destructive">
                      {errors.details[detailIndex]?.title?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Points</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addPointToDetail(detailIndex)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Point
                    </Button>
                  </div>
                  
                  {watch(`details.${detailIndex}.points`).map((_, pointIndex) => (
                    <div key={pointIndex} className="flex gap-2">
                      <Input
                        {...register(`details.${detailIndex}.points.${pointIndex}`)}
                        placeholder="Enter a service point..."
                        className="flex-1"
                      />
                      {watch(`details.${detailIndex}.points`).length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePointFromDetail(detailIndex, pointIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
