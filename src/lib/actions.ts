'use server';

import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContactForm(values: z.infer<typeof formSchema>) {
  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    // In a real app, you'd want to return a more detailed error
    return { success: false, message: 'Invalid form data.' };
  }

  try {
    // Here you would typically save the data to a database like Firestore
    console.log('New contact form submission:', parsed.data);
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
