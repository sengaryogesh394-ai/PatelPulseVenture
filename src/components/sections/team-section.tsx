
'use client';
import type { TeamMember } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

export default function TeamSection({ teamMembers }: TeamSectionProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section 
      id="team" 
      className="py-20 sm:py-28 bg-secondary"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Our Team</h2>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            A collective of scientists, investors, and innovators driven by a shared passion for technology.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => {
            const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
            return (
              <motion.div
                key={member.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="text-center h-full flex flex-col items-center p-6 transition-shadow duration-300 hover:shadow-xl">
                  {memberImage && (
                    <Avatar className="w-32 h-32 mb-4 border-4 border-background shadow-md">
                      <AvatarImage src={memberImage.imageUrl} alt={member.name} data-ai-hint={memberImage.imageHint} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <CardHeader className="p-0">
                    <CardTitle className="font-headline">{member.name}</CardTitle>
                    <CardDescription className="text-primary">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <p className="text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
