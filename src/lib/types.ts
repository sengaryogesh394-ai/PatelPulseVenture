
export interface Service {
  id: string;
  name: string;
  description: string;
  imageId: string;
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
