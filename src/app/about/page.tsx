

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
  }),
};

const services = [
  {
    title: "Product Strategy & Advisory",
    desc: "CX research, product roadmaps, and investment-ready documentation for founders.",
  },
  {
    title: "Web & Mobile Engineering",
    desc: "Modern web apps, mobile products, and cloud-native platforms optimized for scale.",
  },
  {
    title: "Brand & Experience Design",
    desc: "Immersive UI/UX, brand systems, and content frameworks that accelerate trust.",
  },
  {
    title: "Growth & GTM Pods",
    desc: "Performance marketing, automation, and CRM journeys that translate to revenue.",
  },
];

const milestones = [
  { year: "2021", label: "Founded in Greater Noida with a two-member team." },
  { year: "2022", label: "Launched flagship web & mobile labs, 30+ client releases." },
  { year: "2023", label: "Expanded to marketing automation and AI-led analytics." },
  { year: "2024", label: "Crossed 120 projects and incorporated as Patel Pulse Ventures Pvt. Ltd." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <p className="uppercase tracking-[0.4em] text-sm text-primary/80 mb-4">About Us</p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-primary mb-6">
              We design technology that feels human, scalable, and unmistakably premium.
            </h1>
            <p className="text-lg text-gray-600">
              Patel Pulse Ventures is a full-stack digital studio based in Greater Noida. We blend
              consulting, engineering, and creative energy to help ambitious companies launch new
              ventures, modernize legacy stacks, and unlock growth across web, mobile, and emerging tech.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                { label: "Products shipped", value: "120+" },
                { label: "Active clients", value: "45" },
                { label: "Retention", value: "92%" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i + 1}
                  className="rounded-2xl bg-white shadow-md px-4 py-5"
                >
                  <p className="text-3xl font-bold text-primary">{item.value}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/40">
              <Image
                src="/about-team.jpg"
                alt="Team collaborating"
                width={900}
                height={600}
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={0}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-primary">Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Deliver enterprise-grade craftsmanship to founders, SMEs, and Fortune 500s alike. We align
              user empathy, experimentation, and engineering discipline to release lovable products faster.
            </p>
            <h2 className="text-3xl font-bold text-primary">Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              Build an ecosystem where Indian talent, design thinking, and cutting-edge research converge
              to power the next generation of global digital businesses.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={1}
            className="rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 p-10 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-primary mb-4">What makes us different?</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary">●</span>
                <span>Product-minded team that codes, designs, and thinks business-first.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">●</span>
                <span>Modular delivery pods for discovery, build, growth, and support.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">●</span>
                <span>Transparent communication, sprint reviews, and measurable ROI.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-sm uppercase tracking-[0.4em] text-primary/70"
          >
            Services
          </motion.p>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-4xl font-bold text-primary mt-4 mb-4"
          >
            What we ship from Greater Noida to the world
          </motion.h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            From discovery workshops to multi-year managed squads, we co-create digital experiences that
            compound value for SaaS, fintech, retail, healthcare, and manufacturing partners.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={index}
              className="rounded-2xl bg-white shadow-lg p-6 text-left border border-gray-100"
            >
              <p className="text-sm font-semibold text-primary tracking-wide mb-2">0{index + 1}</p>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl font-bold text-primary text-center mb-12"
          >
            Growth Milestones
          </motion.h2>
          <div className="relative pl-6 border-l-2 border-primary/20 space-y-10">
            {milestones.map((item, index) => (
              <motion.div
                key={item.year}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index}
                className="bg-gray-50 rounded-2xl p-6 shadow-sm"
              >
                <p className="text-primary font-semibold text-lg">{item.year}</p>
                <p className="text-gray-700 mt-2">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership highlight */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-primary/5 via-white to-primary/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">Leadership & Culture</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We are a tight-knit crew of strategists, engineers, and creatives who have shipped multi-market
              experiences for unicorns and early-stage startups alike. Every squad inside Patel Pulse Ventures
              is multidisciplinary and accountable, which keeps projects nimble without sacrificing rigor.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>✔ Cross-functional pods with dedicated delivery leads</li>
              <li>✔ ISO-inspired processes for quality and security</li>
              <li>✔ Mentorship programs and innovation guilds for R&D</li>
            </ul>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="rounded-3xl bg-white shadow-2xl p-8 border border-primary/10"
          >
            <p className="text-xl font-semibold mb-2">“We measure success in adoption, revenue, and relationships—not vanity metrics.”</p>
            <p className="text-sm uppercase tracking-wide text-gray-500">Leadership message</p>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 md:px-12 bg-primary/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-4xl mx-auto text-center bg-white rounded-[32px] shadow-xl p-10 border border-primary/10"
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
        </motion.div>
      </section>
    </main>
  );
}
