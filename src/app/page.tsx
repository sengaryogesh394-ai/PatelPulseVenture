
'use client';

import { useState, useEffect } from 'react';
import { getServices } from '@/lib/services-api';
import type { Service } from '@/lib/types';
import HeroSection from '@/components/sections/hero-section';
import BlogPage from '@/components/sections/Blog-page';
import ServicesSection from '@/components/sections/services-section';
import InnovationSection from '@/components/sections/innovation-section';
import TeamSection from '@/components/sections/team-section';
import ContactSection from '@/components/sections/contact-section';
import TestimonialSection from '@/components/sections/testimonial-section';
import { teamMembers, testimonials } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import IntegrationHero from '@/components/sections/integration-hero';
import TechStackSection from '@/components/sections/tech-stack-section';
import ApplicationDevelopmentSection from '@/components/sections/application-development-section';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getServices();
        // Filter to show only active services
        const activeServices = servicesData.filter(service => 
          (service.status || 'active') === 'active'
        );
        setServices(activeServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to empty array if API fails
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

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
      {!servicesLoading && (
        <ServicesSection services={services.slice(0, 4)} showSeeMore={true} />
      )}
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
