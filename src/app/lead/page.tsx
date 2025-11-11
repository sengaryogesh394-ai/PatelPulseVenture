
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { services } from "@/lib/data";

// Project type options based on service detail
const projectTypeOptions: { [key: string]: string[] } = {
    // Website Development
    "Frontend Development": ["E-Commerce Website", "Corporate Website", "Portfolio Website", "Landing Page", "Blog/News Portal", "Educational Platform"],
    "Backend Development": ["API Development", "Database Management System", "Authentication System", "Payment Gateway Integration", "Real-time Application", "Microservices Architecture"],
    "Full Stack Development": ["E-Commerce Platform", "LMS (Learning Management)", "CRM System", "ERP Solution", "Social Media Platform", "Booking/Reservation System", "Logistics Management", "Healthcare Portal"],
    "E-Commerce Development": ["Fashion Store", "Electronics Store", "Grocery/Food Delivery", "Multi-vendor Marketplace", "Subscription Box Service", "Digital Products Store"],
    "CRM & ERP Solutions": ["Sales CRM", "Customer Support System", "Inventory Management", "HR Management System", "Project Management Tool", "Accounting Software"],
    "Website Optimization & SEO": ["Technical SEO Audit", "Performance Optimization", "Mobile Optimization", "Schema Implementation", "Content SEO Strategy"],
    "Maintenance & Cloud Deployment": ["AWS Deployment", "Vercel/Netlify Hosting", "Regular Maintenance", "Security Updates", "Performance Monitoring"],
    "Custom Business Applications": ["Analytics Dashboard", "Workflow Automation", "AI Chatbot Integration", "Custom Portal", "Reporting System"],
    
    // Mobile App Development
    "Cross-Platform Development": ["E-Commerce App", "Social Media App", "Food Delivery App", "Fitness/Health App", "Educational App", "Finance/Banking App"],
    "Native App Development": ["iOS Enterprise App", "Android Business App", "Gaming App", "Streaming App", "Navigation App"],
    "UI/UX Design for Mobile": ["App Redesign", "Wireframing & Prototyping", "User Flow Design", "Interactive Prototype", "Design System Creation"],
    "Backend & API Integration": ["REST API Development", "GraphQL API", "Firebase Integration", "Third-party API Integration", "Real-time Sync"],
    "App Store Deployment & ASO": ["App Store Submission", "Play Store Submission", "ASO Optimization", "App Marketing Strategy"],
    "Testing & Quality Assurance": ["Automated Testing", "Manual Testing", "Performance Testing", "Security Testing", "User Acceptance Testing"],
    
    // Digital Marketing
    "Search Engine Optimization (SEO)": ["Local SEO", "E-Commerce SEO", "Technical SEO", "Content SEO", "Link Building Campaign"],
    "Paid Advertising (SEM/PPC)": ["Google Ads Campaign", "Facebook Ads", "Instagram Ads", "LinkedIn Ads", "Remarketing Campaign"],
    "Social Media Marketing": ["Instagram Marketing", "Facebook Marketing", "LinkedIn Marketing", "Twitter Marketing", "YouTube Marketing", "Influencer Campaign"],
    "Content Marketing": ["Blog Content", "Video Content", "Infographics", "Whitepapers", "Case Studies", "Email Newsletters"],
    "Email Marketing": ["Drip Campaign", "Newsletter Setup", "Automation Workflow", "Lead Nurturing", "Promotional Campaigns"],
    "Analytics & Reporting": ["Google Analytics Setup", "Conversion Tracking", "Custom Dashboard", "Performance Reports", "A/B Testing"],
    
    // E-Commerce Solutions
    "Platform Development": ["Shopify Store", "WooCommerce Store", "Custom E-Commerce", "Headless Commerce", "Magento Store"],
    "Payment & Shipping Integration": ["Payment Gateway Setup", "Multi-currency Support", "Shipping Integration", "Subscription Billing", "Tax Calculation"],
    "Inventory & Order Management": ["Inventory System", "Order Tracking", "Warehouse Integration", "Multi-location Management", "Automated Notifications"],
    "Conversion Rate Optimization (CRO)": ["Checkout Optimization", "Product Page Testing", "Cart Recovery", "User Behavior Analysis", "Mobile Optimization"],
    "E-commerce SEO & Marketing": ["Product SEO", "Google Shopping Ads", "Email Automation", "Loyalty Program", "Referral System"],
    "Security & Performance": ["SSL & Security Setup", "Performance Optimization", "DDoS Protection", "Regular Backups", "Cloud Hosting"],
    
    // UX & UI Design
    "User Experience (UX) Research": ["User Research", "Persona Creation", "User Journey Mapping", "Usability Testing", "Competitor Analysis"],
    "User Interface (UI) Design": ["Web UI Design", "Mobile UI Design", "Dashboard Design", "Dark Mode Design", "Responsive Design"],
    "Wireframing & Prototyping": ["Low-fidelity Wireframes", "High-fidelity Mockups", "Interactive Prototype", "Clickable Prototype", "User Flow Design"],
    "Design Systems": ["Component Library", "Style Guide", "Design Tokens", "UI Kit", "Documentation"],
    "Accessibility (A11y)": ["WCAG Compliance", "Screen Reader Optimization", "Keyboard Navigation", "Color Contrast Audit", "Accessible Forms"],
    "Branding & Visual Identity": ["Logo Design", "Brand Guidelines", "Marketing Collateral", "Brand Strategy", "Visual Identity System"],
    
    // Graphic Design
    "Branding & Identity": ["Logo Design", "Brand Style Guide", "Business Cards", "Corporate Stationery", "Brand Refresh"],
    "Marketing & Advertising": ["Social Media Graphics", "Brochures & Flyers", "Infographics", "Presentation Design", "Email Templates"],
    "Digital Graphics": ["Website Banners", "Custom Icons", "Illustrations", "App Screenshots", "Digital Signage"],
    "Print Design": ["Packaging Design", "Magazine Layout", "Trade Show Banners", "Restaurant Menus", "Annual Reports"],
    "Motion Graphics": ["Animated Logos", "Explainer Videos", "Social Media Videos", "Animated GIFs", "Video Overlays"],
    "Illustration": ["Custom Illustrations", "Character Design", "Infographic Art", "Editorial Illustrations", "Icon Sets"],
    
    // User Generated Content (UGC)
    "UGC Strategy & Planning": ["Brand Campaign Strategy", "Hashtag Campaign", "Influencer Outreach", "Community Building", "Content Guidelines", "Rights Management"],
    "Content Collection & Curation": ["Social Monitoring", "Review Collection", "Photo/Video Submissions", "Contest Management", "Content Moderation", "User Stories"],
    "UGC Distribution & Amplification": ["Social Reposting", "Website Integration", "Email Marketing", "Paid Ad Campaigns", "Product Reviews", "Influencer Collaboration"],
    "Video Testimonials & Reviews": ["Customer Testimonials", "Unboxing Videos", "Product Reviews", "Before & After", "Tutorial Videos", "Live Streams"],
    "Social Proof & Trust Building": ["Review Widgets", "Social Media Wall", "Success Stories", "Case Studies", "Trust Badges", "Partnership Content"],
    "Analytics & Performance": ["Engagement Tracking", "Conversion Analysis", "Sentiment Analysis", "ROI Measurement", "A/B Testing"],
    
    // Computer Generated Imagery (CGI)
    "3D Product Visualization": ["Photorealistic Renders", "360° Views", "Product Configurators", "Exploded Views", "Material Rendering", "Lifestyle Renders"],
    "Architectural Visualization": ["Exterior Renders", "Interior Design", "Landscape Design", "Virtual Tours", "Lighting Scenarios", "Aerial Views"],
    "3D Animation & Motion Graphics": ["Product Animation", "Explainer Animation", "Logo Animation", "Character Animation", "Technical Animation", "Cinematic Sequences"],
    "Virtual & Augmented Reality": ["VR Experience", "AR Visualization", "3D AR/VR Models", "Interactive Configurators", "Virtual Showrooms", "Immersive Experiences"],
    "Visual Effects (VFX)": ["Compositing", "Particle Effects", "Motion Tracking", "Color Grading", "CGI Integration", "Special Effects"],
    "Game Assets & Metaverse": ["Game Assets", "Character Modeling", "Texture Creation", "Metaverse Design", "NFT 3D Art", "Virtual Worlds"],
};

export default function LeadPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedService, setSelectedService] = useState<string>("");
    const [serviceSubOptions, setServiceSubOptions] = useState<string[]>([]);
    const [projectTypes, setProjectTypes] = useState<string[]>([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        serviceDetail: "",
        projectType: "",
        budget: "",
        contactMethod: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const serviceName = e.target.value;
        setSelectedService(serviceName);
        setForm({ ...form, service: serviceName, serviceDetail: "", projectType: "" });

        // Find the selected service and get its detail options
        const service = services.find(s => s.name === serviceName);
        if (service && service.details) {
            const options = service.details.map(detail => detail.title);
            setServiceSubOptions(options);
        } else {
            setServiceSubOptions([]);
        }
        setProjectTypes([]);
    };

    const handleServiceDetailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const detailValue = e.target.value;
        setForm({ ...form, serviceDetail: detailValue, projectType: "" });

        // Get project type options for this service detail
        if (projectTypeOptions[detailValue]) {
            setProjectTypes(projectTypeOptions[detailValue]);
        } else {
            setProjectTypes([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("access_key", "f3735e73-b46a-4877-b951-5a04fdd1ac11");
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone || "Not provided");
        formData.append("company", form.company || "Not provided");
        formData.append("service", form.service);
        formData.append("serviceDetail", form.serviceDetail || "Not specified");
        formData.append("projectType", form.projectType || "Not specified");
        formData.append("budget", form.budget || "Not specified");
        formData.append("contactMethod", form.contactMethod || "Email");
        formData.append("message", form.message || "No additional message");
        formData.append("subject", `New Lead: ${form.name} - ${form.service}${form.serviceDetail ? ` (${form.serviceDetail})` : ''}${form.projectType ? ` - ${form.projectType}` : ''}`);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.message || "There was an error submitting your details. Please try again.");
            }
        } catch (error) {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setError("");
        setSelectedService("");
        setServiceSubOptions([]);
        setProjectTypes([]);
        setForm({
            name: "",
            email: "",
            phone: "",
            company: "",
            service: "",
            serviceDetail: "",
            projectType: "",
            budget: "",
            contactMethod: "",
            message: "",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            {!submitted ? (
                <div className="container mx-auto px-0 py-0">
                    <div className="grid lg:grid-cols-2 gap-0 items-stretch min-h-screen">
                        {/* Left Side - Information Section */}
                        <div className="relative lg:sticky lg:top-0 lg:h-screen flex flex-col">
                            {/* Top Purple Section */}
                            <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white p-8 lg:p-12 flex-1 flex flex-col justify-center">
                                {/* Company Name */}
                                <Link href="/" className="mb-12">
                                    <span className="text-2xl font-bold">Patel Pulse Ventures</span>
                                </Link>

                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                        Contact our sales team
                                    </h1>
                                    <p className="text-lg text-purple-100 mb-8">
                                        We're happy to answer questions and get you acquainted with Patel Pulse Ventures.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-lg">Learn how to increase team productivity</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-lg">Get pricing information</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-lg">Explore use cases for your team</span>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <p className="text-purple-200">
                                        For technical issues and general inquiries, please{" "}
                                        <Link href="/contact" className="text-white underline hover:text-purple-100">
                                            visit our Help Center
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </div>

                            {/* Bottom White Section */}
                            <div className="bg-white dark:bg-gray-900 p-8 lg:p-12 flex-1 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Incredible companies use Patel Pulse Ventures
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                                        <div className="font-medium">✓ Startups</div>
                                        <div className="font-medium">✓ Enterprises</div>
                                        <div className="font-medium">✓ E-commerce</div>
                                        <div className="font-medium">✓ Healthcare</div>
                                        <div className="font-medium">✓ Education</div>
                                        <div className="font-medium">✓ Finance</div>
                                    </div>
                                </div>

                                {/* Testimonial */}
                                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                                        "Working with Patel Pulse Ventures transformed our digital presence. Their team delivered beyond expectations."
                                    </p>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <p className="font-semibold text-gray-900 dark:text-white">Satisfied Client</p>
                                        <p>Business Owner</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form Section */}
                        <div className="w-full bg-white dark:bg-gray-900 shadow-xl rounded-none p-8 md:p-10 flex flex-col justify-center">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-primary">
                                    Let's Build Something Amazing Together 🚀
                                </h2>
                                <p className="text-muted-foreground">
                                    Tell us about your project — our team will reach out to you within 24 hours.
                                </p>
                            </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block font-medium">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="+91 9876543210"
                                />
                            </div>

                            <div>
                                <label className="block font-medium">Company/Organization</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Your Company Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">What do you need? *</label>
                            <select
                                name="service"
                                value={form.service}
                                onChange={handleServiceChange}
                                required
                                className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="">Select a service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.name}>
                                        {service.name}
                                    </option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Service Detail Dropdown - Shows when a service is selected */}
                        {serviceSubOptions.length > 0 && (
                            <div>
                                <label className="block font-medium">
                                    Specific Service Type *
                                </label>
                                <select
                                    name="serviceDetail"
                                    value={form.serviceDetail}
                                    onChange={handleServiceDetailChange}
                                    required
                                    className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">Select specific service</option>
                                    {serviceSubOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Project Type Dropdown - Shows when service detail is selected */}
                        {projectTypes.length > 0 && (
                            <div>
                                <label className="block font-medium">
                                    Project Type *
                                </label>
                                <select
                                    name="projectType"
                                    value={form.projectType}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">Select project type</option>
                                    {projectTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium">Project Budget</label>
                                <select
                                    name="budget"
                                    value={form.budget}
                                    onChange={handleChange}
                                    className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">Select budget range</option>
                                    <option value="Under ₹50,000">Under ₹50,000</option>
                                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                                    <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                                    <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                                    <option value="Above ₹5,00,000">Above ₹5,00,000</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium">Preferred Contact Method</label>
                                <select
                                    name="contactMethod"
                                    value={form.contactMethod}
                                    onChange={handleChange}
                                    className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">Select method</option>
                                    <option value="Email">Email</option>
                                    <option value="Phone">Phone Call</option>
                                    <option value="WhatsApp">WhatsApp</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">Tell us more about your project</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full mt-2 p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Describe your project goals, timeline, specific requirements..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all"
                        >
                            {loading ? "Submitting..." : "Submit Details"}
                        </button>
                    </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
                    <div className="text-center max-w-md bg-card p-10 rounded-xl shadow-lg">
                        <div className="mb-6 flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-primary mb-3">Thank You! 🎉</h2>
                        <p className="text-muted-foreground mb-6">
                            Your details have been received. Our team will contact you within 24 hours.
                        </p>
                        <button
                            onClick={handleReset}
                            className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-all"
                        >
                            Submit Another Lead
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
