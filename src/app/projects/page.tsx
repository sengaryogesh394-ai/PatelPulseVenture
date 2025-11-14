

'use client';

import { useState, useEffect } from 'react';
import { getProjects } from '@/lib/projects-api';
import type { Project } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categories = ['E-Commerce', 'Education', 'LLM (ML/AI)', 'Blockchain (Crypto)', 'Dashboards (CMS)'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectsData = await getProjects();
        // Filter to show only active projects on the public website
        const activeProjects = projectsData.filter(project => 
          (project.status || 'active') === 'active'
        );
        setProjects(activeProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl text-primary mb-4">
              Our Projects
            </h2>
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl text-primary">
            Our Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of our work, showcasing our expertise across various domains.
          </p>
        </div>

        {/* Project Categories */}
        {categories.map((category) => {
          const categoryProjects = projects.filter((p) => p.category === category);
          if (categoryProjects.length === 0) return null;

          return (
            <div key={category} className="mb-16">
              <h3 className="text-2xl font-semibold tracking-tight font-headline mb-8 border-b pb-4">
                {category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProjects.map((project, index) => {
                  // Use uploaded image if available, otherwise fallback to placeholder
                  const projectImage = project.imageUrl 
                    ? { imageUrl: project.imageUrl, imageHint: project.title }
                    : (project.imageId ? PlaceHolderImages.find((p) => p.id === project.imageId) : null);

                  return (
                    <motion.div
                      key={project.id}
                      variants={cardVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="h-full"
                    >
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full group"
                      >
                        <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full cursor-pointer">
                          {/* Image */}
                          {projectImage ? (
                            <div className="aspect-video relative overflow-hidden">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="w-full h-full"
                              >
                                {project.imageUrl ? (
                                  // Use regular img tag for external URLs
                                  <img
                                    src={projectImage.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error('Failed to load image:', projectImage.imageUrl);
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  // Use Next.js Image for local placeholder images
                                  <Image
                                    src={projectImage.imageUrl}
                                    alt={project.title}
                                    data-ai-hint={projectImage.imageHint || project.title}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </motion.div>
                            </div>
                          ) : (
                            // Fallback when no image is available
                            <div className="aspect-video relative overflow-hidden bg-gray-200 flex items-center justify-center">
                              <div className="text-gray-500 text-center">
                                <div className="text-4xl mb-2">📁</div>
                                <p className="text-sm">No Image</p>
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <CardHeader>
                            <CardTitle>{project.title}</CardTitle>
                          </CardHeader>

                          <CardContent className="flex flex-col flex-grow">
                            <p className="text-muted-foreground text-sm flex-grow">
                              {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 my-4">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>

                            <div className="text-sm font-semibold text-primary inline-flex items-center group-hover:translate-x-1 transition-transform">
                              View Project
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
