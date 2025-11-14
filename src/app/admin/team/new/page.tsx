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
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { createTeamMember } from '@/lib/team-api';
import ImageUpload from '@/components/ui/image-upload';

// Form validation schema
const teamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  bio: z.string().min(1, 'Bio is required'),
  imageId: z.string().optional(),
  imageUrl: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
  }).optional(),
  order: z.number().min(0).optional(),
}).refine((data) => {
  // Allow either imageId or imageUrl, but at least one should be provided
  const hasImageId = data.imageId && data.imageId.trim() !== '';
  const hasImageUrl = data.imageUrl && data.imageUrl.trim() !== '';
  return hasImageId || hasImageUrl;
}, {
  message: "Either Image ID or Image URL is required",
  path: ["imageId"],
});

type TeamFormData = z.infer<typeof teamSchema>;

export default function NewTeamMember() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      position: '',
      bio: '',
      imageId: '',
      imageUrl: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        github: '',
        email: '',
      },
      order: 0,
    },
  });

  const onSubmit = async (data: TeamFormData) => {
    try {
      setIsSubmitting(true);
      
      // Clean up data
      const cleanedData = {
        ...data,
        imageId: (data.imageId && data.imageId.trim()) || 'team-default',
        imageUrl: (data.imageUrl && data.imageUrl.trim()) || undefined,
        cloudinaryPublicId: cloudinaryPublicId || undefined,
        socialLinks: {
          linkedin: data.socialLinks?.linkedin?.trim() || undefined,
          twitter: data.socialLinks?.twitter?.trim() || undefined,
          github: data.socialLinks?.github?.trim() || undefined,
          email: data.socialLinks?.email?.trim() || undefined,
        },
        order: data.order || 0,
      };

      // Create team member using API
      await createTeamMember(cleanedData);
      
      alert('Team member created successfully!');
      router.push('/admin/team');
    } catch (error) {
      console.error('Error creating team member:', error);
      alert(`Failed to create team member: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/team">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add Team Member</h1>
            <p className="text-muted-foreground">
              Create a new team member profile.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="submit" form="team-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Creating...' : 'Create Team Member'}
          </Button>
        </div>
      </div>

      <form id="team-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for the team member.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  {...register('position')}
                  placeholder="Software Engineer"
                />
                {errors.position && (
                  <p className="text-sm text-destructive">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Brief description about the team member..."
                rows={3}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                {...register('order', { valueAsNumber: true })}
                placeholder="0"
                min="0"
              />
              {errors.order && (
                <p className="text-sm text-destructive">{errors.order.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Image Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Image Settings</CardTitle>
            <CardDescription>
              Upload an image or provide a URL for the team member photo.
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
              folder="team-members"
              label="Team Member Photo"
              description="Upload a high-quality photo of the team member or provide an image URL"
            />
            
            {/* Fallback Image ID */}
            <div className="mt-4 space-y-2">
              <Label htmlFor="imageId">Fallback Image ID (Optional)</Label>
              <Input
                id="imageId"
                {...register('imageId')}
                placeholder="team-default"
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

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Add social media links for the team member (all optional).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  {...register('socialLinks.linkedin')}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  {...register('socialLinks.twitter')}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  {...register('socialLinks.github')}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('socialLinks.email')}
                  placeholder="john@example.com"
                />
                {errors.socialLinks?.email && (
                  <p className="text-sm text-destructive">{errors.socialLinks.email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
