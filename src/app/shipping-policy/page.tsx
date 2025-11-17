"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "Shipping Scope",
    body:
      "Patel Pulse Ventures delivers digital products, credentials, and onboarding kits via email, secure portals, or collaboration suites. Physical merch or documents, when applicable, are dispatched through trusted courier partners across India.",
  },
  {
    title: "Digital Delivery Timelines",
    body:
      "Access links and credentials for software or strategy decks are typically shared within 24-48 hours of payment confirmation unless a custom onboarding schedule is communicated in your agreement.",
  },
  {
    title: "Physical Dispatches",
    body:
      "Brand kits, marketing collateral, or hardware add-ons (if included) are shipped within 5-7 business days. Tracking IDs are emailed as soon as the courier picks up the parcel.",
  },
  {
    title: "Shipping Fees",
    body:
      "Digital deliveries carry no shipping fee. Physical shipments within India may attract an additional logistics fee which will be mentioned on the invoice or proposal.",
  },
  {
    title: "Delays & Escalations",
    body:
      "Unexpected delays due to courier disruptions, regional restrictions, or force majeure events will be communicated proactively. For urgent escalations, please reach out to our support desk with your order ID.",
  },
  {
    title: "International Clients",
    body:
      "International digital deliveries follow the same cadence. For physical shipments outside India, customs duties and import taxes are borne by the recipient.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="uppercase tracking-[0.4em] text-sm text-primary/80 mb-3">Policy</p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Shipping & Delivery Policy</h1>
          <p className="text-gray-600">Last updated: November 2025</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
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
          <div className="space-y-2 text-gray-700 leading-relaxed">
            <p>Patel Pulse Ventures</p>
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
