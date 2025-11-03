
import HeroSection from '@/components/sections/hero-section';
import ServicesSection from '@/components/sections/services-section';
import InnovationSection from '@/components/sections/innovation-section';
import TeamSection from '@/components/sections/team-section';
import ContactSection from '@/components/sections/contact-section';
import TestimonialSection from '@/components/sections/testimonial-section';
import { services, teamMembers, testimonials } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import IntegrationHero from '@/components/sections/integration-hero';

export default function Home() {

  const animatedTeamMembers = teamMembers.map(member => {
    const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
    return {
      name: member.name,
      image: memberImage?.imageUrl || `https://placehold.co/200x200?text=${member.name.charAt(0)}`
    }
  });


  return (
    <>
      <HeroSection />
      <ServicesSection services={services} />
      <IntegrationHero />
      <InnovationSection />
      <TestimonialSection testimonials={testimonials} />
      <TeamSection 
        title="Our commitment to integrity and innovation"
        description="A collective of scientists, investors, and innovators driven by a shared passion for technology."
        members={animatedTeamMembers} 
      />
      <ContactSection />
    </>
  );
}
