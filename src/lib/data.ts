
import type { Service, Innovation, TeamMember, Venture, Testimonial } from './types';

export const services: Service[] = [
  {
    id: '1',
    name: 'Website Development',
    slug: 'website-development',
    description: 'We empower our clients with dynamic, responsive website builds using PHP, Java, .NET, Wordpress, React JS, React Native, Drupal, CMS, and more.',
    imageId: 'venture-1',
    longDescription: 'From simple landing pages to complex web applications, our team builds fast, interactive, and responsive user interfaces that deliver an exceptional user experience across all devices. We stay at the forefront of frontend technologies to ensure your project is modern, scalable, and maintainable.',
    details: [
        {
          title: 'Frontend Development',
          points: [
            'React.js / Next.js Development',
            'HTML5, CSS3, and JavaScript',
            'Tailwind CSS, Chakra UI, Bootstrap',
            'Progressive Web Apps (PWA)',
            'Responsive & Cross-browser Design',
            'Single Page Applications (SPA)',
          ],
        },
        {
          title: 'Backend Development',
          points: [
            'Node.js / Express.js Development',
            'RESTful & GraphQL APIs',
            'Authentication (JWT, OAuth)',
            'Database Design (MongoDB, PostgreSQL, MySQL)',
            'Cloud Functions (AWS Lambda, Vercel, Firebase)',
            'Real-time Systems (Socket.io, WebSockets)',
          ],
        },
        {
          title: 'Full Stack Development',
          points: [
              'MERN / MEAN / Next.js + Node.js Stacks',
              'Admin & Analytics Dashboards',
              'API Integrations (Stripe, Google APIs, Twilio, etc.)',
              'Custom Web Applications',
              'Business Process Automation',
          ]
        },
        {
            title: 'E-Commerce Development',
            points: [
              'Shopify Store Development & Customization',
              'WooCommerce & WordPress E-Commerce',
              'Custom E-Commerce Platforms',
              'Payment Gateway Integration (Razorpay, Stripe, PayPal)',
              'Inventory Management & Order Tracking Systems',
              'Product Dashboard & Analytics',
            ],
          },
          {
            title: 'CRM & ERP Solutions',
            points: [
              'Custom CRM Development',
              'ERP Systems for sales, HR, and inventory',
              'Salesforce / HubSpot Integration',
              'Customer Analytics Dashboards',
              'Workflow & Task Automation',
              'API-based Data Sync with other platforms',
            ],
          },
          {
            title: 'Website Optimization & SEO',
            points: [
              'Technical SEO & Schema Setup',
              'Core Web Vitals Optimization',
              'Lazy Loading & Code Splitting',
              'Image Optimization & CDN Setup',
              'Page Speed Optimization',
            ],
          },
          {
            title: 'Maintenance & Cloud Deployment',
            points: [
              'Continuous Maintenance & Bug Fixes',
              'Version Control (Git, GitHub)',
              'Cloud Deployment (Vercel, AWS, Netlify)',
              'Automated Backups & Monitoring',
              'Ongoing Feature Enhancements',
            ],
          },
          {
            title: 'Custom Business Applications',
            points: [
              'Booking & Scheduling Systems',
              'Analytics & Reporting Dashboards',
              'AI-powered Web Apps (Chatbots, Automation)',
              'Custom Portals for Employees & Clients',
              'Workflow Automation Tools',
            ],
          },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    slug: 'mobile-app-development',
    description: 'We build high-performance Android and iOS apps with seamless user experiences, ensuring innovation and scalability for your business.',
    imageId: 'venture-2',
    longDescription: 'We specialize in creating beautiful, high-performance mobile applications for both iOS and Android. Using modern frameworks like React Native and Flutter, we deliver native-like experiences with a single codebase, reducing development time and cost while ensuring wide-reaching market compatibility.',
    details: [
        {
            title: 'Native & Cross-Platform',
            points: [
                'React Native Development',
                'Flutter Development',
                'Native iOS (Swift) & Android (Kotlin) apps',
                'Push Notifications & In-App Purchases',
                'Offline Support & Synchronization',
            ]
        },
        {
            title: 'App Store Deployment',
            points: [
                'Apple App Store & Google Play Store submission',
                'App Store Optimization (ASO)',
                'Beta testing with TestFlight and Google Play Console',
            ]
        },
        {
            title: 'Mobile Backend Services',
            points: [
                'Secure API development for mobile apps',
                'Firebase and AWS Amplify integration',
                'User authentication and data storage',
            ]
        }
    ]
  },
  {
    id: '3',
    name: 'Digital Marketing Services',
    slug: 'digital-marketing',
    description: 'We craft data-driven digital marketing strategies that boost visibility, engage audiences, and drive scalable growth for your business across all online platforms.',
    imageId: 'venture-3',
    longDescription: 'Our digital marketing services are designed to increase your online presence and drive measurable results. We combine SEO, SEM, and content strategy to attract, engage, and convert your target audience. We believe in a data-driven approach, constantly analyzing and optimizing for the best possible ROI.',
    details: [
        {
            title: 'Search Engine Optimization (SEO)',
            points: [
                'On-Page, Off-Page, and Technical SEO',
                'Keyword Research & Strategy',
                'Content Marketing & Link Building',
                'Local SEO & Google My Business Optimization',
            ]
        },
        {
            title: 'Paid Advertising (SEM/PPC)',
            points: [
                'Google Ads & Microsoft Advertising',
                'Social Media Advertising (Facebook, Instagram, LinkedIn)',
                'Campaign Management & A/B Testing',
                'Landing Page Optimization',
            ]
        },
        {
            title: 'Social Media & Content',
            points: [
                'Content strategy and creation',
                'Social media account management',
                'Email marketing campaigns',
                'Analytics and performance reporting',
            ]
        }
    ]
  },
  {
    id: '4',
    name: 'E-Commerce Solutions',
    slug: 'ecommerce-solutions',
    description: 'We provide powerful online store solutions, from custom builds to Shopify and WooCommerce, to help you sell more effectively online.',
    imageId: 'venture-4',
    longDescription: 'We build powerful e-commerce solutions that drive sales and provide a seamless shopping experience for your customers. Whether you need a custom-built store, a Shopify or WooCommerce implementation, or complex integrations, our team has the expertise to deliver a platform that is scalable, secure, and easy to manage.',
    details: [
        {
            title: 'Platform Expertise',
            points: [
                'Shopify & Shopify Plus Development',
                'WooCommerce Integration',
                'Custom E-commerce Platforms',
                'Headless Commerce with Next.js',
            ]
        },
        {
            title: 'Core Features',
            points: [
                'Payment Gateway Integration (Stripe, PayPal)',
                'Product & Inventory Management Systems',
                'Shopping Cart & Checkout Optimization',
                'Subscription & Recurring Billing Models',
            ]
        },
        {
            title: 'Marketing & Growth',
            points: [
                'E-commerce SEO and SEM',
                'Conversion rate optimization (CRO)',
                'Email marketing automation',
                'Customer loyalty programs',
            ]
        }
    ]
  },
  {
    id: '6',
    name: 'UX & UI Designs',
    slug: 'ux-ui-design',
    description: 'We design and craft intuitive UX and UI experiences — helping businesses turn concepts into visually engaging and user-friendly digital products.',
    imageId: 'venture-2',
    longDescription: 'Good design is good business. Our UI/UX design process focuses on creating beautiful, human-centered interfaces that are a joy to use. From initial research and wireframing to interactive prototypes and final visual design, we ensure your digital product is both aesthetically pleasing and highly functional.',
    details: [
        {
            title: 'Design Process',
            points: [
                'User Interface (UI) Design',
                'User Experience (UX) Research',
                'Wireframing & Interactive Prototyping',
                'Usability Testing & Feedback Analysis',
            ]
        },
        {
            title: 'Tools & Systems',
            points: [
                'Figma & Adobe XD',
                'Design System & Component Library Creation',
                'Branding & Visual Identity Integration',
                'Accessibility (A11y) Optimization',
            ]
        },
        {
            title: 'Strategy & Research',
            points: [
                'User personas and journey mapping',
                'Competitive analysis',
                'Information architecture',
                'User interviews and surveys',
            ]
        }
    ]
  },
  {
    id: '9',
    name: 'Graphic Designing',
    slug: 'graphic-design',
    description: "Our graphic design services create stunning visuals that capture your brand's essence, from logos and branding to marketing materials and web graphics.",
    imageId: 'graphic-design-1',
    longDescription: "Our graphic design services create stunning visuals that capture your brand's essence. From logos and branding to marketing materials and web graphics, we help you communicate your message effectively and make a lasting impression. We believe great design tells a story and builds a strong brand identity.",
    details: [
        {
            title: 'Branding & Identity',
            points: [
                'Logo Design & Brand Guidelines',
                'Business Cards & Stationery',
                'Brand StyleScapes',
                'Visual Identity Systems',
            ]
        },
        {
            title: 'Digital & Print',
            points: [
                'Social Media Graphics & Ad Creatives',
                'Brochures, Flyers, and Posters',
                'Infographics & Data Visualization',
                'Website & App Graphics',
            ]
        },
        {
            title: 'Marketing Materials',
            points: [
                'Presentation design',
                'Packaging design',
                'Email newsletter templates',
                'Trade show booths and banners',
            ]
        }
    ]
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
