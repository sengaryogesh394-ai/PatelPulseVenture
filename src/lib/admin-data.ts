import { services, teamMembers, projects, testimonials } from './data';
import type { Service, TeamMember, Project, Testimonial } from './types';

// Blog post type
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  status: 'draft' | 'published' | 'scheduled';
  category: string;
  tags: string[];
  publishedAt: string | null;
  views: number;
  readTime: string;
  createdAt: string;
  updatedAt: string;
}

// Contact inquiry type
export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'responded' | 'archived';
  priority: 'high' | 'medium' | 'low';
  source: string;
  submittedAt: string;
  tags: string[];
}

// Admin data management class
export class AdminDataManager {
  private static instance: AdminDataManager;
  
  private constructor() {}
  
  static getInstance(): AdminDataManager {
    if (!AdminDataManager.instance) {
      AdminDataManager.instance = new AdminDataManager();
    }
    return AdminDataManager.instance;
  }

  // Services management
  getServices(): Service[] {
    const stored = localStorage.getItem('admin_services');
    return stored ? JSON.parse(stored) : services;
  }

  saveServices(services: Service[]): void {
    localStorage.setItem('admin_services', JSON.stringify(services));
  }

  addService(service: Omit<Service, 'id'>): Service {
    const services = this.getServices();
    const newService: Service = {
      ...service,
      id: Date.now().toString()
    };
    services.push(newService);
    this.saveServices(services);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const services = this.getServices();
    const index = services.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    services[index] = { ...services[index], ...updates };
    this.saveServices(services);
    return services[index];
  }

  deleteService(id: string): boolean {
    const services = this.getServices();
    const filtered = services.filter(s => s.id !== id);
    if (filtered.length === services.length) return false;
    
    this.saveServices(filtered);
    return true;
  }

  // Projects management
  getProjects(): Project[] {
    const stored = localStorage.getItem('admin_projects');
    return stored ? JSON.parse(stored) : projects;
  }

  saveProjects(projects: Project[]): void {
    localStorage.setItem('admin_projects', JSON.stringify(projects));
  }

  addProject(project: Omit<Project, 'id'>): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...project,
      id: Date.now().toString()
    };
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    projects[index] = { ...projects[index], ...updates };
    this.saveProjects(projects);
    return projects[index];
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length === projects.length) return false;
    
    this.saveProjects(filtered);
    return true;
  }

  // Team management
  getTeamMembers(): TeamMember[] {
    const stored = localStorage.getItem('admin_team');
    return stored ? JSON.parse(stored) : teamMembers;
  }

  saveTeamMembers(members: TeamMember[]): void {
    localStorage.setItem('admin_team', JSON.stringify(members));
  }

  addTeamMember(member: Omit<TeamMember, 'id'>): TeamMember {
    const members = this.getTeamMembers();
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString()
    };
    members.push(newMember);
    this.saveTeamMembers(members);
    return newMember;
  }

  updateTeamMember(id: string, updates: Partial<TeamMember>): TeamMember | null {
    const members = this.getTeamMembers();
    const index = members.findIndex(m => m.id === id);
    if (index === -1) return null;
    
    members[index] = { ...members[index], ...updates };
    this.saveTeamMembers(members);
    return members[index];
  }

  deleteTeamMember(id: string): boolean {
    const members = this.getTeamMembers();
    const filtered = members.filter(m => m.id !== id);
    if (filtered.length === members.length) return false;
    
    this.saveTeamMembers(filtered);
    return true;
  }

  // Blog management
  getBlogPosts(): BlogPost[] {
    const stored = localStorage.getItem('admin_blogs');
    if (stored) return JSON.parse(stored);
    
    // Default blog posts
    const defaultBlogs: BlogPost[] = [
      {
        id: '1',
        title: 'The Future of AI in Web Development',
        slug: 'future-ai-web-development',
        excerpt: 'Exploring how artificial intelligence is revolutionizing the way we build websites and web applications.',
        content: 'Full blog content here...',
        author: 'Adarsh Deep Sachan',
        status: 'published',
        category: 'Technology',
        tags: ['AI', 'Web Development', 'Future Tech'],
        publishedAt: '2024-11-10T00:00:00Z',
        views: 1250,
        readTime: '5 min read',
        createdAt: '2024-11-09T00:00:00Z',
        updatedAt: '2024-11-10T00:00:00Z'
      }
    ];
    
    this.saveBlogPosts(defaultBlogs);
    return defaultBlogs;
  }

  saveBlogPosts(posts: BlogPost[]): void {
    localStorage.setItem('admin_blogs', JSON.stringify(posts));
  }

  addBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
    const posts = this.getBlogPosts();
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    posts.push(newPost);
    this.saveBlogPosts(posts);
    return newPost;
  }

  updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const posts = this.getBlogPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    posts[index] = { 
      ...posts[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.saveBlogPosts(posts);
    return posts[index];
  }

  deleteBlogPost(id: string): boolean {
    const posts = this.getBlogPosts();
    const filtered = posts.filter(p => p.id !== id);
    if (filtered.length === posts.length) return false;
    
    this.saveBlogPosts(filtered);
    return true;
  }

  // Contact management
  getContactInquiries(): ContactInquiry[] {
    const stored = localStorage.getItem('admin_contacts');
    if (stored) return JSON.parse(stored);
    
    // Default contact inquiries
    const defaultContacts: ContactInquiry[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Innovations Inc.',
        subject: 'Website Development Inquiry',
        message: 'Hi, I\'m interested in your web development services for our startup.',
        status: 'new',
        priority: 'high',
        source: 'contact-form',
        submittedAt: new Date().toISOString(),
        tags: ['web-development', 'startup']
      }
    ];
    
    this.saveContactInquiries(defaultContacts);
    return defaultContacts;
  }

  saveContactInquiries(inquiries: ContactInquiry[]): void {
    localStorage.setItem('admin_contacts', JSON.stringify(inquiries));
  }

  addContactInquiry(inquiry: Omit<ContactInquiry, 'id'>): ContactInquiry {
    const inquiries = this.getContactInquiries();
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: Date.now().toString()
    };
    inquiries.push(newInquiry);
    this.saveContactInquiries(inquiries);
    return newInquiry;
  }

  updateContactInquiry(id: string, updates: Partial<ContactInquiry>): ContactInquiry | null {
    const inquiries = this.getContactInquiries();
    const index = inquiries.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    inquiries[index] = { ...inquiries[index], ...updates };
    this.saveContactInquiries(inquiries);
    return inquiries[index];
  }

  deleteContactInquiry(id: string): boolean {
    const inquiries = this.getContactInquiries();
    const filtered = inquiries.filter(i => i.id !== id);
    if (filtered.length === inquiries.length) return false;
    
    this.saveContactInquiries(filtered);
    return true;
  }

  // Export all data
  exportAllData(): string {
    const data = {
      services: this.getServices(),
      projects: this.getProjects(),
      teamMembers: this.getTeamMembers(),
      blogPosts: this.getBlogPosts(),
      contactInquiries: this.getContactInquiries(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.services) this.saveServices(data.services);
      if (data.projects) this.saveProjects(data.projects);
      if (data.teamMembers) this.saveTeamMembers(data.teamMembers);
      if (data.blogPosts) this.saveBlogPosts(data.blogPosts);
      if (data.contactInquiries) this.saveContactInquiries(data.contactInquiries);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData(): void {
    localStorage.removeItem('admin_services');
    localStorage.removeItem('admin_projects');
    localStorage.removeItem('admin_team');
    localStorage.removeItem('admin_blogs');
    localStorage.removeItem('admin_contacts');
  }
}

// Export singleton instance
export const adminData = AdminDataManager.getInstance();
