
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageId: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
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
  _id?: string;
  id: string;
  title: string;
  description: string;
  link: string;
  technologies: string[];
  category: 'E-Commerce' | 'Education' | 'LLM (ML/AI)' | 'Blockchain (Crypto)' | 'Dashboards (CMS)';
  imageId?: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  _id?: string;
  id: string;
  name: string;
  position: string;
  bio: string;
  imageId?: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
  status: 'active' | 'inactive';
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Blog {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  imageId?: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt?: Date;
  readTime: number;
  createdAt?: Date;
  updatedAt?: Date;
}
