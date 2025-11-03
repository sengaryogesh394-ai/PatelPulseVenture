import HeroSection from '@/components/sections/hero-section';
import VenturesSection from '@/components/sections/ventures-section';
import InnovationSection from '@/components/sections/innovation-section';
import TeamSection from '@/components/sections/team-section';
import ContactSection from '@/components/sections/contact-section';
import { ventures, innovations, teamMembers } from '@/lib/data';

export default function Home() {
  return (
    <>
      <HeroSection />
      <VenturesSection ventures={ventures} />
      <InnovationSection innovations={innovations} />
      <TeamSection teamMembers={teamMembers} />
      <ContactSection />
    </>
  );
}
