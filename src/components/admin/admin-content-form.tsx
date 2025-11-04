'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateContentDraft } from '@/ai/flows/admin-content-creation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  contentType: z.enum(['venturePortfolio', 'innovationHighlight', 'teamBio'], {
    required_error: 'You need to select a content type.',
  }),
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters.' }),
  keywords: z.string().optional(),
});

export default function AdminContentForm() {
  const { toast } = useToast();
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      keywords: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedContent('');
    try {
      const result = await generateContentDraft(values);
      if (result && result.draftContent) {
        setGeneratedContent(result.draftContent);
        toast({
          title: 'Content Generated',
          description: 'A new content draft has been successfully generated.',
        });
      } else {
        throw new Error('No content was generated.');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Generation Failed',
        description: 'There was an error generating the content draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <FormProvider {...form}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="venturePortfolio">Venture Portfolio</SelectItem>
                      <SelectItem value="innovationHighlight">Innovation Highlight</SelectItem>
                      <SelectItem value="teamBio">Team Bio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic / Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., QuantumLeap, AI in Healthcare, Dr. Evelyn Reed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., quantum computing, enterprise, PhD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isGenerating ? 'Generating...' : 'Generate Draft'}
            </Button>
          </form>
        </Form>

        <div className="space-y-2">
          <FormLabel>Generated Content</FormLabel>
          <Textarea
            placeholder="Your generated content will appear here..."
            value={generatedContent}
            readOnly={isGenerating}
            onChange={(e) => setGeneratedContent(e.target.value)}
            className="min-h-[300px] bg-muted/50"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigator.clipboard.writeText(generatedContent)}
            disabled={!generatedContent || isGenerating}
          >
            Copy to Clipboard
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
