"use client";

import { motion } from "framer-motion";
import { FiDatabase, FiShuffle, FiCheckCircle, FiShield, FiCpu, FiCloud } from "react-icons/fi";

const architecturalMilestones = [
  {
    phase: "Phase 1: Ingestion",
    title: "Pub/Sub Streaming",
    desc: "Buffered sensor ingestion (vibration, temp) to handle underground network dropouts.",
    icon: <FiShuffle className="text-cyan-400" />
  },
  {
    phase: "Phase 2: Transformation",
    title: "Silver Layer ELT",
    desc: "Forward-fill window functions in BigQuery to handle 5% missing data/sensor faults.",
    icon: <FiDatabase className="text-violet-400" />
  },
  {
    phase: "Phase 3: AI Alerting",
    title: "Agentic Monitoring",
    desc: "Vertex AI (Gemini 1.5 Pro) generating natural language maintenance orders.",
    icon: <FiCpu className="text-emerald-400" />
  },
  {
    phase: "Phase 4: Infrastructure",
    title: "Terraform & IaC",
    desc: "Reproducible cloud foundations ensuring 99.9% uptime for critical mining assets.",
    icon: <FiCloud className="text-amber-400" />
  }
];

export default function SystemDesign() {
  return (
    <section id="design-patterns" className="py-24 bg-slate-950 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <span className="text-cyan-500 font-mono text-sm tracking-[0.3em] font-bold">PROJECT ARCHITECTURE</span>
            <h2 className="text-5xl font-black text-white mt-4 tracking-tighter">
              Agentic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Architectures</span>
            </h2>
            <p className="text-slate-400 mt-6 text-lg">
              I specialize in end-to-end data lifecycles tailored for high-stakes industrial environments. 
              Below is the architecture for the **Sudbury Mining Predictive Maintenance Pipeline**.
            </p>
          </motion.div>
          <div className="hidden md:block h-px flex-1 bg-slate-800 mx-8 mb-4 opacity-50"></div>
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl shadow-xl"
          >
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Sudbury Mine 01 Stats</p>
            <p className="text-white font-mono text-lg font-bold">0.5s Latency | Gemini 1.5 Pro</p>
          </motion.div>
        </div>

        {/* Milestone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {architecturalMilestones.map((milestone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-slate-900/40 p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-all backdrop-blur-sm shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 text-4xl font-black text-white italic group-hover:opacity-10 transition-opacity">
                0{idx + 1}
              </div>
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-700 transition-all shadow-2xl">
                {milestone.icon}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">
                {milestone.phase}
              </span>
              <h4 className="text-xl font-bold text-white mt-2 mb-4 group-hover:text-cyan-400 transition-colors">
                {milestone.title}
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {milestone.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Technical Deep Dive Callout */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-[1px] rounded-[3rem]"
        >
          <div className="bg-slate-950 p-8 md:p-12 rounded-[2.9rem] flex flex-col lg:flex-row items-center gap-12">
             <div className="lg:w-1/3 flex justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 relative group overflow-hidden">
                   <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>
                   <FiCheckCircle className="text-cyan-500 text-6xl md:text-8xl relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
                </div>
             </div>
             <div className="lg:w-2/3">
                <h3 className="text-3xl font-bold text-white mb-6">Sudbury-Specific Constraints</h3>
                <p className="text-slate-400 leading-relaxed text-lg italic bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50">
                  "Underground mining requires zero-loss data buffering due to unreliable mesh connectivity. By utilizing Cloud Pub/Sub as an intermediate broker and implementing windowed Forward-Fill values in BigQuery, we ensure the Gemini 1.5 Pro maintenance agent always receives a complete telemetry signal, even during sensor dropouts."
                </p>
                <div className="mt-8 flex gap-4">
                   <div className="px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-cyan-400 transition-colors cursor-default">Resiliency First</div>
                   <div className="px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-cyan-400 transition-colors cursor-default">Low-Bandwidth Optimization</div>
                </div>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
