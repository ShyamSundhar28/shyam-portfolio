"use client";

import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";

const projects = [
  {
    title: "Automated YouTube Shorts Generator",
    description: "End-to-end AI-powered Python application that transforms trending topics into 60-second shorts. Retrieves content, summarizes via TF-IDF/BART, detects emotional tone, generates scene-based image prompts, synthesizes TTS narration, and assembles via MoviePy/FFmpeg.",
    tags: ["Python", "NLP", "Hugging Face", "MoviePy", "TTS"],
    link: "/youtube-shorts",
    github: "#"
  },
  {
    title: "Food Bank Inventory System",
    description: "Cloud-based inventory management application built for warehouse-style workflows. Features product categorization, case/unit tracking, authentication, and stock update logic using Angular, Firebase, and AWS architectures.",
    tags: ["Angular", "Firebase", "AWS Cognito", "DynamoDB"],
    link: "#",
    github: "#"
  },
  {
    title: "Agentic AI Dashboard",
    description: "Multi-agent AI dashboard engineered in Python and Streamlit where specialized intelligent agents collaborate to handle data ingestion, automated analysis, and visualization tasks.",
    tags: ["Python", "Streamlit", "Agentic AI", "Data Analytics"],
    link: "/agentic-dashboard",
    github: "#"
  },
  {
    title: "Speech Emotion Recognition",
    description: "Machine learning workflow classifying emotions from human voice data. Integrated the prediction model into an AI media generation pipeline to influence narration tone and visual prompts.",
    tags: ["Machine Learning", "Audio Processing", "Classification"],
    link: "#",
    github: "#"
  },
  {
    title: "Forensic DDoS Detection",
    description: "Network forensics project detecting DDoS attack patterns using Wireshark, traffic graphs, and anomaly interpretation. Supported with Python PCAP parsing and threshold-based detection.",
    tags: ["Cybersecurity", "Wireshark", "Network Forensics", "Python"],
    link: "#",
    github: "#"
  },
  {
    title: "Accessible Exam System",
    description: "Inclusive online examination platform designed specifically for visually impaired users. Emphasizes accessibility, usability in educational technology, and assistive design principles.",
    tags: ["Accessibility", "EdTech", "Inclusive Design"],
    link: "#",
    github: "#"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl">
          A selection of challenging engineering solutions, AI-driven automation systems, and high-impact applications I&apos;ve designed and delivered.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-8 flex flex-col h-full group"
          >
            <div className="flex justify-between items-start mb-6 text-slate-300">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div className="flex gap-4">
                <a href={project.github} className="hover:text-white transition-colors"><FiGithub size={20} /></a>
                <a href={project.link} className="hover:text-blue-400 transition-colors"><FiExternalLink size={20} /></a>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">{project.title}</h3>
            <p className="text-slate-400 mb-8 flex-grow leading-relaxed text-sm">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs font-mono tracking-wider px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/50 text-blue-200">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
