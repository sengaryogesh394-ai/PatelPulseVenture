
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
    id: '6',
    name: 'UX & UI Designs',
    description: 'We design and craft intuitive UX and UI experiences — helping businesses turn concepts into visually engaging and user-friendly digital products.',
    imageId: 'venture-2'
  },
  {
    id: '9',
    name: 'Graphic Designing',
    description: 'Our graphic design services create stunning visuals that capture your brand\'s essence, from logos and branding to marketing materials and web graphics.',
    imageId: 'graphic-design-1',
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

export const teamMembers = [
    {
        id: '1',
        name: 'Aadarsh',
        role: 'Founder',
        avatar: 'https://alt.tailus.io/images/team/member-one.webp',
        link: '#',
    },
    {
        id: '2',
        name: 'Elijah Jones',
        role: 'Co-Founder - CTO',
        avatar: 'https://alt.tailus.io/images/team/member-two.webp',
        link: '#',
    },
    {
        id: '3',
        name: 'Isabella Garcia',
        role: 'Sales Manager',
        avatar: 'https://alt.tailus.io/images/team/member-three.webp',
        link: '#',
    },
    {
        id: '4',
        name: 'Henry Lee',
        role: 'UX Engeneer',
        avatar: 'https://alt.tailus.io/images/team/member-four.webp',
        link: '#',
    },
    {
        id: '5',
        name: 'Ava Williams',
        role: 'Interaction Designer',
        avatar: 'https://alt.tailus.io/images/team/member-five.webp',
        link: '#',
    },
    {
        id: '6',
        name: 'Olivia Miller',
        role: 'Visual Designer',
        avatar: 'https://alt.tailus.io/images/team/member-six.webp',
        link: '#',
    },
]


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
    quote:
      "This platform revolutionized our data analysis process. The speed and accuracy are unparalleled. A must-have for any data-driven team.",
    name: "Aarav Singh",
    role: "Data Scientist at QuantumLeap",
    imageId: "testimonial-1",
  },
  {
    id: '2',
    quote:
      "The user interface is incredibly intuitive, which made the onboarding process for my team a breeze. We were up and running in hours, not days.",
    name: "Ananya Gupta",
    role: "Head of Operations at Synergy Corp",
    imageId: "testimonial-2",
  },
  {
    id: '3',
    quote:
      "Customer support is top-notch. They are responsive, knowledgeable, and genuinely invested in our success. It feels like a true partnership.",
    name: "Rohan Mehta",
    role: "Client Success Manager at Horizon",
    imageId: "testimonial-3",
  },
    {
    id: '4',
    quote:
      "I'm impressed by the constant stream of updates and new features. The development team is clearly passionate and listens to user feedback.",
    name: "Diya Patel",
    role: "Software Engineer at CodeCrafters",
    imageId: "testimonial-4",
  },
  {
    id: '5',
    quote:
      "The ROI was almost immediate. It streamlined our workflows so effectively that we cut project delivery times by nearly 30%.",
    name: "Vikram Rao",
    role: "CFO at Apex Financial",
    imageId: "testimonial-5",
  },
];
