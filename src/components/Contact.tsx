"use client";

import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiMessageSquare } from "react-icons/fi";

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -z-10" />

        <div className="inline-flex items-center justify-center p-4 bg-slate-800/80 rounded-2xl mb-8 border border-slate-700/50 shadow-xl">
          <FiMessageSquare className="text-4xl text-blue-400" />
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Ready to Elevate Your <br className="hidden md:block" /> <span className="text-gradient">Cloud Infrastructure?</span>
        </h2>
        
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Whether you need a complete architectural overhaul, cost optimization, or highly available deployment strategies, I can help you achieve operational excellence.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="mailto:shyamsundhar432@gmail.com"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-blue-600 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.5)] w-full sm:w-auto"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-violet-600 group-hover:opacity-80 transition-opacity"></span>
            <span className="relative flex items-center gap-2">
              <FiMail className="text-xl" /> Send me an Email
            </span>
          </a>
        </div>
        
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 text-slate-400">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-blue-400" /> Based globally, architecting for the cloud
          </div>
        </div>
      </motion.div>
    </section>
  );
}
