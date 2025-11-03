
import type { Service, Innovation, TeamMember, Venture, Testimonial } from './types';

export const services: Service[] = [
  {
    id: '1',
    name: 'Website Development',
    description: 'We empower our clients with dynamic, responsive website builds using PHP, Java, .NET, Wordpress, React JS, React Native, Drupal, CMS, and more — ensuring seamless performance, scalability, and user engagement.',
    imageId: 'venture-1',
  },
  {
    id: '2',
    name: 'Mobile app Development',
    description: 'We build high-performance Android and iOS apps with seamless user experiences, ensuring innovation and scalability for your business.',
    imageId: 'venture-2',
  },
  {
    id: '3',
    name: 'Digital Marketing Services',
    description: 'We craft data-driven digital marketing strategies that boost visibility, engage audiences, and drive scalable growth for your business across all online platforms.',
    imageId: 'venture-3',
  },
  {
    id: '4',
    name: 'Software Development',
    description: 'We build high-performance Android and iOS apps with seamless user experiences, ensuring innovation and scalability for your business.',
    imageId: 'venture-4',
  },
  {
    id: '5',
    name: 'IOT DEVELOPMENT',
    description: 'We design and develop innovative IoT solutions — connecting devices, platforms, and applications to help businesses transform ideas into smart, data-driven digital experiences',
    imageId: 'iot-1',
  },
  {
    id: '6',
    name: 'UX & UI Designs',
    description: 'We design and craft intuitive UX and UI experiences — helping businesses turn concepts into visually engaging and user-friendly digital products.',
    imageId: 'venture-2'
  },
   {
    id: '7',
    name: 'Cloud & DevOps',
    description: 'We build high-performance Android and iOS apps with seamless user experiences, ensuring innovation and scalability for your business.',
    imageId: 'venture-3'
  },
  {
    id: '8',
    name: 'SEO/SEM',
    description: 'Boost your website’s visibility with our SEO services. We optimize your site for higher rankings, increased traffic, and better conversions.',
    imageId: 'venture-1'
  }
];

export const innovations: Innovation[] = [
  {
    id: '1',
    title: 'Decentralized Ledger Technology',
    description: 'Exploring novel applications of blockchain for secure, transparent, and efficient data management across industries.',
    imageId: 'innovation-1',
  },
  {
    id: '2',
    title: 'AI-Driven Drug Discovery',
    description: 'Utilizing machine learning models to accelerate the identification and development of new pharmaceuticals.',
    imageId: 'innovation-2',
  },
  {
    id: '3',
    title: 'Next-Gen IoT Security',
    description: 'Building robust security protocols for the Internet of Things to protect against emerging cyber threats.',
    imageId: 'innovation-3',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Evelyn Reed',
    role: 'Founder &amp; Chief Scientist',
    bio: 'With a Ph.D. in Quantum Physics, Evelyn leads our deep-tech initiatives, turning theoretical science into tangible innovations.',
    imageId: 'team-1',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Managing Partner',
    bio: 'An experienced venture capitalist with a keen eye for disruptive technologies and a passion for mentoring startups.',
    imageId: 'team-2',
  },
  {
    id: '3',
    name: 'Aria Sharma',
    role: 'Head of Innovation',
    bio: 'Aria bridges the gap between creative ideas and market-ready products, fostering a culture of experimentation and growth.',
    imageId: 'team-3',
  },
];

export const ventures: Venture[] = [
    {
    id: '1',
    name: 'QuantumLeap',
    description: 'A quantum computing startup poised to revolutionize data encryption and solve complex computational problems.',
    imageId: 'venture-1'
    },
    {
    id: '2',
    name: 'SynthoBio',
    description: 'Engineering synthetic organisms for sustainable manufacturing and next-generation pharmaceuticals.',
    imageId: 'venture-2'
    },
    {
    id: '3',
    name: 'CogniSphere',
    description: 'An AI platform that provides deep insights into consumer behavior and market trends through advanced data analysis.',
    imageId: 'venture-3'
    },
    {
    id: '4',
    name: 'HelioDrive',
    description: 'Developing next-generation perovskite solar cells to make clean energy more accessible and efficient.',
    imageId: 'venture-4'
    }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'Working with this team has been a transformative experience. Their expertise in deep tech and market strategy is unparalleled. They turned our raw concept into a market-leading product.',
    name: 'John Doe',
    role: 'CEO, QuantumLeap',
    imageId: 'testimonial-1',
  },
  {
    id: '2',
    quote: 'The insights and support we received were instrumental in our growth. Their hands-on approach and commitment to innovation are what set them apart.',
    name: 'Jane Smith',
    role: 'Founder, SynthoBio',
    imageId: 'testimonial-2',
  },
  {
    id: '3',
    quote: 'A truly visionary partner. They understood our technology at a fundamental level and helped us navigate the complex landscape of venture capital. We couldn’t have done it without them.',
    name: 'Samuel Lee',
    role: 'CTO, CogniSphere',
    imageId: 'testimonial-3',
  },
];
