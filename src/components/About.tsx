"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-5xl mx-auto relative">
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-10 md:p-14 rounded-3xl"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          About <span className="text-gradient">Me</span>
        </h2>
        
        <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
          <p>
            I am a Master&apos;s student in Computational Science with a background in computer science and professional experience in data engineering. My interests lie at the intersection of cloud computing, data engineering, AI/ML systems, and real-world software products. 
          </p>
          <p>
            I have built projects involving AI-powered content generation, inventory management, emotion recognition, and network forensics, and I enjoy designing end-to-end systems that combine cloud services, intelligent workflows, and practical user needs.
          </p>
          <p>
            My technical strengths include Google Cloud data engineering services, AWS cloud-native architecture, Python-based automation, Angular full-stack development, cloud databases, and AI workflow integration. I am an iterative builder and practical problem solver, especially interested in building scalable data and AI systems that orchestrate real operational workflows.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
