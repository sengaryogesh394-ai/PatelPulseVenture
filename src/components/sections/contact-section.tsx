// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { useToast } from '@/hooks/use-toast';
// import { Facebook, Twitter, ArrowRight } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import React from 'react';

// const formSchema = z.object({
//   firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
//   lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
//   email: z.string().email({ message: 'Please enter a valid email address.' }),
//   phoneNumber: z.string().optional(),
//   message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
// });

// export default function ContactSection() {
//   const { toast } = useToast();
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       phoneNumber: '',
//       message: '',
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     const formData = new FormData();
//     formData.append("access_key", "f3735e73-b46a-4877-b951-5a04fdd1ac11");
//     formData.append("name", `${values.firstName} ${values.lastName}`);
//     formData.append("email", values.email);
//     formData.append("phone", values.phoneNumber || "Not provided");
//     formData.append("message", values.message);
//     formData.append("subject", `New Contact Form Submission from ${values.firstName} ${values.lastName}`);

//     try {
//       const response = await fetch("https://api.web3forms.com/submit", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (result.success) {
//         toast({
//           title: 'Message Sent!',
//           description: "Thank you for reaching out. We'll get back to you soon.",
//         });
//         form.reset();
//       } else {
//         console.error("Error submitting form:", result);
//         toast({
//           title: 'Error',
//           description: result.message || 'There was an error sending your message.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//         console.error("Caught error submitting form:", error);
//         toast({
//             title: 'Error',
//             description: 'There was a network error sending your message. Please try again.',
//             variant: 'destructive',
//         });
//     }
//   }

//   const contactMethods = [
//     {
//       icon: <Facebook className="w-6 h-6" />,
//       title: 'Find us on Facebook',
//       desc: 'Join our community to stay updated with the latest news and announcements.',
//       link: {
//         name: 'Go to Facebook',
//         href: 'https://www.facebook.com/profile.php?id=61582011557077',
//       },
//     },
//     {
//       icon: <Twitter className="w-6 h-6" />,
//       title: 'Follow us on Twitter',
//       desc: 'Follow us on Twitter to get the latest updates and news.',
//       link: {
//         name: 'Send us DMs',
//         href: 'https://x.com/patel_puls43877',
//       },
//     },
//   ];

//   return (
//     <section id="contact" className="py-20 sm:py-28">
//       <div className="container mx-auto px-4 md:px-8">
//         {/* "Get in touch" form */}
//         <div className="max-w-lg mx-auto space-y-3 sm:text-center">
//           <h3 className="text-primary font-semibold">Contact</h3>
//           <p className="text-foreground text-3xl font-semibold sm:text-4xl">Get in touch</p>
//           <p className="text-muted-foreground">We’d love to hear from you! Please fill out the form below.</p>
//         </div>
//         <div className="mt-12 max-w-lg mx-auto">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
//               <div className="flex flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>First name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Last name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input type="email" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="phoneNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone number</FormLabel>
//                     <FormControl>
//                       <div className="relative mt-2">
//                         <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
//                             <Select defaultValue='IN'>
//                                 <SelectTrigger className="border-none bg-transparent outline-none p-0 h-full text-sm !ring-0 !ring-offset-0 !focus:ring-0 !focus:ring-offset-0"></SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="IN">IN</SelectItem>
//                                     <SelectItem value="US">US</SelectItem>
//                                     <SelectItem value="ES">ES</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <Input type="tel" placeholder="+91 98765 43210" className="w-full pl-[5.5rem]" {...field} />
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="message"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Message</FormLabel>
//                     <FormControl>
//                       <Textarea rows={5} {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
//                 {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
//               </Button>
//             </form>
//           </Form>
//         </div>

//         {/* "Let's connect" section */}
//         <div className="container mx-auto px-4 text-muted-foreground gap-12 mt-20 md:px-8 lg:flex">
//           <div className="max-w-md">
//             <h3 className="text-foreground text-3xl font-semibold sm:text-4xl">Let’s connect</h3>
//             <p className="mt-3">
//               We’re here to help and answer any question you might have. We look forward to hearing from you.
//             </p>
//           </div>
//           <div>
//             <ul className="mt-12 gap-y-6 gap-x-12 items-center md:flex lg:gap-x-0 lg:mt-0">
//               {contactMethods.map((item, idx) => (
//                 <li key={idx} className="space-y-3 border-t py-6 md:max-w-sm md:py-0 md:border-t-0 lg:border-l lg:px-12 lg:max-w-none">
//                   <div className="w-12 h-12 rounded-full border flex items-center justify-center text-foreground">
//                     {item.icon}
//                   </div>
//                   <h4 className="text-foreground text-lg font-medium xl:text-xl">{item.title}</h4>
//                   <p>{item.desc}</p>
//                   <a href={item.link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary duration-150 hover:text-primary/80 font-medium">
//                     {item.link.name}
//                     <ArrowRight className="w-5 h-5" />
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Google Map Embed */}
//         <div className="mt-20">
//             <div className="container mx-auto px-4 text-muted-foreground gap-12 md:px-8">
//                 <div className="rounded-lg overflow-hidden">
//                     <iframe 
//                         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.921396951244!2d77.4334333150805!3d28.54203498245598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceb5059ffffff%3A0x42998a694b8455b3!2sOC%201125%2C%20ACE%20City%2C%20Sector%201%2C%20Greater%20Noida%2C%20Ghaziabad%2C%20Uttar%20Pradesh%20201009!5e0!3m2!1sen!2sin!4v1730624503615!5m2!1sen!2sin"
//                         width="100%" 
//                         height="450" 
//                         style={{ border: 0 }} 
//                         allowFullScreen={true} 
//                         loading="lazy" 
//                         referrerPolicy="no-referrer-when-downgrade"
//                     ></iframe>
//                 </div>
//             </div>
//         </div>
//       </div>
//     </section>
//   );
// }
 
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Twitter, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import React from 'react';

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
    const formData = new FormData();
    formData.append("access_key", "f3735e73-b46a-4877-b951-5a04fdd1ac11");
    formData.append("name", `${values.firstName} ${values.lastName}`);
    formData.append("email", values.email);
    formData.append("phone", values.phoneNumber || "Not provided");
    formData.append("message", values.message);
    formData.append("subject", `New Contact Form Submission from ${values.firstName} ${values.lastName}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: "Thank you for reaching out. We'll get back to you soon.",
        });
        form.reset();
      } else {
        console.error("Error submitting form:", result);
        toast({
          title: 'Error',
          description: result.message || 'There was an error sending your message.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Caught error submitting form:", error);
      toast({
        title: 'Error',
        description: 'There was a network error sending your message. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const contactMethods = [
    {
      icon: <Facebook className="w-6 h-6" />,
      title: 'Find us on Facebook',
      desc: 'Join our community to stay updated with the latest news and announcements.',
      link: {
        name: 'Go to Facebook',
        href: 'https://www.facebook.com/profile.php?id=61582011557077',
      },
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      title: 'Follow us on Twitter',
      desc: 'Follow us on Twitter to get the latest updates and news.',
      link: {
        name: 'Send us DMs',
        href: 'https://x.com/patel_puls43877',
      },
    },
  ];

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 md:px-8">
        {/* Get in touch form */}
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
                          <Select defaultValue="IN">
                            <SelectTrigger className="border-none bg-transparent outline-none p-0 h-full text-sm !ring-0 !ring-offset-0 !focus:ring-0 !focus:ring-offset-0">
                              <SelectValue placeholder="IN" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IN">IN</SelectItem>
                              <SelectItem value="US">US</SelectItem>
                              <SelectItem value="ES">ES</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input type="tel" placeholder="+91 98765 43210" className="w-full pl-[5.5rem]" {...field} />
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

        {/* Let's connect section */}
        <div className="container mx-auto px-4 text-muted-foreground gap-12 mt-20 md:px-8 lg:flex">
          <div className="max-w-md">
            <h3 className="text-foreground text-3xl font-semibold sm:text-4xl">Let’s connect</h3>
            <p className="mt-3">
              We’re here to help and answer any question you might have. We look forward to hearing from you.
            </p>
          </div>
          <div>
            <ul className="mt-12 gap-y-6 gap-x-12 items-center md:flex lg:gap-x-0 lg:mt-0">
              {contactMethods.map((item, idx) => (
                <li
                  key={idx}
                  className="space-y-3 border-t py-6 md:max-w-sm md:py-0 md:border-t-0 lg:border-l lg:px-12 lg:max-w-none"
                >
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center text-foreground">
                    {item.icon}
                  </div>
                  <h4 className="text-foreground text-lg font-medium xl:text-xl">{item.title}</h4>
                  <p>{item.desc}</p>
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary duration-150 hover:text-primary/80 font-medium"
                  >
                    {item.link.name}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Google Map Embed (Updated for OC 1125, Sector 4, Greater Noida West) */}
       <div className="mt-20">
  <div className="container mx-auto px-4 text-muted-foreground gap-12 md:px-8">
    <div className="rounded-lg overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.7306898607335!2d77.43030497616368!3d28.607854985199676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cefc4629e38df%3A0xa1a995102f10bb69!2sPatel%20Pulse%20Ventures!5e0!3m2!1sen!2sin!4v1762232300062!5m2!1sen!2sin"
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
