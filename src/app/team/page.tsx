
import TeamSection from '@/components/sections/team-section';
import { teamMembers } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function TeamPage() {
  const animatedTeamMembers = teamMembers.map(member => {
    const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
    return {
      name: member.name,
      image: memberImage?.imageUrl || `https://placehold.co/200x200?text=${member.name.charAt(0)}`
    }
  });

  return (
    <>
      <TeamSection 
        title="Our commitment to integrity and innovation"
        description="A collective of scientists, investors, and innovators driven by a shared passion for technology."
        members={animatedTeamMembers} 
      />
    </>
  );
}
