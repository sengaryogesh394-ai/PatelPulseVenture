import type { TeamMember } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FadeIn } from '../fade-in';

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

export default function TeamSection({ teamMembers }: TeamSectionProps) {
  return (
    <section id="team" className="py-20 sm:py-28 bg-secondary">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Our Team</h2>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            A collective of scientists, investors, and innovators driven by a shared passion for technology.
          </p>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => {
            const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
            return (
              <FadeIn key={member.id} delay={index * 150}>
                <Card className="text-center h-full flex flex-col items-center p-6">
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
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
