
import HeroSection from '@/components/sections/hero-section';
import ServicesSection from '@/components/sections/ventures-section';
import InnovationSection from '@/components/sections/innovation-section';
import TeamSection from '@/components/sections/team-section';
import ContactSection from '@/components/sections/contact-section';
import TestimonialSection from '@/components/sections/testimonial-section';
import { services, innovations, teamMembers, testimonials } from '@/lib/data';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection services={services} />
      <InnovationSection innovations={innovations} />
      <TestimonialSection testimonials={testimonials} />
      <TeamSection teamMembers={teamMembers} />
      <ContactSection />
    </>
  );
}
