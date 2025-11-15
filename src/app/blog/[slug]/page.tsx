import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getBlog(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/blog/${slug}`, {
      cache: 'no-store',
      // Fallback to relative during client-side navigation
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.success) return null;
    return json.data as {
      title: string;
      excerpt: string;
      content: string;
      author: string;
      imageUrl?: string;
      slug: string;
      publishedAt?: string;
      readTime?: number;
    };
  } catch {
    // Try relative fetch if absolute failed
    try {
      const res = await fetch(`/api/blog/${slug}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const json = await res.json();
      if (!json?.success) return null;
      return json.data;
    } catch {
      return null;
    }
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return notFound();

  const mdToHtml = (md: string) => {
    let s = md || '';
    s = s.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
    s = s.replace(/^######\s?(.*)$/gim, '<h6>$1</h6>')
         .replace(/^#####\s?(.*)$/gim, '<h5>$1</h5>')
         .replace(/^####\s?(.*)$/gim, '<h4>$1</h4>')
         .replace(/^###\s?(.*)$/gim, '<h3>$1</h3>')
         .replace(/^##\s?(.*)$/gim, '<h2>$1</h2>')
         .replace(/^#\s?(.*)$/gim, '<h1>$1</h1>');
    s = s.replace(/^>\s?(.*)$/gim, '<blockquote>$1</blockquote>');
    s = s.replace(/^\s*[-*+]\s+(.*)$/gim, '<li>$1</li>');
    s = s.replace(/(<li>.*<\/li>)(?![\s\S]*<li>)/gim, '<ul>$1</ul>');
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, '<em>$1</em>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />');
    s = s.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    s = s.replace(/\n{2,}/g, '</p><p>');
    s = `<p>${s}</p>`;
    return s;
  };

  return (
    <main className="min-h-screen">
      {blog.imageUrl ? (
        <div className="relative h-64 md:h-96 w-full overflow-hidden">
          <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
      ) : null}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <article className="rounded-2xl bg-card border border-border p-6 md:p-10 shadow-sm">
          <header className="mb-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{blog.title}</h1>
            <p className="text-muted-foreground md:text-lg">{blog.excerpt}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <span className="px-2 py-1 rounded-md bg-muted">By {blog.author}</span>
              {blog.readTime ? <span className="px-2 py-1 rounded-md bg-muted">{blog.readTime} min read</span> : null}
              {blog.publishedAt ? <span className="px-2 py-1 rounded-md bg-muted">{new Date(blog.publishedAt).toLocaleDateString()}</span> : null}
            </div>
          </header>

          <section
            className="prose prose-neutral dark:prose-invert prose-headings:font-semibold max-w-none"
            dangerouslySetInnerHTML={{ __html: mdToHtml(blog.content) }}
          />
        </article>
      </div>
    </main>
  );
}
