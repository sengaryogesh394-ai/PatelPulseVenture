
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageId: string;
  imageUrl?: string;
  longDescription: string;
  details: {
    title: string;
    points: string[];
  }[];
  status?: 'active' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageId: string;
  imageUrl?: string;
  longDescription: string;
  details: {
    title: string;
    points: string[];
  }[];
  status?: 'active' | 'inactive';
}

export interface Innovation {
  id: string;
  title: string;
  description: string;
  imageId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  link: string;
}

export interface Venture {
  id: string;
  name: string;
  description: string;
  imageId: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  imageId: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    link: string;
    technologies: string[];
    category: 'E-Commerce' | 'Education' | 'LLM (ML/AI)' | 'Blockchain (Crypto)' | 'Dashboards (CMS)';
    imageId: string;
}
