import type { Service, Innovation, TeamMember } from './types';

export const services: Service[] = [
  {
    id: '1',
    name: 'Venture Capital',
    description: 'Providing strategic investment and mentorship to early-stage technology startups with high growth potential.',
    imageId: 'venture-1',
  },
  {
    id: '2',
    name: 'Technology Incubation',
    description: 'Nurturing innovative ideas from concept to market-ready products through our in-house incubation program.',
    imageId: 'venture-2',
  },
  {
    id: '3',
    name: 'AI & ML Solutions',
    description: 'Developing custom artificial intelligence and machine learning solutions to solve complex business challenges.',
    imageId: 'venture-3',
  },
  {
    id: '4',
    name: 'Strategic Advisory',
    description: 'Offering expert guidance on technology strategy, market entry, and digital transformation for established enterprises.',
    imageId: 'venture-4',
  },
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
