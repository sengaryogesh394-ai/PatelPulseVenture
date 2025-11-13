import connectDB from './mongodb';
import Product from '@/models/Product';

export async function generateUniqueProductSlug(baseName: string): Promise<string> {
  try {
    await connectDB();

    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const exists = await Product.findOne({ slug: baseSlug });
    if (!exists) return baseSlug;

    let counter = 1;
    let candidate = `${baseSlug}-${counter}`;

    while (counter <= 100) {
      const conflict = await Product.findOne({ slug: candidate });
      if (!conflict) return candidate;
      counter++;
      candidate = `${baseSlug}-${counter}`;
    }

    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
  } catch (err) {
    console.error('Product slug generation error:', err);
    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }
}

export async function generateProductSlugSuggestions(baseName: string, count: number = 5): Promise<string[]> {
  try {
    await connectDB();

    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const suggestions: string[] = [];
    const existing = await Product.find({}, { slug: 1 }).lean();
    const set = new Set(existing.map((p: any) => p.slug));

    if (!set.has(baseSlug)) suggestions.push(baseSlug);

    const variations = [
      `${baseSlug}-pro`,
      `${baseSlug}-plus`,
      `${baseSlug}-premium`,
      `${baseSlug}-bundle`,
      `${baseSlug}-kit`,
      `${baseSlug}-pack`,
      `${baseSlug}-edition`,
      `${baseSlug}-v2`,
    ];
    for (const v of variations) {
      if (!set.has(v) && suggestions.length < count) suggestions.push(v);
    }

    let counter = 1;
    while (suggestions.length < count && counter <= 20) {
      const candidate = `${baseSlug}-${counter}`;
      if (!set.has(candidate)) suggestions.push(candidate);
      counter++;
    }

    return suggestions.slice(0, count);
  } catch (err) {
    console.error('Product slug suggestion error:', err);
    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return [
      `${baseSlug}-1`,
      `${baseSlug}-2`,
      `${baseSlug}-pro`,
      `${baseSlug}-${Date.now().toString().slice(-4)}`,
    ];
  }
}
