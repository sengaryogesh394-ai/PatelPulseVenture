'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating initial content drafts for venture portfolios,
 * innovation highlights, and team bios using AI, to help administrators quickly create compelling content.
 *
 * - generateContentDraft - A function that generates content drafts based on the provided input.
 * - ContentDraftInput - The input type for the generateContentDraft function.
 * - ContentDraftOutput - The return type for the generateContentDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentDraftInputSchema = z.object({
  contentType: z.enum(['venturePortfolio', 'innovationHighlight', 'teamBio']).describe('The type of content to generate.'),
  topic: z.string().describe('The topic or subject of the content.'),
  keywords: z.string().optional().describe('Optional keywords to guide the content generation.'),
});
export type ContentDraftInput = z.infer<typeof ContentDraftInputSchema>;

const ContentDraftOutputSchema = z.object({
  draftContent: z.string().describe('The generated content draft.'),
});
export type ContentDraftOutput = z.infer<typeof ContentDraftOutputSchema>;

export async function generateContentDraft(input: ContentDraftInput): Promise<ContentDraftOutput> {
  return generateContentDraftFlow(input);
}

const contentDraftPrompt = ai.definePrompt({
  name: 'contentDraftPrompt',
  input: {schema: ContentDraftInputSchema},
  output: {schema: ContentDraftOutputSchema},
  prompt: `You are an AI assistant specialized in generating content drafts for company websites.

  Based on the content type, topic, and keywords provided, generate a compelling and informative content draft.

  Content Type: {{{contentType}}}
  Topic: {{{topic}}}
  Keywords: {{{keywords}}}

  Draft Content:`, // Prompt instructions improved to be more specific and clear.
});

const generateContentDraftFlow = ai.defineFlow(
  {
    name: 'generateContentDraftFlow',
    inputSchema: ContentDraftInputSchema,
    outputSchema: ContentDraftOutputSchema,
  },
  async input => {
    const {output} = await contentDraftPrompt(input);
    return output!;
  }
);
