// import React from "react";

// export default function PrivacyPolicyPage() {
//   return (
//     <main className="container mx-auto px-4 py-16 prose dark:prose-invert">
//       <h1>Privacy Policy</h1>
//       <p>Last updated: November 2025</p>

//       <p>
//         At <strong>Patel Pulse Ventures</strong>, we value your privacy and are
//         committed to protecting your personal information. This Privacy Policy
//         explains how we collect, use, and protect the data you provide when you
//         visit our website <a href="https://patelpulseventure.vercel.app">patelpulseventure.vercel.app</a>.
//       </p>

//       <h2>Information We Collect</h2>
//       <p>
//         We may collect your name, email address, and other details when you
//         subscribe to our newsletter, contact us, or use our services.
//       </p>

//       <h2>How We Use Your Information</h2>
//       <ul>
//         <li>To communicate with you about our services and updates</li>
//         <li>To improve our website and offerings</li>
//         <li>To comply with legal requirements</li>
//       </ul>

//       <h2>Cookies</h2>
//       <p>
//         Our website may use cookies to enhance user experience. You can disable
//         cookies in your browser at any time.
//       </p>

//       <h2>Contact Us</h2>
//       <p>
//         For questions about this policy, please contact us at{" "}
//         <a href="mailto:contact@patelpulseventures.com">
//           contact@patelpulseventures.com
//         </a>.
//       </p>
//     </main>
//   );
// }
"use client";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-4xl md:text-5xl font-bold text-center mb-6"
        >
          Privacy Policy
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="text-center text-gray-600 mb-12 text-lg"
        >
          At <span className="font-semibold text-gray-800">Patel Pulse Ventures</span>, 
          your privacy is our top priority. This policy outlines how we collect, 
          use, and protect your personal information.
        </motion.p>

        {/* Section 1 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          custom={2}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Patel Pulse Ventures (“we”, “our”, or “us”). We are committed to 
            protecting your privacy and ensuring that your personal information is handled 
            responsibly when you interact with our website and services.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">2. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            We may collect your name, email, phone number, company name, and service preferences 
            when you contact us or fill out a form. We also collect non-personal data like IP 
            addresses and browser information for analytics and website performance.
          </p>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={4}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">3. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            We use your information to provide and improve our services, communicate with you, 
            send updates, and fulfill contractual obligations. We may also use it for marketing 
            purposes with your consent.
          </p>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={5}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">4. Data Protection</h2>
          <p className="text-gray-700 leading-relaxed">
            We use industry-standard measures to safeguard your data from unauthorized access, 
            alteration, or destruction. While we strive for complete security, please note that 
            no online system is entirely risk-free.
          </p>
        </motion.section>

        {/* Section 5 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={6}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">5. Sharing of Information</h2>
          <p className="text-gray-700 leading-relaxed">
            We never sell or rent your data. Information may be shared only with trusted partners 
            who assist in business operations — under strict confidentiality agreements.
          </p>
        </motion.section>

        {/* Section 6 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={7}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">6. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You can request access, correction, or deletion of your personal data at any time. 
            You may also opt out of promotional emails by contacting us at 
            <strong> contact@patelpulseVentures.com</strong>.
          </p>
        </motion.section>

        {/* Section 7 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={8}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">7. Cookies & Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies to improve user experience, analyze traffic, and personalize content. 
            You can adjust your browser settings to disable cookies if you prefer.
          </p>
        </motion.section>

        {/* Section 8 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={9}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">8. Policy Updates</h2>
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy may be updated from time to time to reflect new regulations or 
            company practices. Please revisit this page periodically for the latest version.
          </p>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={10}
          className="mt-16 text-center bg-gray-100 p-8 rounded-2xl shadow-sm"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Patel Pulse Ventures</strong><br />
            OC 1125, Sector 4, Greater Noida West, Uttar Pradesh 201009, India<br />
            📞 Phone: (+91) 78381 30064<br />
            ☎️ Telephone: (+91) 120 510 6926<br />
            📧 Email: <a href="mailto:contact@patelpulseVentures.com" className="text-blue-600 underline">contact@patelpulseVentures.com</a>
          </p>
        </motion.section>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={11}
          className="text-center text-gray-500 mt-10 text-sm"
        >
          Last updated: {new Date().toLocaleDateString()}
        </motion.p>
      </div>
    </div>
  );
}

