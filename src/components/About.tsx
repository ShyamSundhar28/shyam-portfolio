"use client";

import { motion } from "framer-motion";
import { FiBriefcase, FiBookOpen, FiBox } from "react-icons/fi";

const milestones = [
  {
    icon: <FiBriefcase className="text-blue-400 text-2xl" />,
    title: "3 Years Data Engineering",
    subtitle: "Chennai, India",
    description: "Built scalable data workflows and gained deep enterprise experience as a Data Engineering Associate & Analyst.",
    color: "group-hover:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20"
  },
  {
    icon: <FiBookOpen className="text-violet-400 text-2xl" />,
    title: "MSc Computational Science",
    subtitle: "Laurentian University (Exp. April 2026)",
    description: "Specializing in cloud architecture, AI systems, and technical research with a heavy focus on Google Cloud & AWS.",
    color: "group-hover:text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20"
  },
  {
    icon: <FiBox className="text-emerald-400 text-2xl" />,
    title: "Real-World Operations",
    subtitle: "Warehouse Associate",
    description: "Hands-on logistics and inventory flow experience, allowing me to build software rooted in actual operational efficiency.",
    color: "group-hover:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20"
  }
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 md:text-center"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          About <span className="text-gradient">Me</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          I bridge the gap between complex <span className="text-white font-semibold">AI/Cloud engineering</span> and <span className="text-white font-semibold">real-world application</span>. With a solid foundation in computer science and robust professional data engineering experience, I design scalable, intelligent systems.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {milestones.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-8 group flex flex-col"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 transition-all ${item.bg}`}>
              {item.icon}
            </div>
            <h3 className={`text-2xl font-bold mb-2 text-white transition-colors ${item.color}`}>
              {item.title}
            </h3>
            <p className="text-xs font-mono tracking-wider text-slate-400 mb-4 uppercase">
              {item.subtitle}
            </p>
            <p className="text-slate-300 leading-relaxed flex-grow">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
