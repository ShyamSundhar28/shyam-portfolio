"use client";

import { motion } from "framer-motion";

const skills = [
  { category: "Cloud Providers", items: ["AWS", "Google Cloud", "Microsoft Azure"] },
  { category: "Infrastructure as Code", items: ["Terraform", "CloudFormation", "Ansible"] },
  { category: "Containerization", items: ["Docker", "Kubernetes", "EKS/GKE"] },
  { category: "CI/CD & DevOps", items: ["GitHub Actions", "Jenkins", "GitLab CI"] },
  { category: "Frontend & Full-Stack", items: ["Next.js", "React", "Node.js", "Firebase App Hosting"] },
  { category: "Architecture Patterns", items: ["Serverless", "Microservices", "Event-Driven"] },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Core <span className="text-gradient">Competencies</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Equipped with advanced tools and methodologies to engineer resilient, scalable, securely decoupled systems.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skillGroup, idx) => (
          <motion.div
            key={skillGroup.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-panel p-8 rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-6 text-blue-400 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-sm">✦</span>
              {skillGroup.category}
            </h3>
            <ul className="space-y-3">
              {skillGroup.items.map(item => (
                <li key={item} className="flex items-center text-slate-300 font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mr-3" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
