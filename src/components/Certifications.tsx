"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const certifications = [
  {
    title: "Professional Data Engineer",
    issuer: "Google Cloud",
    date: "April 2026",
    id: "61554",
    image: "/certs/pde.png",
    verifyLink: "https://www.credly.com/earner/earned/badge/0525c925-7721-4e5e-a76c-bab273c72284",
    description: "Demonstrates ability to design, build, and operationalize data processing systems and machine learning models."
  },
  {
    title: "Associate Cloud Engineer",
    issuer: "Google Cloud",
    date: "April 2022",
    id: "54309",
    image: "/certs/ace.png",
    verifyLink: "https://www.credly.com/earner/earned/badge/27e876bc-1b89-4f0c-a7a5-14de16e3063a",
    description: "Evaluated competency in deploying applications, monitoring operations, and managing enterprise solutions."
  }
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Professional <span className="text-gradient">Certifications</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Industry-validated expertise in cloud architecture, data engineering, and AI systems.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="glass-panel rounded-3xl overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image 
                src={cert.image} 
                alt={cert.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
              <div className="absolute bottom-6 left-8 right-8">
                 <span className="bg-blue-600/80 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                   {cert.issuer}
                 </span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-slate-400 text-sm font-mono">ID: {cert.id} • Issued: {cert.date}</p>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed">
                {cert.description}
              </p>
              
              <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">GC</div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">☁️</div>
                </div>
                <a 
                  href={cert.verifyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm font-semibold hover:text-blue-300 flex items-center gap-2 transition-colors"
                >
                  Verify Credentials
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
