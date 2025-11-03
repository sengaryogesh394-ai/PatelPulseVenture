
import ServicesSection from '@/components/sections/services-section';
import { services } from '@/lib/data';

export default function ServicesPage() {
  return (
    <>
      <ServicesSection services={services} />
    </>
  );
}
