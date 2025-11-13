import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateUniqueSlug } from './slug-generator';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export interface GeneratedServiceData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  imageId: string;
  details: {
    title: string;
    points: string[];
  }[];
}

export async function generateServiceWithAI(serviceName: string): Promise<GeneratedServiceData> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Generate comprehensive service details for a technology service called "${serviceName}".

Please provide a JSON response with the following structure:
{
  "name": "${serviceName}",
  "slug": "url-friendly-slug",
  "description": "Brief 1-2 sentence description (max 150 characters)",
  "longDescription": "Detailed 2-3 sentence description explaining the service value proposition",
  "imageId": "service-related-id",
  "details": [
    {
      "title": "Section Title",
      "points": [
        "Specific service point 1",
        "Specific service point 2",
        "Specific service point 3",
        "Specific service point 4",
        "Specific service point 5",
        "Specific service point 6"
      ]
    }
  ]
}

Requirements:
- Generate 6-8 detail sections
- Each section should have 5-6 specific, actionable points
- Focus on modern technology services and business solutions
- Make descriptions professional and comprehensive
- Use industry-standard terminology
- Include relevant technologies, frameworks, and methodologies
- Make the slug URL-friendly (lowercase, hyphens)
- Keep descriptions concise but informative
- Focus on practical business value and technical expertise

Categories to consider for detail sections:
- Core Development/Implementation
- Technology Stack & Frameworks
- Security & Performance
- Integration & APIs
- Testing & Quality Assurance
- Deployment & Maintenance
- Analytics & Monitoring
- Optimization & Scaling

Return only valid JSON, no additional text or formatting.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const generatedData = JSON.parse(cleanedText);
      
      // Validate the structure
      if (!generatedData.name || !generatedData.slug || !generatedData.description || 
          !generatedData.longDescription || !Array.isArray(generatedData.details)) {
        throw new Error('Invalid response structure from AI');
      }

      // Ensure we have 6-8 sections
      if (generatedData.details.length < 6) {
        throw new Error('AI generated insufficient detail sections');
      }

      // Generate unique slug to avoid conflicts
      const uniqueSlug = await generateUniqueSlug(generatedData.name);
      generatedData.slug = uniqueSlug;

      return generatedData;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', text);
      throw new Error('Failed to parse AI response. Please try again.');
    }

  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error(`Failed to generate service details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Fallback function for when AI fails
export async function generateFallbackService(serviceName: string): Promise<GeneratedServiceData> {
  const uniqueSlug = await generateUniqueSlug(serviceName);

  return {
    name: serviceName,
    slug: uniqueSlug,
    description: `Professional ${serviceName.toLowerCase()} services tailored to your business needs.`,
    longDescription: `We provide comprehensive ${serviceName.toLowerCase()} solutions that drive results and deliver exceptional value. Our expert team combines industry best practices with cutting-edge technology to ensure your project's success.`,
    imageId: `service-${Math.floor(Math.random() * 10) + 1}`,
    details: [
      {
        title: 'Core Implementation',
        points: [
          'Requirements analysis and planning',
          'Custom solution development',
          'Industry best practices implementation',
          'Quality assurance and testing',
          'Performance optimization',
          'Documentation and training'
        ]
      },
      {
        title: 'Technology & Integration',
        points: [
          'Modern technology stack selection',
          'Third-party service integration',
          'API development and management',
          'Database design and optimization',
          'Cloud infrastructure setup',
          'Security implementation'
        ]
      },
      {
        title: 'Project Management',
        points: [
          'Agile development methodology',
          'Regular progress updates',
          'Milestone-based delivery',
          'Risk assessment and mitigation',
          'Timeline and budget management',
          'Stakeholder communication'
        ]
      },
      {
        title: 'Support & Maintenance',
        points: [
          'Ongoing technical support',
          'Regular updates and patches',
          'Performance monitoring',
          'Backup and recovery solutions',
          'Scalability planning',
          'Long-term partnership'
        ]
      },
      {
        title: 'Quality Assurance',
        points: [
          'Comprehensive testing protocols',
          'User acceptance testing',
          'Performance benchmarking',
          'Security auditing',
          'Code review processes',
          'Continuous improvement'
        ]
      },
      {
        title: 'Delivery & Deployment',
        points: [
          'Staged deployment process',
          'Production environment setup',
          'Go-live support and monitoring',
          'User training and documentation',
          'Post-launch optimization',
          'Success metrics tracking'
        ]
      }
    ]
  };
}
