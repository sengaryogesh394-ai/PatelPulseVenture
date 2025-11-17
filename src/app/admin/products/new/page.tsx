'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  PlusCircle,
  Upload,
  X,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { generateProductImages } from '@/lib/gemini';

interface MediaItem {
  id: string;
  url: string;
  hint: string;
  type: 'image' | 'video';
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  value: string;
}

function NewProductPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const company = (searchParams.get('company') || 'ppv').toLowerCase() as 'ppv' | 'digiworldadda';
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    status: 'active',
    stock: '999',
    isFeatured: false,
    tags: '',
    downloadLink: '',
  });

  const [promotion, setPromotion] = useState({
    enabled: false,
    discountPercentage: 0,
    timerDuration: 24
  });

  const [promotionalHeader, setPromotionalHeader] = useState({
    enabled: false,
    topBannerText: '',
    topBannerSubtext: '',
    buttonText: '',
    buttonPrice: '',
    buttonSubtext: '',
    headlinePart1: '',
    headlinePart2: '',
    subHeading: '',
    platformText: '',
    highlightText: '',
    timerDuration: 24
  });

  const [productBenefits, setProductBenefits] = useState({
    enabled: false,
    mainTitle: '',
    subtitle: '',
    benefits: [] as Array<{ icon: string; title: string; description: string }>
  });

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [mediaInput, setMediaInput] = useState({ url: '', hint: '', type: 'image' as 'image' | 'video' });

  // AI Generation Functions
  const generateWithAI = async () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please enter product name and select category first",
        variant: "destructive"
      });
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/products/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          productName: formData.name,
          category: formData.category,
          briefDescription: formData.description || undefined
        })
      });

      const result = await response.json();

      if (result.success) {
        const data = result.data;
        setFormData(prev => ({
          ...prev,
          description: data.description,
          price: data.suggestedPrice.toString(),
          originalPrice: (data.suggestedPrice * 20).toString(),
          tags: data.tags.join(', ')
        }));
        setFeatures(data.features);
        
        toast({
          title: "✨ AI Generated!",
          description: "Product content generated successfully"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate content",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const generatePromotionalHeaderAI = async () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please enter product name and select category first",
        variant: "destructive"
      });
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/products/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'promotional-header',
          productName: formData.name,
          category: formData.category,
          description: formData.description
        })
      });

      const result = await response.json();

      if (result.success) {
        setPromotionalHeader(prev => ({
          ...prev,
          enabled: true,
          topBannerText: result.data.topBannerText,
          topBannerSubtext: result.data.topBannerSubtext,
          buttonText: result.data.buttonText,
          buttonPrice: result.data.buttonPrice,
          buttonSubtext: result.data.buttonSubtext,
          headlinePart1: result.data.headlinePart1,
          headlinePart2: result.data.headlinePart2,
          subHeading: result.data.subHeading,
          platformText: result.data.platformText,
          highlightText: result.data.highlightText
        }));
        
        toast({
          title: "🎯 Promotional Header Generated!",
          description: "AI created compelling header content"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate header",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const generateProductBenefitsAI = async () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please enter product name and select category first",
        variant: "destructive"
      });
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/products/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'product-benefits',
          productName: formData.name,
          category: formData.category,
          description: formData.description
        })
      });

      const result = await response.json();

      if (result.success) {
        setProductBenefits({
          enabled: true,
          mainTitle: result.data.mainTitle,
          subtitle: result.data.subtitle,
          benefits: result.data.benefits
        });
        
        toast({
          title: "✨ Product Benefits Generated!",
          description: "AI created compelling benefits section"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate benefits",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const enhanceDescription = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please enter product name and description first",
        variant: "destructive"
      });
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/products/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance',
          productName: formData.name,
          description: formData.description
        })
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          description: result.data.description
        }));
        
        toast({
          title: "✨ Enhanced!",
          description: "Description improved with AI"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Enhancement Failed",
        description: error.message || "Failed to enhance description",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const generateTags = async () => {
    if (!formData.name || !formData.category || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, category, and description first",
        variant: "destructive"
      });
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/products/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'tags',
          productName: formData.name,
          category: formData.category,
          description: formData.description
        })
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          tags: result.data.tags.join(', ')
        }));
        
        toast({
          title: "✨ Tags Generated!",
          description: "SEO-optimized tags created"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Tag Generation Failed",
        description: error.message || "Failed to generate tags",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const generateImages = async () => {
    if (!formData.name || !formData.category || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, category, and description first",
        variant: "destructive"
      });
      return;
    }

    setAiGenerating(true);
    try {
      const res = await generateProductImages(
        formData.name,
        formData.category,
        formData.description,
        4
      );

      const newImages = res.images.map((img, index) => ({
        id: `ai-${Date.now()}-${index}`,
        url: img.url,
        hint: img.hint,
        type: 'image' as const,
      }));

      setMedia(prev => [...prev, ...newImages]);

      toast({
        title: "🎨 Images Generated!",
        description: `${newImages.length} AI-powered images added`,
      });
    } catch (error: any) {
      toast({
        title: "Image Generation Failed",
        description: error.message || "Failed to generate images",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.downloadLink || media.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including download link and add at least one media item",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price) * 20,
        category: formData.category,
        status: formData.status,
        stock: parseInt(formData.stock),
        isFeatured: formData.isFeatured,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        downloadLink: formData.downloadLink,
        media,
        features,
        company,
        promotion: {
          enabled: promotion.enabled,
          discountPercentage: promotion.discountPercentage,
          timerDuration: promotion.timerDuration,
          timerEndDate: promotion.enabled && promotion.timerDuration > 0 
            ? new Date(Date.now() + promotion.timerDuration * 60 * 60 * 1000)
            : undefined
        },
        promotionalHeader: {
          enabled: promotionalHeader.enabled,
          topBannerText: promotionalHeader.topBannerText,
          topBannerSubtext: promotionalHeader.topBannerSubtext,
          buttonText: promotionalHeader.buttonText,
          buttonPrice: promotionalHeader.buttonPrice,
          buttonSubtext: promotionalHeader.buttonSubtext,
          headlinePart1: promotionalHeader.headlinePart1,
          headlinePart2: promotionalHeader.headlinePart2,
          subHeading: promotionalHeader.subHeading,
          platformText: promotionalHeader.platformText,
          highlightText: promotionalHeader.highlightText,
          timerEndDate: promotionalHeader.enabled && promotionalHeader.timerDuration > 0 
            ? new Date(Date.now() + promotionalHeader.timerDuration * 60 * 60 * 1000)
            : undefined
        },
        productBenefits: {
          enabled: productBenefits.enabled,
          mainTitle: productBenefits.mainTitle,
          subtitle: productBenefits.subtitle,
          benefits: productBenefits.benefits
        }
      };

      console.log('Creating product with data:', productData);
      console.log('Promotion data:', productData.promotion);
      console.log('🔥 Promotional Header data being sent:', productData.promotionalHeader);
      console.log('✨ Product Benefits data being sent:', productData.productBenefits);

      const response = await fetch(`/api/products?company=${company}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Product created successfully"
        });
        router.push('/admin/products');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addMedia = () => {
    if (!mediaInput.url) return;
    const newMedia = {
      ...mediaInput,
      id: Date.now().toString(),
      hint: mediaInput.hint || 'product media' // Default hint if empty
    };
    setMedia([...media, newMedia]);
    setMediaInput({ url: '', hint: '', type: 'image' });
  };

  const removeMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const addFeature = () => {
    setFeatures([...features, { icon: '✨', title: '', description: '', value: '' }]);
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/admin/products">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          New Product
        </h1>
        <Badge variant="secondary" className="ml-2">✨ AI Powered</Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateWithAI} 
            disabled={loading || aiGenerating || !formData.name || !formData.category}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            {aiGenerating ? '✨ Generating...' : '✨ Generate with AI'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/products')} disabled={loading}>
            Discard
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          {/* AI Helper Card */}
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✨</div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">AI-Powered Product Creation</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Let AI help you create compelling product content:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Full Generation:</strong> Enter name & category, click "Generate with AI"</li>
                    <li>• <strong>Enhance Description:</strong> Improve existing descriptions</li>
                    <li>• <strong>Generate Tags:</strong> Create SEO-optimized tags automatically</li>
                    <li>• <strong>Generate Images:</strong> AI-powered product images with smart search 🎨</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Fill in the details for your new digital product.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    className="w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Description *</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={enhanceDescription}
                      disabled={aiGenerating || !formData.name || !formData.description}
                      className="h-7 text-xs"
                    >
                      ✨ Enhance with AI
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="min-h-32"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-3">
                    <Label htmlFor="price">Price (Rs) *</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="originalPrice">Original Price (Rs)</Label>
                    <Input 
                      id="originalPrice" 
                      type="number" 
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      placeholder="Auto: 20x price"
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generateTags}
                      disabled={aiGenerating || !formData.name || !formData.category || !formData.description}
                      className="h-7 text-xs"
                    >
                      ✨ Generate Tags
                    </Button>
                  </div>
                  <Input
                    id="tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="design, ebook, tutorial"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="downloadLink">Download Link *</Label>
                  <Input
                    id="downloadLink"
                    type="url"
                    value={formData.downloadLink}
                    onChange={(e) => setFormData({...formData, downloadLink: e.target.value})}
                    placeholder="https://drive.google.com/file/d/your-file-id/view"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    External link to your digital product (Google Drive, Dropbox, etc.)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Media</CardTitle>
                  <CardDescription>Add images or videos for your product</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateImages}
                  disabled={aiGenerating || !formData.name || !formData.category || !formData.description}
                  className="gap-2"
                >
                  🎨 Generate Images with AI
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {/* Add Media Form */}
                <div className="grid gap-3">
                  <Label htmlFor="mediaUrl">Media URL *</Label>
                  <Input
                    id="mediaUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={mediaInput.url}
                    onChange={(e) => setMediaInput({...mediaInput, url: e.target.value})}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="mediaHint">Description/Hint</Label>
                  <Input
                    id="mediaHint"
                    type="text"
                    placeholder="Product showcase image"
                    value={mediaInput.hint}
                    onChange={(e) => setMediaInput({...mediaInput, hint: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="mediaType">Type</Label>
                    <Select value={mediaInput.type} onValueChange={(value: 'image' | 'video') => setMediaInput({...mediaInput, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" onClick={addMedia} size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Media
                  </Button>
                </div>

                {/* Media List */}
                {media.length > 0 && (
                  <div className="grid gap-2">
                    <Label>Added Media ({media.length})</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {media.map((item) => (
                        <div key={item.id} className="relative group border rounded-lg p-2">
                          {item.type === 'image' ? (
                            // Handle both base64 (Hugging Face) and URL (Pollinations) images
                            item.url.startsWith('data:') ? (
                              // Base64 from Hugging Face - use regular img tag
                              <img
                                src={item.url}
                                alt={item.hint}
                                className="w-full aspect-square object-cover rounded"
                              />
                            ) : (
                              // URL from Pollinations - use Next Image with unoptimized
                              <Image
                                src={item.url}
                                alt={item.hint}
                                width={150}
                                height={150}
                                className="w-full aspect-square object-cover rounded"
                                unoptimized
                              />
                            )
                          ) : (
                            <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                              <span className="text-sm">Video: {item.hint}</span>
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => removeMedia(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <p className="text-xs mt-1 truncate">{item.hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
              <CardDescription>Add key features and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="grid gap-3 p-4 border rounded-lg relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <Label>Icon</Label>
                        <Input
                          value={feature.icon}
                          onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                          placeholder="🎨"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          placeholder="Feature title"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        placeholder="Feature description"
                      />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={feature.value}
                        onChange={(e) => updateFeature(index, 'value', e.target.value)}
                        placeholder="Rs 999 Value"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addFeature} variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                     <SelectItem value="Web Development">Web Development</SelectItem>
                     <SelectItem value="Courses & E-books">Courses & E-books</SelectItem> <SelectItem value="Graphic Design">Graphic Design</SelectItem> <SelectItem value="AI Reels">AI Reels</SelectItem> <SelectItem value="Video Editing">Video Editing</SelectItem> <SelectItem value="Social Media">Social Media</SelectItem> <SelectItem value="Templates">Templates</SelectItem>
<SelectItem value="App Development">App Development</SelectItem>
<SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
<SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
<SelectItem value="Business & Startups">Business & Startups</SelectItem>
<SelectItem value="Photography">Photography</SelectItem>
<SelectItem value="Music & Audio Editing">Music & Audio Editing</SelectItem>
<SelectItem value="Copywriting">Copywriting</SelectItem>
<SelectItem value="SEO Tools">SEO Tools</SelectItem>
<SelectItem value="Canva Templates">Canva Templates</SelectItem>
<SelectItem value="3D Models & Assets">3D Models & Assets</SelectItem>
<SelectItem value="Wallpapers & Icons">Wallpapers & Icons</SelectItem>
<SelectItem value="Branding Kits">Branding Kits</SelectItem>
<SelectItem value="Marketing Tools">Marketing Tools</SelectItem>
<SelectItem value="Automation Tools">Automation Tools</SelectItem>
<SelectItem value="ChatGPT Prompts">ChatGPT Prompts</SelectItem>
<SelectItem value="Printable Files">Printable Files</SelectItem>
<SelectItem value="Fitness & Lifestyle">Fitness & Lifestyle</SelectItem>
<SelectItem value="Finance & Investing">Finance & Investing</SelectItem>
<SelectItem value="Software Tools">Software Tools</SelectItem>

                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Status & Stock</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger id="status">
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="stock">Stock</Label>
                  <Input 
                    id="stock" 
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Featured Product</Label>
                </div>
            </CardContent>
          </Card>

          {/* Promotion Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Promotion Settings</CardTitle>
              <CardDescription>Configure countdown timer and discount</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="promotionEnabled"
                    checked={promotion.enabled}
                    onChange={(e) => setPromotion({...promotion, enabled: e.target.checked})}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="promotionEnabled" className="cursor-pointer">Enable Promotion</Label>
                </div>
                
                {promotion.enabled && (
                  <>
                    <div className="grid gap-3">
                      <Label htmlFor="discountPercentage">Discount % Off</Label>
                      <Input 
                        id="discountPercentage" 
                        type="number"
                        min="0"
                        max="100"
                        value={promotion.discountPercentage}
                        onChange={(e) => setPromotion({...promotion, discountPercentage: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 85"
                      />
                      <p className="text-xs text-muted-foreground">
                        Shows as "{promotion.discountPercentage}% OFF" badge
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="timerDuration">Timer Duration (hours)</Label>
                      <Input 
                        id="timerDuration" 
                        type="number"
                        min="1"
                        value={promotion.timerDuration}
                        onChange={(e) => setPromotion({...promotion, timerDuration: parseInt(e.target.value) || 24})}
                        placeholder="e.g., 24"
                      />
                      <p className="text-xs text-muted-foreground">
                        Countdown timer will show for {promotion.timerDuration} hours
                      </p>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>

          {/* Promotional Header Settings */}
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    🎯 Promotional Header
                  </CardTitle>
                  <CardDescription>Add a custom promotional banner at the top of product page</CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={generatePromotionalHeaderAI}
                  disabled={aiGenerating || !formData.name || !formData.category}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {aiGenerating ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="promoHeaderEnabled"
                  checked={promotionalHeader.enabled}
                  onChange={(e) => setPromotionalHeader({...promotionalHeader, enabled: e.target.checked})}
                  className="h-4 w-4"
                />
                <Label htmlFor="promoHeaderEnabled" className="cursor-pointer">Enable Promotional Header</Label>
              </div>
              
              {promotionalHeader.enabled && (
                <>
                  <div className="grid gap-3">
                    <Label>Top Red Banner Text *</Label>
                    <Input 
                      value={promotionalHeader.topBannerText}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, topBannerText: e.target.value})}
                      placeholder="e.g., ATTENTION! PRICES GOES UP AGAIN WHEN TIMER HITS 0!"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Banner Subtext</Label>
                    <Input 
                      value={promotionalHeader.topBannerSubtext}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, topBannerSubtext: e.target.value})}
                      placeholder="e.g., + BONUSES WORTH $3M EXPIRES IN..."
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Timer Duration (hours)</Label>
                    <Input 
                      type="number"
                      value={promotionalHeader.timerDuration}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, timerDuration: parseInt(e.target.value) || 24})}
                      placeholder="24"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Green Button Text *</Label>
                    <Input 
                      value={promotionalHeader.buttonText}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, buttonText: e.target.value})}
                      placeholder="e.g., Get ViralDashboard AI"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Button Price *</Label>
                    <Input 
                      value={promotionalHeader.buttonPrice}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, buttonPrice: e.target.value})}
                      placeholder="e.g., at $9, for ₹199, Only $27"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Headline Part 1 (Orange)</Label>
                    <Textarea 
                      value={promotionalHeader.headlinePart1}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, headlinePart1: e.target.value})}
                      placeholder="e.g., Create, Schedule & Publish Your Content To Your"
                      rows={2}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Headline Part 2 (Teal/Green)</Label>
                    <Textarea 
                      value={promotionalHeader.headlinePart2}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, headlinePart2: e.target.value})}
                      placeholder="e.g., Facebook Pages, Instagram, Google My Business, Pinterest, LinkedIn & Twitter Accounts"
                      rows={2}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Subheading (Bold, Dark)</Label>
                    <Input 
                      value={promotionalHeader.subHeading}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, subHeading: e.target.value})}
                      placeholder="e.g., 21-in-1 Social Media Marketing & Automation"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Platform Description</Label>
                    <Input 
                      value={promotionalHeader.platformText}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, platformText: e.target.value})}
                      placeholder="e.g., Platform to DISCOVER, CREATE, STRATEGIZE & PUBLISH your content."
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Yellow Highlight Text *</Label>
                    <Input 
                      value={promotionalHeader.highlightText}
                      onChange={(e) => setPromotionalHeader({...promotionalHeader, highlightText: e.target.value})}
                      placeholder="e.g., ViralDashboard AI Making Us $932.38 Daily"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Product Benefits Section */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    ✨ Product Benefits Section
                  </CardTitle>
                  <CardDescription>Showcase key benefits with icons (like "Can Create Anything In Seconds")</CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={generateProductBenefitsAI}
                  disabled={aiGenerating || !formData.name || !formData.category}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {aiGenerating ? 'Generating...' : 'AI Generate'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="benefitsEnabled"
                  checked={productBenefits.enabled}
                  onChange={(e) => setProductBenefits({...productBenefits, enabled: e.target.checked})}
                  className="h-4 w-4"
                />
                <Label htmlFor="benefitsEnabled" className="cursor-pointer">Enable Product Benefits Section</Label>
              </div>
              
              {productBenefits.enabled && (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="benefitsMainTitle">Main Title *</Label>
                    <Input 
                      id="benefitsMainTitle" 
                      value={productBenefits.mainTitle}
                      onChange={(e) => setProductBenefits({...productBenefits, mainTitle: e.target.value})}
                      placeholder="e.g., ViralDashboard Can Create Anything In Seconds"
                    />
                    <p className="text-xs text-muted-foreground">
                      Main heading highlighting what your product can do
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="benefitsSubtitle">Subtitle (Optional)</Label>
                    <Input 
                      id="benefitsSubtitle" 
                      value={productBenefits.subtitle}
                      onChange={(e) => setProductBenefits({...productBenefits, subtitle: e.target.value})}
                      placeholder="e.g., Transform your workflow with powerful features"
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief value proposition
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Benefits (8 items recommended)</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setProductBenefits({
                          ...productBenefits,
                          benefits: [...productBenefits.benefits, { icon: '🎯', title: '', description: '' }]
                        })}
                      >
                        Add Benefit
                      </Button>
                    </div>

                    {productBenefits.benefits.map((benefit, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3 bg-white dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">Benefit {index + 1}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newBenefits = productBenefits.benefits.filter((_, i) => i !== index);
                              setProductBenefits({...productBenefits, benefits: newBenefits});
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Icon (Emoji)</Label>
                          <Input 
                            value={benefit.icon}
                            onChange={(e) => {
                              const newBenefits = [...productBenefits.benefits];
                              newBenefits[index].icon = e.target.value;
                              setProductBenefits({...productBenefits, benefits: newBenefits});
                            }}
                            placeholder="🎯"
                            maxLength={2}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Title</Label>
                          <Input 
                            value={benefit.title}
                            onChange={(e) => {
                              const newBenefits = [...productBenefits.benefits];
                              newBenefits[index].title = e.target.value;
                              setProductBenefits({...productBenefits, benefits: newBenefits});
                            }}
                            placeholder="e.g., Find and discover content from 100,000 articles database"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Description</Label>
                          <Textarea 
                            value={benefit.description}
                            onChange={(e) => {
                              const newBenefits = [...productBenefits.benefits];
                              newBenefits[index].description = e.target.value;
                              setProductBenefits({...productBenefits, benefits: newBenefits});
                            }}
                            placeholder="e.g., across 70 Industries for MASSIVE Traffic, Engagement & Sales."
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}

                    {productBenefits.benefits.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No benefits added yet. Click "Add Benefit" or use AI Generate.
                      </p>
                    )}
                  </div>

                  {/* Preview */}
                  {productBenefits.benefits.length > 0 && (
                    <div className="mt-4 p-4 rounded-lg border-2 border-dashed">
                      <p className="text-xs font-semibold mb-3">Preview:</p>
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold mb-1">{productBenefits.mainTitle || 'Main Title'}</h3>
                        {productBenefits.subtitle && (
                          <p className="text-sm text-muted-foreground">{productBenefits.subtitle}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {productBenefits.benefits.slice(0, 4).map((benefit, index) => (
                          <div key={index} className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="text-2xl">{benefit.icon}</span>
                            <div>
                              <p className="text-xs font-semibold">{benefit.title || 'Title'}</p>
                              <p className="text-xs text-muted-foreground">{benefit.description || 'Description'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {productBenefits.benefits.length > 4 && (
                        <p className="text-xs text-center mt-2 text-muted-foreground">
                          +{productBenefits.benefits.length - 4} more benefits
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
      <div className="flex items-center justify-center gap-2 md:hidden mt-4">
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/products')} disabled={loading}>
          Discard
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </>
  );
}

// Suspense wrapper to allow useSearchParams in client component
export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <NewProductPageInner />
    </Suspense>
  );
}
