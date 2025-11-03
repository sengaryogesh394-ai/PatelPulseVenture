import HeroSection from '@/components/sections/hero-section';
import ServicesSection from '@/components/sections/services-section';
import InnovationSection from '@/components/sections/innovation-section';
import TeamSection from '@/components/sections/team-section';
import ContactSection from '@/components/sections/contact-section';
import { services, innovations, teamMembers } from '@/lib/data';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection services={services} />
      <InnovationSection innovations={innovations} />
      <TeamSection teamMembers={teamMembers} />
      <ContactSection />
    </>
  );
}
