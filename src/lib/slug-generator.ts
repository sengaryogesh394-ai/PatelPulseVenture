import connectDB from './mongodb';
import Service from '@/models/Service';

/**
 * Generate a unique slug that doesn't collide with existing services
 */
export async function generateUniqueSlug(baseName: string): Promise<string> {
  try {
    await connectDB();
    
    // Generate base slug from name
    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if base slug is available
    const existingService = await Service.findOne({ slug: baseSlug });
    
    if (!existingService) {
      return baseSlug;
    }
    
    // If base slug exists, try variations with numbers
    let counter = 1;
    let uniqueSlug = `${baseSlug}-${counter}`;
    
    while (counter <= 100) { // Prevent infinite loop
      const conflictingService = await Service.findOne({ slug: uniqueSlug });
      
      if (!conflictingService) {
        return uniqueSlug;
      }
      
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }
    
    // If we can't find a unique slug with numbers, add timestamp
    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
    
  } catch (error) {
    console.error('Error generating unique slug:', error);
    
    // Fallback: generate slug with timestamp
    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
  }
}

/**
 * Generate multiple unique slug suggestions
 */
export async function generateSlugSuggestions(baseName: string, count: number = 5): Promise<string[]> {
  try {
    await connectDB();
    
    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const suggestions: string[] = [];
    const existingSlugs = await Service.find({}, { slug: 1 }).lean();
    const existingSlugSet = new Set(existingSlugs.map(s => s.slug));
    
    // Try base slug first
    if (!existingSlugSet.has(baseSlug)) {
      suggestions.push(baseSlug);
    }
    
    // Generate variations
    const variations = [
      `${baseSlug}-services`,
      `${baseSlug}-solutions`,
      `${baseSlug}-pro`,
      `${baseSlug}-expert`,
      `${baseSlug}-premium`,
      `${baseSlug}-consulting`,
      `${baseSlug}-development`,
      `${baseSlug}-platform`,
      `${baseSlug}-system`,
      `${baseSlug}-tech`
    ];
    
    // Add variations that don't exist
    for (const variation of variations) {
      if (!existingSlugSet.has(variation) && suggestions.length < count) {
        suggestions.push(variation);
      }
    }
    
    // Add numbered variations if needed
    let counter = 1;
    while (suggestions.length < count && counter <= 20) {
      const numberedSlug = `${baseSlug}-${counter}`;
      if (!existingSlugSet.has(numberedSlug)) {
        suggestions.push(numberedSlug);
      }
      counter++;
    }
    
    return suggestions.slice(0, count);
    
  } catch (error) {
    console.error('Error generating slug suggestions:', error);
    
    // Fallback suggestions
    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    return [
      `${baseSlug}-1`,
      `${baseSlug}-2`,
      `${baseSlug}-services`,
      `${baseSlug}-pro`,
      `${baseSlug}-${Date.now().toString().slice(-4)}`
    ];
  }
}
