
'use client';

import { projects } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';

export default function ProjectsPage() {
  const categories = ['E-Commerce', 'Education', 'LLM (ML/AI)', 'Blockchain (Crypto)', 'Dashboards (CMS)'];

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl text-primary">
            Our Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of our work, showcasing our expertise across various domains.
          </p>
        </div>

        {categories.map((category) => {
          const categoryProjects = projects.filter((p) => p.category === category);
          if (categoryProjects.length === 0) return null;

          return (
            <div key={category} className="mb-16">
              <h3 className="text-2xl font-semibold tracking-tight font-headline mb-8 border-b pb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProjects.map((project, index) => {
                  const projectImage = PlaceHolderImages.find(p => p.id === project.imageId);
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
                      <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full">
                        {projectImage && (
                          <div className="aspect-video relative">
                              <Image
                                  src={projectImage.imageUrl}
                                  alt={project.title}
                                  data-ai-hint={projectImage.imageHint}
                                  fill
                                  className="object-cover"
                              />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle>{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-grow">
                          <p className="text-muted-foreground text-sm flex-grow">{project.description}</p>
                          <div className="flex flex-wrap gap-2 my-4">
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary">{tech}</Badge>
                            ))}
                          </div>
                          <Link href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary inline-flex items-center group mt-auto">
                            View Project
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </CardContent>
                      </Card>
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
