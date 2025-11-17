
"use client";
import { motion } from "framer-motion";

const sections = [
  {
    heading: "Scope of Policy",
    body:
      "This Refund & Return Policy applies to all digital services, software subscriptions, and consulting retainers delivered by Patel Pulse Ventures. Custom Statements of Work may supersede some clauses when signed by both parties.",
  },
  {
    heading: "Eligibility for Refunds",
    body:
      "Refunds may be approved when a project is cancelled before delivery begins, when duplicate payments are detected, or when we fail to meet a contractual milestone for reasons within our control.",
    list: [
      "Project cancellation requested before kickoff",
      "Duplicate or accidental payment settled via same payment method",
      "Inability to deliver agreed scope despite client approvals",
    ],
  },
  {
    heading: "Non-Refundable Items",
    body:
      "Discovery workshops, consumed consulting hours, third-party licenses purchased on your behalf, and bespoke creative or code assets that have already been shared are non-refundable.",
  },
  {
    heading: "How to Request a Refund",
    body:
      "Please email contact@patelpulseVentures.com within 7 calendar days of the invoice or milestone date. Include your company name, project reference, payment ID, and a short description. Approved refunds are processed within 10–15 business days to the original payment method.",
  },
  {
    heading: "Partial Deliverables & Credits",
    body:
      "If part of the work is accepted, we may issue pro-rated credits for the remaining scope. Credits can be applied to future sprints, support retainers, or marketing programs within six months.",
  },
  {
    heading: "Policy Updates",
    body:
      "We reserve the right to revise this policy at any time. The latest version will always be available on our website. Continued use of our services constitutes acceptance of the updated terms.",
  },
];

export default function RefundPolicyPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-center mb-12"
        >
          <p className="uppercase tracking-[0.4em] text-sm text-primary/80 mb-3">Policy</p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Refund & Return Policy</h1>
          <p className="text-gray-600">Last updated: November 2025</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.heading}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={index + 1}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-primary mb-3">{section.heading}</h2>
              <p className="text-gray-700 leading-relaxed">{section.body}</p>
              {section.list && (
                <ul className="list-disc pl-6 mt-4 space-y-1 text-gray-700">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={sections.length + 2}
          className="text-center bg-gray-100 p-10 rounded-[32px] shadow-sm mt-12"
        >
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <div className="space-y-2 text-gray-700 leading-relaxed">
            <p>Patel Pulse Ventures</p>
            <p>OC 1125, Sector 4, Greater Noida West, Uttar Pradesh 201009, India</p>
            <p>📞 Phone: (+91) 78381 30064</p>
            <p>☎️ Telephone: (+91) 120 510 6926</p>
            <p>
              📧 Email: <a href="mailto:contact@patelpulseVentures.com" className="text-blue-600 underline">contact@patelpulseVentures.com</a>
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
