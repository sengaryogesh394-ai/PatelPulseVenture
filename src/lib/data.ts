import type { Venture, Innovation, TeamMember } from './types';

export const ventures: Venture[] = [
  {
    id: '1',
    name: 'QuantumLeap',
    description: 'Pioneering next-generation quantum computing solutions for complex problem-solving.',
    imageId: 'venture-1',
    website: '#',
  },
  {
    id: '2',
    name: 'BioSynth',
    description: 'Engineering synthetic biology to revolutionize medicine and sustainable materials.',
    imageId: 'venture-2',
    website: '#',
  },
  {
    id: '3',
    name: 'CogniCore AI',
    description: 'Developing advanced AI platforms for enterprise automation and data analysis.',
    imageId: 'venture-3',
    website: '#',
  },
    {
    id: '4',
    name: 'Helios Energy',
    description: 'Innovating in solar technology to create a sustainable energy future.',
    imageId: 'venture-4',
    website: '#',
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
