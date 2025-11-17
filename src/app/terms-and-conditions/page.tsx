"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "Acceptance of Terms",
    body:
      "By accessing Patel Pulse Ventures websites, portals, or services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, please refrain from using our platforms.",
  },
  {
    title: "Scope of Services",
    body:
      "We provide consulting, digital product development, marketing, and managed services. Statements of Work, proposals, or order forms define deliverables, payment schedules, acceptance criteria, and handover obligations for each engagement.",
  },
  {
    title: "User Responsibilities",
    body:
      "Clients agree to supply accurate information, approvals, and assets on time. You will not upload malicious code, violate intellectual property rights, or use our services for unlawful activity. Any third-party software licenses required for your project remain your responsibility.",
  },
  {
    title: "Intellectual Property",
    body:
      "Unless otherwise stated in a signed agreement, Patel Pulse Ventures retains ownership of methodologies, templates, and reusable IP created during delivery. Once invoices are cleared, the final bespoke assets delivered to you become your property.",
  },
  {
    title: "Payments & Invoices",
    body:
      "All invoices are payable as per the schedule mentioned in the proposal. Late payments may attract finance charges or temporary suspension of services. Taxes and government levies are additional unless explicitly included.",
  },
  {
    title: "Confidentiality",
    body:
      "Both parties shall protect each other's confidential information and use it solely for the engagement. We may showcase anonymized project outcomes in our portfolio unless restricted by NDA.",
  },
  {
    title: "Limitation of Liability",
    body:
      "To the maximum extent permitted by law, Patel Pulse Ventures will not be liable for indirect, incidental, or consequential damages. Aggregate liability will not exceed the fees paid for the specific service giving rise to the claim.",
  },
  {
    title: "Term, Termination & Changes",
    body:
      "We may modify these Terms with notice by updating this page. Either party may terminate an engagement per the contract by providing written notice. Sections on IP, confidentiality, and payments survive termination.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="uppercase tracking-[0.4em] text-sm text-primary/80 mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: November 2025</p>
        </motion.div>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-primary mb-3">{section.title}</h2>
              <p className="text-gray-700 leading-relaxed">{section.body}</p>
            </motion.section>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center bg-primary/5 border border-primary/10 rounded-[32px] p-10"
        >
          <h2 className="text-3xl font-bold text-primary mb-4">Contact Us</h2>
          <p className="text-sm uppercase tracking-[0.4em] text-gray-500 mb-6">Patel Pulse Ventures</p>
          <div className="space-y-2 text-gray-700 leading-relaxed">
            <p>OC 1125, Sector 4, Greater Noida West, Uttar Pradesh 201009, India</p>
            <p>📞 Phone: (+91) 78381 30064</p>
            <p>☎️ Telephone: (+91) 120 510 6926</p>
            <p>
              📧 Email: <a href="mailto:contact@patelpulseVentures.com" className="text-primary font-semibold">contact@patelpulseVentures.com</a>
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
