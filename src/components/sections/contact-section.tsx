'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/lib/actions';
import { Globe, Twitter, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phoneNumber: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export default function ContactSection() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // The new form has different fields. Let's adapt.
    const contactData = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        message: values.message,
    };
    const result = await submitContactForm(contactData);

    if (result.success) {
      toast({
        title: 'Message Sent!',
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      form.reset();
    } else {
      toast({
        title: 'Error',
        description: result.message || 'There was an error sending your message.',
        variant: 'destructive',
      });
    }
  }

  const contactMethods = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Join our community',
      desc: 'Join our community to stay updated with the latest news and announcements.',
      link: {
        name: 'Join our Discord',
        href: 'javascript:void(0)',
      },
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      title: 'Follow us on Twitter',
      desc: 'Follow us on Twitter to get the latest updates and news.',
      link: {
        name: 'Send us DMs',
        href: 'javascript:void(0)',
      },
    },
  ];

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* "Get in touch" form */}
        <div className="max-w-lg mx-auto space-y-3 sm:text-center">
          <h3 className="text-primary font-semibold">Contact</h3>
          <p className="text-foreground text-3xl font-semibold sm:text-4xl">Get in touch</p>
          <p className="text-muted-foreground">We’d love to hear from you! Please fill out the form below.</p>
        </div>
        <div className="mt-12 max-w-lg mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                            <Select defaultValue='US'>
                                <SelectTrigger className="border-none bg-transparent outline-none p-0 h-full text-sm !ring-0 !ring-offset-0 !focus:ring-0 !focus:ring-offset-0"></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="US">US</SelectItem>
                                    <SelectItem value="ES">ES</SelectItem>
                                    <SelectItem value="MR">MR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Input type="tel" placeholder="+1 (555) 000-000" className="w-full pl-[5.5rem]" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </div>

        {/* "Let's connect" section */}
        <div className="max-w-screen-xl mx-auto px-4 text-muted-foreground gap-12 mt-20 md:px-8 lg:flex">
          <div className="max-w-md">
            <h3 className="text-foreground text-3xl font-semibold sm:text-4xl">Let’s connect</h3>
            <p className="mt-3">
              We’re here to help and answer any question you might have. We look forward to hearing from you.
            </p>
          </div>
          <div>
            <ul className="mt-12 gap-y-6 gap-x-12 items-center md:flex lg:gap-x-0 lg:mt-0">
              {contactMethods.map((item, idx) => (
                <li key={idx} className="space-y-3 border-t py-6 md:max-w-sm md:py-0 md:border-t-0 lg:border-l lg:px-12 lg:max-w-none">
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center text-foreground">
                    {item.icon}
                  </div>
                  <h4 className="text-foreground text-lg font-medium xl:text-xl">{item.title}</h4>
                  <p>{item.desc}</p>
                  <a href={item.link.href} className="flex items-center gap-1 text-sm text-primary duration-150 hover:text-primary/80 font-medium">
                    {item.link.name}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Google Map Embed */}
        <div className="mt-20">
            <div className="max-w-screen-xl mx-auto px-4 text-muted-foreground gap-12 md:px-8">
                <div className="rounded-lg overflow-hidden">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.296061325275!2d-73.98845368459395!3d40.7554911793272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c65f2b89%3A0x252b391d34e99557!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1689781264811!5m2!1sen!2sus" 
                        width="100%" 
                        height="450" 
                        style={{ border: 0 }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
