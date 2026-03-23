"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiLinkedin, FiMail, FiPhone } from "react-icons/fi";

const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
} as any;

const itemVars = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } },
} as any;

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto text-center z-10"
      >
        <motion.div variants={itemVars} className="mb-6 flex flex-wrap justify-center gap-3">
          <span className="inline-flex border border-blue-500/30 bg-blue-500/10 rounded-full px-4 py-1.5 backdrop-blur-md text-sm font-medium text-blue-300 items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Ontario, Canada (Open to Mississauga)
          </span>
          <span className="inline-flex border border-emerald-500/30 bg-emerald-500/10 rounded-full px-4 py-1.5 backdrop-blur-md text-sm font-medium text-emerald-300 items-center gap-2">
            Former Accenture Data & AI Engineer
          </span>
        </motion.div>
        
        <motion.h1 variants={itemVars} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Hi, I&apos;m <span className="text-gradient">Shyam Sundhar</span>
          <br className="hidden md:block" /> AI & Data Engineer
        </motion.h1>
        
        <motion.p variants={itemVars} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          I spent 3 years at Accenture building scalable Google Cloud architectures. Now completing my Master&apos;s in Computational Science, specializing in Generative AI, Data Mining, and Cloud engineering.
        </motion.p>
        
        <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="#projects" className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center">
            View My Work <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#contact" className="glass-panel px-8 py-3.5 rounded-full font-bold hover:bg-slate-800 transition-colors bg-slate-800/50 w-full sm:w-auto justify-center text-center">
            Contact Me
          </a>
        </motion.div>

        <motion.div variants={itemVars} className="flex items-center justify-center gap-6">
          <a href="https://linkedin.com/in/shyam-sundhar-03664b1ab" target="_blank" rel="noreferrer" className="p-3 bg-slate-800/50 rounded-full text-slate-300 hover:text-blue-400 hover:bg-slate-700 transition-colors">
            <FiLinkedin size={24} />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a href="tel:+12498797974" className="p-3 bg-slate-800/50 rounded-full text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors">
            <FiPhone size={24} />
            <span className="sr-only">Phone</span>
          </a>
          <a href="mailto:shyamsundhar432@gmail.com" className="p-3 bg-slate-800/50 rounded-full text-slate-300 hover:text-violet-400 hover:bg-slate-700 transition-colors">
            <FiMail size={24} />
            <span className="sr-only">Email</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
