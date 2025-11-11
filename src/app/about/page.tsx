// "use client";

// import React from "react";

// export default function AboutPage() {
//   return (
//     <main className="container mx-auto px-4 py-16 prose dark:prose-invert">
//       <h1>About Patel Pulse Ventures</h1>
//       <p>
//         At <strong>Patel Pulse Ventures</strong>, we believe technology has the power to transform
//         businesses, drive growth, and create meaningful impact. Based in Greater Noida, Uttar Pradesh,
//         we are a passionate team of engineers, designers, and strategists committed to delivering
//         world-class digital solutions for web, mobile and cloud platforms.
//       </p>

//       <h2>Our Story</h2>
//       <p>
//         Founded in 2021, our journey began with a simple idea: make enterprise-grade
//         digital technology accessible to small and medium businesses across India and beyond.
//         What started as a two-person start-up rapidly expanded into a multi-disciplinary team,
//         serving clients in e-commerce, SaaS, app-development, and IoT. We incorporated
//         as “Patel Pulse Ventures Private Limited” (CIN: U73100UP2025PTC235660) based in
//         Greater Noida.
//       </p>

//       <h2>What We Do</h2>
//       <ul>
//         <li>Web & Mobile Application Development: From idea to launch, we build robust and scalable solutions.</li>
//         <li>Digital Transformation: We help businesses adopt the latest tech – AI, blockchain, IoT – to stay ahead.</li>
//         <li>Custom Software Solutions: Tailor-made applications to address your unique business challenges.</li>
//         <li>Maintenance & Support: We don’t just build it—we support it. We help you grow, scale, and evolve.</li>
//       </ul>

//       <h2>Our Mission & Values</h2>
//       <p>
//         <strong>Mission:</strong> Empower businesses with cutting-edge technology that drives innovation, efficiency and growth.<br/>
//         <strong>Values:</strong> Integrity, Excellence, Collaboration and Customer-centric innovation.
//       </p>

//       <h2>Why Choose Us?</h2>
//       <p>
//         • Proven team and fresh ideas<br/>
//         • Transparent processes & timely delivery<br/>
//         • Commitment to quality and performance<br/>
//         • Post-launch support and long-term partnership
//       </p>

//       <h2>Meet the Team</h2>
//       <p>
//         Our team is a blend of young innovators and experienced professionals who bring
//         cross-industry expertise in software, design, and business. Because we understand
//         both technology and the market.
//       </p>

//       <h2>Contact Us</h2>
//       <p>
//         Let’s bring your next digital idea to life. Reach out at{" "}
//         <a href="mailto:contact@patelpulseventures.com">
//           contact@patelpulseventures.com
//         </a> or visit our <a href="/contact">Contact Page</a>.
//       </p>
//     </main>
//   );
// }

"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold text-primary mb-4"
        >
          About Patel Pulse Ventures
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-2xl mx-auto text-lg text-gray-600"
        >
          At Patel Pulse Ventures, we are dedicated to driving digital transformation through innovative
          web development, mobile app solutions, and strategic digital marketing.
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <Image
            src="/about-team.jpg"
            alt="Patel Pulse Ventures Team"
            width={700}
            height={400}
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to empower businesses by crafting impactful digital experiences that drive
              growth and engagement. From startups to enterprises, we tailor digital strategies that
              resonate with audiences and create long-lasting impact.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/mission.jpg"
              alt="Our Mission"
              width={550}
              height={350}
              className="rounded-2xl shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-br from-primary/5 to-primary/10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold mb-6"
        >
          Get in Touch
        </motion.h2>
        <p className="text-lg text-gray-700">
          📍 OC 1125, Sector 4, Greater Noida West, Uttar Pradesh 201009, India
        </p>
        <p className="mt-2 text-gray-700">📞 (+91) 78381 30064 | ☎️ (+91) 120 510 6926</p>
        <p className="mt-2 text-gray-700">
          📧{" "}
          <a
            href="mailto:contact@patelpulseVentures.com"
            className="text-primary hover:underline"
          >
            contact@patelpulseVentures.com
          </a>
        </p>
      </section>
    </main>
  );
}
