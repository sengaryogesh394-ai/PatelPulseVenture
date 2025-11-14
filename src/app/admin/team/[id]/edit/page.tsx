'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getTeamMember, updateTeamMember } from '@/lib/team-api';
import { Team } from '@/lib/types';
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

export default function EditTeamMember({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamMember, setTeamMember] = useState<Team | null>(null);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string>('');
  
  // Unwrap the async params
  const resolvedParams = use(params);
  const teamId = resolvedParams.id;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
  });

  // Load team member data
  useEffect(() => {
    const loadTeamMember = async () => {
      try {
        setLoading(true);
        const teamData = await getTeamMember(teamId);
        setTeamMember(teamData);
        
        // Set cloudinary public ID if available
        if (teamData.cloudinaryPublicId) {
          setCloudinaryPublicId(teamData.cloudinaryPublicId);
        }
        
        // Reset form with team data
        const formData = {
          name: teamData.name,
          position: teamData.position,
          bio: teamData.bio,
          imageId: teamData.imageId || '',
          imageUrl: teamData.imageUrl || '',
          socialLinks: {
            linkedin: teamData.socialLinks?.linkedin || '',
            twitter: teamData.socialLinks?.twitter || '',
            github: teamData.socialLinks?.github || '',
            email: teamData.socialLinks?.email || '',
          },
          order: teamData.order || 0,
        };
        
        reset(formData);
      } catch (error) {
        console.error('Error loading team member:', error);
        alert('Failed to load team member data');
        router.push('/admin/team');
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      loadTeamMember();
    }
  }, [teamId, reset, router]);

  const onSubmit = async (data: TeamFormData) => {
    try {
      setIsSubmitting(true);
      
      // Clean up data
      const cleanedData = {
        ...data,
        imageId: (data.imageId && data.imageId.trim()) || 'team-default',
        imageUrl: (data.imageUrl && data.imageUrl.trim()) || undefined,
        cloudinaryPublicId: cloudinaryPublicId || teamMember?.cloudinaryPublicId || undefined,
        socialLinks: {
          linkedin: data.socialLinks?.linkedin?.trim() || undefined,
          twitter: data.socialLinks?.twitter?.trim() || undefined,
          github: data.socialLinks?.github?.trim() || undefined,
          email: data.socialLinks?.email?.trim() || undefined,
        },
        order: data.order || 0,
      };

      // Update team member using API
      await updateTeamMember(teamId, cleanedData);
      
      alert('Team member updated successfully!');
      router.push('/admin/team');
    } catch (error) {
      console.error('Error updating team member:', error);
      alert(`Failed to update team member: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading team member...</span>
        </div>
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Team member not found</h2>
          <p className="text-muted-foreground mt-2">The team member you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/team">Back to Team</Link>
          </Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Edit Team Member</h1>
            <p className="text-muted-foreground">
              Update the details for "{teamMember.name}".
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form id="team-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic details for the team member.
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
              Upload a new image or update the URL for the team member photo.
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
              description="Upload a new photo or update the image URL for the team member"
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
              Update social media links for the team member (all optional).
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
