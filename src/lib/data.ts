
import type { Service, Innovation, TeamMember, Venture, Testimonial, Project } from './types';

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
            title: 'Cross-Platform Development',
            points: [
                'React Native for iOS and Android',
                'Flutter for high-performance apps',
                'Shared codebase for faster development',
                'Native look and feel with custom components',
                'Access to native device APIs',
            ]
        },
        {
            title: 'Native App Development',
            points: [
                'Swift for robust iOS applications',
                'Kotlin for modern Android applications',
                'Optimized for device-specific performance',
                'Integration with iOS and Android SDKs',
                'Best practices for platform guidelines',
            ]
        },
        {
            title: 'UI/UX Design for Mobile',
            points: [
                'Mobile-first design approach',
                'Interactive prototypes and wireframes',
                'User-centric design for intuitive navigation',
                'App store screenshots and promotional graphics',
                'Adherence to Human Interface and Material Design guidelines',
            ]
        },
        {
            title: 'Backend & API Integration',
            points: [
                'Secure RESTful and GraphQL APIs',
                'Firebase and AWS Amplify integration',
                'Push notifications and real-time data sync',
                'User authentication (OAuth, Biometrics)',
                'Offline data storage and synchronization',
            ]
        },
        {
            title: 'App Store Deployment & ASO',
            points: [
                'Apple App Store & Google Play Store submission',
                'App Store Optimization (ASO) for visibility',
                'Managing beta testing via TestFlight & Google Play Console',
                'Handling app updates and versioning',
                'Privacy policy and compliance management',
            ]
        },
        {
            title: 'Testing & Quality Assurance',
            points: [
                'Unit, integration, and end-to-end testing',
                'Automated testing with Jest and Detox',
                'Performance and battery usage testing',
                'Cross-device and cross-OS compatibility checks',
                'User acceptance testing (UAT)',
            ]
        },
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
                'Comprehensive Website Audits',
                'Keyword Research & Competitive Analysis',
                'On-Page, Off-Page, and Technical SEO',
                'Local SEO & Google Business Profile Management',
                'Content Strategy & Link Building Campaigns',
            ]
        },
        {
            title: 'Paid Advertising (SEM/PPC)',
            points: [
                'Google Ads & Microsoft Advertising',
                'Social Media Ads (Facebook, Instagram, LinkedIn)',
                'Campaign Setup, Management & A/B Testing',
                'Landing Page Design & Optimization',
                'Remarketing and Audience Targeting',
            ]
        },
        {
            title: 'Social Media Marketing',
            points: [
                'Strategy development for various platforms',
                'Content creation, scheduling, and community management',
                'Influencer marketing campaigns',
                'Social listening and brand monitoring',
                'Performance tracking and reporting',
            ]
        },
        {
            title: 'Content Marketing',
            points: [
                'Blog posts, articles, and whitepapers',
                'Infographics and video content',
                'Content calendars and editorial planning',
                'SEO-driven content to attract organic traffic',
                'Content distribution and promotion',
            ]
        },
        {
            title: 'Email Marketing',
            points: [
                'Campaign strategy and automation workflows',
                'Template design and A/B testing',
                'List segmentation and personalization',
                'Performance analytics (open rates, CTR)',
                'Lead nurturing and drip campaigns',
            ]
        },
        {
            title: 'Analytics & Reporting',
            points: [
                'Google Analytics & Tag Manager setup',
                'Custom dashboard creation',
                'Conversion rate optimization (CRO)',
                'Data analysis to identify growth opportunities',
                'Regular performance reports and insights',
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
            title: 'Platform Development',
            points: [
                'Shopify & Shopify Plus Theme Customization',
                'WooCommerce & WordPress Development',
                'Custom E-commerce solutions with Next.js',
                'Headless Commerce architecture',
                'Magento and BigCommerce solutions',
            ]
        },
        {
            title: 'Payment & Shipping Integration',
            points: [
                'Integration with Stripe, PayPal, Razorpay',
                'Support for multiple currencies and payment methods',
                'Shipping provider API integration (FedEx, UPS)',
                'Tax calculation and compliance',
                'Subscription and recurring billing setup',
            ]
        },
        {
            title: 'Inventory & Order Management',
            points: [
                'Custom admin dashboards for products',
                'Real-time inventory tracking',
                'Order processing and fulfillment workflows',
                'Integration with ERP and warehouse systems',
                'Automated notifications and order tracking',
            ]
        },
        {
            title: 'Conversion Rate Optimization (CRO)',
            points: [
                'A/B testing of product pages and checkout flows',
                'Optimizing for mobile and desktop experiences',
                'Abandoned cart recovery strategies',
                'User behavior analysis with heatmaps',
                'Implementing customer reviews and social proof',
            ]
        },
        {
            title: 'E-commerce SEO & Marketing',
            points: [
                'Product schema and rich snippets',
                'Category and product page SEO',
                'Google Shopping and paid ad campaigns',
                'Email marketing automation for e-commerce',
                'Customer loyalty and referral programs',
            ]
        },
        {
            title: 'Security & Performance',
            points: [
                'PCI compliance and secure payment processing',
                'Performance optimization for fast load times',
                'DDoS protection and website security',
                'Regular backups and maintenance',
                'Scalable cloud hosting solutions',
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
            title: 'User Experience (UX) Research',
            points: [
                'User interviews, surveys, and persona creation',
                'Competitor analysis and market research',
                'User journey and workflow mapping',
                'Information architecture design',
                'Usability testing and heuristic evaluation',
            ]
        },
        {
            title: 'User Interface (UI) Design',
            points: [
                'High-fidelity mockups for web and mobile',
                'Visual design, color theory, and typography',
                'Iconography and illustration',
                'Creating a consistent visual language',
                'Dark mode and multi-theme design',
            ]
        },
        {
            title: 'Wireframing & Prototyping',
            points: [
                'Low and high-fidelity wireframes',
                'Interactive prototypes with Figma and Adobe XD',
                'Clickable prototypes for user testing',
                'Demonstrating user flows and interactions',
                'Rapid iteration based on feedback',
            ]
        },
        {
            title: 'Design Systems',
            points: [
                'Creating and maintaining component libraries',
                'Reusable UI components for consistency',
                'Style guides and documentation',
                'Ensuring scalability and design consistency',
                'Collaboration between designers and developers',
            ]
        },
        {
            title: 'Accessibility (A11y)',
            points: [
                'Designing for WCAG compliance',
                'Ensuring color contrast and readability',
                'Keyboard navigation and screen reader support',
                'Accessible forms and interactive elements',
                'Inclusive design for all users',
            ]
        },
        {
            title: 'Branding & Visual Identity',
            points: [
                'Logo design and brand guidelines',
                'Marketing collateral design',
                'Consistent branding across all digital touchpoints',
                'Brand strategy and positioning',
                'Creating a memorable brand experience',
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
                'Logo Design & Visual Identity Systems',
                'Brand Style Guides & Guidelines',
                'Business Cards & Corporate Stationery',
                'Brand Identity Refresh & Redesign',
                'Mission & Vision Statement Development',
            ]
        },
        {
            title: 'Marketing & Advertising',
            points: [
                'Social Media Graphics & Ad Creatives',
                'Brochures, Flyers, and Posters',
                'Infographics & Data Visualization',
                'Presentation & Pitch Deck Design (PPT, Keynote)',
                'Email Newsletter Templates',
            ]
        },
        {
            title: 'Digital Graphics',
            points:
            [
                'Website Banners & Hero Images',
                'Custom Icons and Illustrations',
                'App Store Screenshots',
                'Blog & Article Feature Images',
                'Digital Signage & Billboards',
            ]
        },
        {
            title: 'Print Design',
            points: [
                'Packaging Design',
                'Magazine Layouts & Book Covers',
                'Trade Show Booths & Banners',
                'Restaurant Menus',
                'Annual Reports & Corporate Documents',
            ]
        },
        {
            title: 'Motion Graphics',
            points: [
                'Animated Logos & Intros',
                'Explainer Videos & Product Demos',
                'Social Media Video Ads & Stories',
                'Animated GIFs & Web Banners',
                'Lower Thirds & Video Overlays',
            ]
        },
        {
            title: 'Illustration',
            points: [
                'Custom Illustrations for Web & Print',
                'Character Design & Mascots',
                'Infographic Illustrations',
                'Editorial & Spot Illustrations',
                'Icon Set Design',
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

export const projects: Project[] = [
    {
      id: 'ecom-1',
      title: 'TechPyro',
      description: 'A modern e-commerce platform offering a wide range of tech gadgets and accessories.',
      link: 'https://www.techpyro.com/',
      technologies: ['React', 'Next.js', 'Node.js', 'Stripe'],
      category: 'E-Commerce',
      imageId: 'project-ecom-1',
    },
    {
      id: 'ecom-2',
      title: 'Shopping Cart',
      description: 'A simple and effective shopping cart implementation, showcasing core e-commerce functionalities.',
      link: 'https://shopping-cart-mfs3.vercel.app',
      technologies: ['React', 'Vercel', 'JavaScript'],
      category: 'E-Commerce',
      imageId: 'project-ecom-2',
    },
    {
      id: 'ecom-3',
      title: 'Luxe Threads',
      description: 'An exclusive online boutique for high-end fashion, featuring a curated collection of designer apparel.',
      link: '#',
      technologies: ['Shopify Plus', 'Headless CMS', 'React'],
      category: 'E-Commerce',
      imageId: 'project-ecom-3',
    },
    {
      id: 'edu-1',
      title: 'Eurotech Maritime',
      description: 'A comprehensive educational platform for maritime studies and certifications.',
      link: 'https://eurotechmaritime.org',
      technologies: ['PHP', 'CMS', 'MySQL'],
      category: 'Education',
      imageId: 'project-edu-1',
    },
    {
      id: 'edu-2',
      title: 'iGauge',
      description: 'An intelligent assessment platform for educational institutions.',
      link: 'https://igauge.intellicent.in/',
      technologies: ['Angular', 'Node.js', 'MongoDB'],
      category: 'Education',
      imageId: 'project-edu-2',
    },
    {
      id: 'edu-3',
      title: 'SkillSphere',
      description: 'An online learning platform offering a wide range of courses and certifications in tech and business.',
      link: '#',
      technologies: ['Next.js', 'Firebase', 'Vercel'],
      category: 'Education',
      imageId: 'project-edu-3',
    },
    {
      id: 'llm-1',
      title: 'Stru.ai',
      description: 'An AI-powered platform leveraging Large Language Models for advanced data structuring and analysis.',
      link: 'https://stru.ai',
      technologies: ['Python', 'Genkit', 'Next.js', 'AI/ML'],
      category: 'LLM (ML/AI)',
      imageId: 'project-llm-1',
    },
    {
      id: 'llm-2',
      title: 'LilithAI',
      description: 'A conversational AI assistant focused on providing personalized user experiences.',
      link: 'https://lilithai.tech',
      technologies: ['Genkit', 'React', 'Firebase', 'AI/ML'],
      category: 'LLM (ML/AI)',
      imageId: 'project-llm-2',
    },
    {
      id: 'llm-3',
      title: 'InsightBot',
      description: 'An AI tool that analyzes customer feedback from multiple sources to provide actionable business insights.',
      link: '#',
      technologies: ['Python', 'Flask', 'React', 'AI/ML'],
      category: 'LLM (ML/AI)',
      imageId: 'project-llm-3',
    },
    {
      id: 'crypto-1',
      title: 'Cryptoland',
      description: 'A blockchain-based gaming platform where users can trade and own virtual assets.',
      link: 'https://game.cryptoland.io/',
      technologies: ['Solidity', 'React', 'ethers.js', 'Blockchain'],
      category: 'Blockchain (Crypto)',
      imageId: 'project-crypto-1',
    },
    {
      id: 'crypto-2',
      title: 'NFTStars',
      description: 'A marketplace for discovering, buying, and selling exclusive digital collectibles as NFTs.',
      link: 'https://nftstars.shop/',
      technologies: ['Next.js', 'Solidity', 'IPFS', 'Blockchain'],
      category: 'Blockchain (Crypto)',
      imageId: 'project-crypto-2',
    },
    {
      id: 'crypto-3',
      title: 'DeFi-Wallet',
      description: 'A secure, non-custodial wallet for managing decentralized finance assets across multiple chains.',
      link: '#',
      technologies: ['React Native', 'ethers.js', 'Solidity'],
      category: 'Blockchain (Crypto)',
      imageId: 'project-crypto-3',
    },
    {
      id: 'cms-1',
      title: 'Pinki Dashboard',
      description: 'A custom content management system with a focus on intuitive UI and flexible content modeling.',
      link: 'https://pinki-dashboard.vercel.app',
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
      category: 'Dashboards (CMS)',
      imageId: 'project-cms-1',
    },
     {
      id: 'cms-2',
      title: 'Baxia Admin Panel',
      description: 'A powerful admin panel for managing accounts, users, and application data.',
      link: 'https://baxia-adminpanel.vercel.app/accounts',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Charts'],
      category: 'Dashboards (CMS)',
      imageId: 'project-cms-2',
    },
    {
      id: 'cms-3',
      title: 'DataViz',
      description: 'A real-time analytics dashboard for visualizing complex datasets and business metrics.',
      link: '#',
      technologies: ['React', 'D3.js', 'Node.js', 'WebSocket'],
      category: 'Dashboards (CMS)',
      imageId: 'project-cms-3',
    },
];
