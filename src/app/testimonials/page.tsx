
import TestimonialSection from '@/components/sections/testimonial-section';
import { testimonials } from '@/lib/data';

export default function TestimonialsPage() {
  return (
    <>
      <TestimonialSection testimonials={testimonials} />
    </>
  );
}
