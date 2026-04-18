"use client";

import { motion } from "framer-motion";

const skills = [
  { category: "Cloud & Architecture", items: ["GCP (Certified)", "AWS", "Large-scale System Design", "Serverless Architecture", "IAM & VPC Networking", "Terraform (IaC)", "Cloud Build", "Docker & Kubernetes (GKE)"] },
  { category: "Data Engineering", items: ["SQL (Performance Tuning)", "Data Modeling (Star/Snowflake)", "ELT / ETL Pipelines", "dbt (Data Build Tool)", "Apache Airflow (Cloud Composer)", "Apache Spark (PySpark/Dataproc)", "Pub/Sub Streaming"] },
  { category: "Databases & Storage", items: ["BigQuery", "DynamoDB", "Cloud Spanner", "Bigtable", "Cloud SQL / Postgres", "Firestore / Firebase", "Cloud Storage (GCS)"] },
  { category: "AI & ML Engineering", items: ["Vertex AI", "BigQuery ML", "GenAI (Gemini/Hugging Face)", "Prompt Engineering", "NLP Pipelines", "RAG Architecutre"] },
  { category: "Programming & Frameworks", items: ["Python", "TypeScript", "Next.js", "FastAPI / Flask", "Streamlit", "Framer Motion"] },
  { category: "Observability & Quality", items: ["Data Validation", "Logging & Error Handling", "Performance Optimization", "Data Lineage Tracking"] },
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
          Combining academic theory, real-world operational understanding, and intensive cloud-engineering capabilities to build intelligent scalable systems.
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
            className="glass-panel p-8 rounded-2xl hover:border-blue-500/30 transition-colors"
          >
            <h3 className="text-xl font-bold mb-6 text-blue-400 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-sm">✦</span>
              {skillGroup.category}
            </h3>
            <ul className="space-y-3">
              {skillGroup.items.map(item => (
                <li key={item} className="flex items-center text-slate-300 tracking-wide text-[0.95rem]">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mr-3 shrink-0" />
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
