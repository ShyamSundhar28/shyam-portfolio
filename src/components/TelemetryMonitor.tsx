"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiTruck, FiThermometer, FiSend, FiCheckCircle, FiCpu, FiCloud, FiBarChart2, FiAlertTriangle } from "react-icons/fi";

export default function TelemetryMonitor() {
  const [vehicleId, setVehicleId] = useState("");
  const [temp, setTemp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const formData = new FormData();
      formData.append("vehicle_id", vehicleId);
      formData.append("temp", temp);

      const res = await fetch("/api/trigger-alert", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setVehicleId("");
        setTemp("");
        // Reset after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error(data.error || "Failed to publish event");
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <section id="telemetry-monitor" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left: Interactive Simulation */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2 w-full"
        >
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
               Serverless Intelligent <span className="text-gradient">Telemetry Monitor</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Bridging the gap between raw data engineering and real-time AI decision-making. 
              Simulate a fleet event below to trigger a live ingestion pipeline.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FiTruck className="text-blue-400" /> Simulate a Vehicle Event
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Vehicle ID</label>
                  <div className="relative">
                    <FiTruck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      placeholder="e.g. TRUCK-001" 
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 transition-colors outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Engine Temp (°C)</label>
                  <div className="relative">
                    <FiThermometer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="number" 
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      placeholder="e.g. 95" 
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 transition-colors outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === "loading"}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  status === "loading" ? "bg-slate-700 opacity-50" : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                }`}
              >
                {status === "loading" ? <><FiCpu className="animate-spin" /> Publishing...</> : <><FiSend /> Publish to Pipeline</>}
              </button>

              {status === "success" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3 mt-4"
                >
                  <FiCheckCircle className="text-emerald-400 mt-1 shrink-0" />
                  <p className="text-emerald-200 text-sm leading-relaxed">{message}</p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 mt-4"
                >
                  <FiAlertTriangle className="text-red-400 mt-1 shrink-0" />
                  <p className="text-red-200 text-sm leading-relaxed">{message}</p>
                </motion.div>
              )}
            </form>
          </div>

          {/* Architecture Visual */}
          <div className="mt-12">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Real-Time Data Architecture</h4>
            <div className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-between">
              {[
                { icon: <FiCloud />, label: "Cloud Run", role: "Ingestion" },
                { icon: <FiSend />, label: "Pub/Sub", role: "Transport" },
                { icon: <FiCpu />, label: "Functions", role: "Intelligence" },
                { icon: <FiBarChart2 />, label: "Looker Studio", role: "Visibility" },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center text-2xl text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all">
                    {step.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-white mb-0.5">{step.label}</p>
                    <p className="text-[10px] uppercase tracking-tighter text-slate-500">{step.role}</p>
                  </div>
                  {i < 3 && <div className="hidden md:block absolute translate-x-12 text-slate-700">→</div>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Visionary Insights / Live Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2 w-full flex flex-col h-full"
        >
          <div className="glass-panel p-2 rounded-[2.5rem] overflow-hidden h-full flex flex-col min-h-[500px]">
             {/* Looker Studio Embed Placeholder */}
             <div className="flex-grow bg-slate-950/50 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center border border-slate-800/50">
                <FiBarChart2 className="text-6xl text-slate-800 mb-4" />
                <h3 className="text-xl font-bold text-slate-400 mb-2">Live Fleet Dashboard</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Your real-time Looker Studio report will appear here once you embed the iframe.
                </p>
                <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700 text-[10px] font-mono text-slate-600">
                  {/* The USER will paste the <iframe> here */}
                  &lt;!-- PASTE LOOKER STUDIO IFRAME HERE --&gt;
                </div>
             </div>
             
             <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Global Data Stream Active</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Every submission is processed in sub-seconds. The AI Cloud Function evaluates engine temperature thresholds and flags anomalies to BigQuery for immediate visualization.
                </p>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
