// import React from "react";

// export default function RefundPolicyPage() {
//   return (
//     <main className="container mx-auto px-4 py-16 prose dark:prose-invert">
//       <h1>Return & Refund Policy</h1>
//       <p>Last updated: November 2025</p>

//       <p>
//         Thank you for choosing <strong>Patel Pulse Ventures</strong>. As a
//         technology and web development company, we provide digital services that
//         are non-tangible and customized for each client.
//       </p>

//       <h2>Refund Policy</h2>
//       <p>
//         Once a project has started or services have been delivered, we generally
//         cannot offer refunds. However, if a billing or service issue arises, we
//         will review it on a case-by-case basis.
//       </p>

//       <h2>Project Cancellation</h2>
//       <p>
//         Clients may request cancellation before the project kickoff. Refunds (if
//         applicable) will exclude administrative or consultation fees.
//       </p>

//       <h2>Contact Us</h2>
//       <p>
//         For refund inquiries, please reach out at{" "}
//         <a href="mailto:contact@patelpulseventures.com">
//           contact@patelpulseventures.com
//         </a>.
//       </p>
//     </main>
//   );
// }

"use client";
import { motion } from "framer-motion";

export default function RefundPolicyPage() {
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
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-4xl md:text-5xl font-bold text-center mb-6"
        >
          Refund & Return Policy
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="text-center text-gray-600 mb-12 text-lg"
        >
          At <span className="font-semibold">Patel Pulse Ventures</span>, we value your satisfaction and stand by the quality of our digital products and services.
        </motion.p>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">1. Refund Eligibility</h2>
          <p className="text-gray-700 leading-relaxed">
            Refunds are applicable only for specific services and under certain conditions, such as:
            <ul className="list-disc pl-6 mt-2">
              <li>Project cancellation before work commencement</li>
              <li>Duplicate payment made by mistake</li>
              <li>Failure to deliver within agreed timelines (if not caused by client delays)</li>
            </ul>
          </p>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" variants={fadeUp} custom={3} className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">2. Non-Refundable Services</h2>
          <p className="text-gray-700 leading-relaxed">
            Due to the nature of digital and creative services, certain projects such as custom development, marketing campaigns, or branding are non-refundable once initiated.
          </p>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" variants={fadeUp} custom={4} className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">3. Refund Process</h2>
          <p className="text-gray-700 leading-relaxed">
            To request a refund, email us at <strong>contact@patelpulseVentures.com</strong> within 7 days of purchase. Approved refunds will be processed within 10–15 business days.
          </p>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" variants={fadeUp} custom={5} className="text-center bg-gray-100 p-8 rounded-2xl shadow-sm mt-12">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            📍 OC 1125, Sector 4, Greater Noida West, Uttar Pradesh 201009, India<br />
            📞 (+91) 78381 30064<br />
            ☎️ (+91) 120 510 6926<br />
            📧 <a href="mailto:contact@patelpulseVentures.com" className="text-blue-600 underline">contact@patelpulseVentures.com</a>
          </p>
        </motion.section>
      </div>
    </div>
  );
}
