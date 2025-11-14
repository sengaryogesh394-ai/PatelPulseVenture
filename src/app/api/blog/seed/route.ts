import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

// POST /api/blog/seed - Seed database with sample blog posts
export async function POST() {
  try {
    await connectDB();
    
    const seedBlogs = [
      {
        id: 'blog-1',
        title: 'The Future of Web Development: Trends to Watch in 2024',
        slug: 'future-web-development-trends-2024',
        excerpt: 'Explore the cutting-edge technologies and methodologies that are shaping the future of web development, from AI integration to advanced frameworks.',
        content: `
# The Future of Web Development: Trends to Watch in 2024

The web development landscape is evolving at an unprecedented pace. As we move through 2024, several key trends are emerging that will define how we build and interact with web applications.

## AI-Powered Development

Artificial Intelligence is revolutionizing how developers write code. From GitHub Copilot to ChatGPT, AI assistants are becoming indispensable tools in the developer's toolkit. These tools help with:

- Code generation and completion
- Bug detection and fixing
- Documentation writing
- Test case generation

## Next.js and React Evolution

The React ecosystem continues to mature with exciting developments:

- **Server Components**: Enabling better performance and SEO
- **App Router**: Simplified routing with improved developer experience
- **Streaming**: Better user experience with progressive loading

## The Rise of Edge Computing

Edge computing is bringing computation closer to users, resulting in:

- Reduced latency
- Improved performance
- Better user experience globally
- Cost optimization

## Conclusion

The future of web development is bright, with technologies that prioritize performance, developer experience, and user satisfaction. Stay curious and keep learning!
        `,
        author: 'Adarsh Deep Sachan',
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop',
        tags: ['Web Development', 'AI', 'React', 'Next.js', 'Technology'],
        category: 'Technology',
        status: 'published',
        featured: true,
        publishedAt: new Date('2024-01-15'),
        readTime: 8,
      },
      {
        id: 'blog-2',
        title: 'Building Scalable Applications with Microservices Architecture',
        slug: 'building-scalable-microservices-architecture',
        excerpt: 'Learn how to design and implement microservices architecture for building robust, scalable applications that can handle enterprise-level demands.',
        content: `
# Building Scalable Applications with Microservices Architecture

Microservices architecture has become the gold standard for building large-scale applications. This approach offers numerous benefits over monolithic architectures.

## What are Microservices?

Microservices are small, independent services that communicate over well-defined APIs. Each service is:

- Independently deployable
- Loosely coupled
- Organized around business capabilities
- Owned by a small team

## Benefits of Microservices

### Scalability
Each service can be scaled independently based on demand.

### Technology Diversity
Different services can use different technologies and programming languages.

### Fault Isolation
If one service fails, it doesn't bring down the entire system.

## Implementation Strategies

1. **Start Small**: Begin with a monolith and gradually extract services
2. **Define Clear Boundaries**: Use Domain-Driven Design principles
3. **Implement Proper Monitoring**: Use tools like Prometheus and Grafana
4. **Ensure Data Consistency**: Implement eventual consistency patterns

## Challenges to Consider

- Increased complexity
- Network latency
- Data consistency
- Testing complexity

## Conclusion

Microservices architecture is powerful but comes with trade-offs. Carefully evaluate your needs before making the transition.
        `,
        author: 'Anand Patel',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop',
        tags: ['Architecture', 'Microservices', 'Scalability', 'Backend'],
        category: 'Architecture',
        status: 'published',
        featured: false,
        publishedAt: new Date('2024-02-01'),
        readTime: 12,
      },
      {
        id: 'blog-3',
        title: 'UX Design Principles for Modern Web Applications',
        slug: 'ux-design-principles-modern-web-apps',
        excerpt: 'Discover essential UX design principles that create intuitive, engaging, and accessible web applications that users love to interact with.',
        content: `
# UX Design Principles for Modern Web Applications

Great user experience is what separates good applications from exceptional ones. Here are the fundamental principles every developer and designer should know.

## Core UX Principles

### 1. User-Centered Design
Always put the user at the center of your design decisions:
- Understand user needs and goals
- Create user personas and journey maps
- Test with real users regularly

### 2. Simplicity and Clarity
Keep interfaces clean and intuitive:
- Remove unnecessary elements
- Use clear, concise language
- Maintain visual hierarchy

### 3. Consistency
Maintain consistency across your application:
- Use consistent design patterns
- Standardize interactions
- Create a design system

## Accessibility Matters

Making your application accessible benefits everyone:
- Use semantic HTML
- Provide alt text for images
- Ensure proper color contrast
- Support keyboard navigation

## Mobile-First Approach

Design for mobile devices first:
- Touch-friendly interface elements
- Responsive layouts
- Fast loading times
- Offline functionality

## Performance is UX

Fast applications provide better user experience:
- Optimize images and assets
- Minimize HTTP requests
- Use lazy loading
- Implement caching strategies

## Conclusion

Great UX design is an ongoing process of understanding users, iterating on designs, and continuously improving the experience.
        `,
        author: 'Yogesh Sengar',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop',
        tags: ['UX Design', 'UI', 'Accessibility', 'Mobile', 'Design'],
        category: 'Design',
        status: 'published',
        featured: true,
        publishedAt: new Date('2024-02-10'),
        readTime: 10,
      },
      {
        id: 'blog-4',
        title: 'DevOps Best Practices for Continuous Deployment',
        slug: 'devops-best-practices-continuous-deployment',
        excerpt: 'Master the essential DevOps practices that enable reliable, automated deployments and improve your development workflow efficiency.',
        content: `
# DevOps Best Practices for Continuous Deployment

DevOps practices are essential for modern software development. Here's how to implement effective continuous deployment pipelines.

## CI/CD Pipeline Essentials

### Continuous Integration
- Automate testing on every commit
- Maintain a single source repository
- Keep builds fast and reliable

### Continuous Deployment
- Automate deployment processes
- Use feature flags for safe releases
- Implement rollback strategies

## Infrastructure as Code

Manage infrastructure through code:
- Use tools like Terraform or CloudFormation
- Version control infrastructure changes
- Automate provisioning and scaling

## Monitoring and Observability

Implement comprehensive monitoring:
- Application performance monitoring
- Log aggregation and analysis
- Error tracking and alerting
- Business metrics tracking

## Security Integration

Security should be built into the pipeline:
- Automated security scanning
- Dependency vulnerability checks
- Secrets management
- Access control and auditing

## Best Practices

1. **Start Small**: Begin with simple automation
2. **Measure Everything**: Use metrics to drive decisions
3. **Fail Fast**: Catch issues early in the pipeline
4. **Collaborate**: Break down silos between teams

## Tools and Technologies

Popular DevOps tools include:
- **CI/CD**: Jenkins, GitHub Actions, GitLab CI
- **Containerization**: Docker, Kubernetes
- **Monitoring**: Prometheus, Grafana, ELK Stack
- **Infrastructure**: Terraform, Ansible

## Conclusion

Effective DevOps practices lead to faster, more reliable software delivery and improved team collaboration.
        `,
        author: 'Anand Patel',
        imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=800&fit=crop',
        tags: ['DevOps', 'CI/CD', 'Automation', 'Infrastructure', 'Deployment'],
        category: 'DevOps',
        status: 'draft',
        featured: false,
        publishedAt: undefined,
        readTime: 15,
      },
      {
        id: 'blog-5',
        title: 'Modern JavaScript Frameworks: A Comprehensive Comparison',
        slug: 'modern-javascript-frameworks-comparison',
        excerpt: 'Compare the latest JavaScript frameworks including React, Vue, Angular, and Svelte to choose the best one for your next project.',
        content: `
# Modern JavaScript Frameworks: A Comprehensive Comparison

The JavaScript ecosystem is rich with powerful frameworks, each offering unique advantages. Let's explore the most popular options available today.

## React: The Industry Standard

React continues to dominate the frontend landscape with its:

- **Virtual DOM**: Efficient rendering and performance
- **Component-based architecture**: Reusable and maintainable code
- **Rich ecosystem**: Extensive library and tool support
- **Strong community**: Active development and support

## Vue.js: The Progressive Framework

Vue offers a gentle learning curve with:

- **Template syntax**: Familiar HTML-like templates
- **Reactive data binding**: Automatic UI updates
- **Composition API**: Flexible component logic
- **Excellent documentation**: Clear and comprehensive guides

## Angular: The Full-Featured Platform

Angular provides enterprise-ready features:

- **TypeScript by default**: Strong typing and better tooling
- **Dependency injection**: Scalable architecture patterns
- **CLI tooling**: Powerful development workflow
- **Built-in features**: Routing, forms, HTTP client

## Svelte: The Compile-Time Framework

Svelte offers innovative approaches:

- **No virtual DOM**: Direct DOM manipulation
- **Smaller bundle sizes**: Optimized output
- **Simple syntax**: Less boilerplate code
- **Great performance**: Fast runtime execution

## Choosing the Right Framework

Consider these factors:

1. **Team expertise**: Current skill set and learning curve
2. **Project requirements**: Performance, features, scalability
3. **Ecosystem needs**: Available libraries and tools
4. **Long-term maintenance**: Community support and updates

## Conclusion

Each framework has its strengths. React for versatility, Vue for simplicity, Angular for enterprise, and Svelte for performance.
        `,
        author: 'Yogesh Sengar',
        imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop',
        tags: ['JavaScript', 'React', 'Vue', 'Angular', 'Svelte', 'Frontend'],
        category: 'Technology',
        status: 'published',
        featured: false,
        publishedAt: new Date('2024-02-15'),
        readTime: 12,
      },
      {
        id: 'blog-6',
        title: 'Database Design Best Practices for Modern Applications',
        slug: 'database-design-best-practices-modern-apps',
        excerpt: 'Learn essential database design principles, normalization techniques, and performance optimization strategies for building robust applications.',
        content: `
# Database Design Best Practices for Modern Applications

Proper database design is crucial for application performance, scalability, and maintainability. Here are the essential principles every developer should know.

## Fundamental Design Principles

### 1. Understand Your Data

Before designing tables:
- Identify entities and relationships
- Understand data access patterns
- Consider future growth and changes
- Document business rules and constraints

### 2. Normalization vs. Denormalization

**Normalization benefits:**
- Reduces data redundancy
- Ensures data consistency
- Simplifies data maintenance
- Saves storage space

**When to denormalize:**
- Performance-critical read operations
- Data warehouse scenarios
- Caching layers
- Reporting databases

## Schema Design Strategies

### Choose Appropriate Data Types

- Use the smallest data type that fits your needs
- Be consistent with naming conventions
- Consider future requirements
- Use constraints to enforce data integrity

### Index Optimization

Strategic indexing improves query performance:
- Index frequently queried columns
- Consider composite indexes for multi-column queries
- Monitor index usage and remove unused indexes
- Balance read vs. write performance

## Performance Considerations

### Query Optimization

- Use EXPLAIN plans to analyze queries
- Avoid SELECT * in production code
- Use appropriate JOIN types
- Consider query caching strategies

### Scalability Planning

- Design for horizontal scaling
- Consider partitioning strategies
- Plan for read replicas
- Implement proper connection pooling

## Security Best Practices

- Use parameterized queries to prevent SQL injection
- Implement proper access controls
- Encrypt sensitive data
- Regular security audits and updates

## Modern Database Trends

### NoSQL Integration

- Document databases for flexible schemas
- Key-value stores for caching
- Graph databases for relationship-heavy data
- Time-series databases for analytics

### Cloud-Native Approaches

- Managed database services
- Auto-scaling capabilities
- Built-in backup and recovery
- Global distribution options

## Conclusion

Good database design is an investment in your application's future. Take time to plan, document, and optimize your database schema for long-term success.
        `,
        author: 'Anand Patel',
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=630&fit=crop',
        tags: ['Database', 'SQL', 'NoSQL', 'Performance', 'Architecture', 'Backend'],
        category: 'Architecture',
        status: 'published',
        featured: true,
        publishedAt: new Date('2024-02-20'),
        readTime: 14,
      },
    ];

    console.log('Seeding blog posts...');
    
    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('Cleared existing blog posts');
    
    // Insert new blogs
    const insertedBlogs = await Blog.insertMany(seedBlogs);
    console.log(`Inserted ${insertedBlogs.length} blog posts`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedBlogs.length} blog posts`,
      data: insertedBlogs,
    });
    
  } catch (error: any) {
    console.error('Error seeding blog posts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/seed - Reset/clear all blog posts
export async function DELETE() {
  try {
    await connectDB();
    
    const result = await Blog.deleteMany({});
    console.log(`Deleted ${result.deletedCount} blog posts`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} blog posts`,
      deletedCount: result.deletedCount,
    });
    
  } catch (error: any) {
    console.error('Error resetting blog posts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
