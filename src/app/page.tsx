
import HeroSection from '@/components/sections/hero-section';
import BlogPage from '@/components/sections/Blog-page';
import ServicesSection from '@/components/sections/services-section';
import InnovationSection from '@/components/sections/innovation-section';
import TeamSection from '@/components/sections/team-section';
import ContactSection from '@/components/sections/contact-section';
import TestimonialSection from '@/components/sections/testimonial-section';
import { services, teamMembers, testimonials } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import IntegrationHero from '@/components/sections/integration-hero';
import TechStackSection from '@/components/sections/tech-stack-section';
import ApplicationDevelopmentSection from '@/components/sections/application-development-section';

export default function Home() {

  const animatedTeamMembers = teamMembers.map(member => {
    return {
      name: member.name,
      image: member.avatar,
      role: member.role,
      link: member.link,
    }
  });


  return (
    <>
      <HeroSection />
      <ServicesSection services={services.slice(0, 4)} showSeeMore={true} />
      <ApplicationDevelopmentSection />
      <IntegrationHero />
      <InnovationSection />
      <TechStackSection />
      <BlogPage/>

      <TestimonialSection testimonials={testimonials.slice(0, 3)} />
      <TeamSection 
        title="Our commitment to integrity and innovation"
        description="A collective of scientists, investors, and innovators driven by a shared passion for technology."
        members={animatedTeamMembers.slice(0,3)} 
      />
      <ContactSection />
    </>
  );
}
