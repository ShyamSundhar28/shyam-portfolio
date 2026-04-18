"use client";

import { motion } from "framer-motion";
import { FiDatabase, FiShuffle, FiCheckCircle, FiShield, FiTrendingUp } from "react-icons/fi";

const patterns = [
  {
    icon: <FiShuffle className="text-blue-400" />,
    title: "Serverless ELT Pipelines",
    description: "Leveraging Cloud Functions and Pub/Sub for event-driven data ingestion, minimizing overhead and maximizing scalability.",
    tag: "Scalability"
  },
  {
    icon: <FiDatabase className="text-violet-400" />,
    title: "Dimensional Data Modeling",
    description: "Designing Star and Snowflake schemas in BigQuery to optimize query performance and enable intuitive BI reporting.",
    tag: "Performance"
  },
  {
    icon: <FiShield className="text-emerald-400" />,
    title: "Data Governance & IAM",
    description: "Enforcing least-privilege access and data encryption standards across enterprise-scale cloud foundations.",
    tag: "Security"
  },
  {
    icon: <FiCheckCircle className="text-amber-400" />,
    title: "Automated Data Quality",
    description: "Integrating post-load validation and dbt-driven testing to ensure reliability and trust in data assets.",
    tag: "Reliability"
  }
];

export default function SystemDesign() {
  return (
    <section id="design-patterns" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
      <div className="absolute -right-20 top-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
            Engineering <span className="text-gradient">Philosophy</span>
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            I build data systems that aren't just functional, but **resilient and observable**. My approach centers on high-fidelity automation, rigorous data modeling, and cost-effective cloud resource management.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                <FiTrendingUp className="text-blue-400 text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Scale-First Mindset</h4>
                <p className="text-slate-400 text-sm">Every architecture is designed to handle 10x today's volume with zero manual intervention.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center shrink-0">
                <FiShield className="text-violet-400 text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Observability by Default</h4>
                <p className="text-slate-400 text-sm">Logging, monitoring, and tracing are integrated from the start, not as an afterthought.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {patterns.map((item, i) => (
            <div key={item.title} className="glass-card p-8 group">
              <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 block">
                {item.tag}
              </span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
