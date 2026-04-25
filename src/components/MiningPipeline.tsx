"use client";

import React, { useState } from 'react';
import { Upload, Cpu, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const MiningPipeline = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [pipelineStep, setPipelineStep] = useState(0); // 0: Idle, 1: Ingesting, 2: Transforming, 3: AI Analyzing, 4: Complete
  const [alerts, setAlerts] = useState<any[]>([]);

  // Simulated AI responses for the dynamic demo
  const mockAlerts = [
    { 
      id: 1, 
      machine: 'Drill Rig DR-001', 
      reason: 'Critical vibration detected (>3 StdDev) by Silver Layer analysis.', 
      fix: 'Gemini Order: Schedule immediate bearing replacement and realignment in Section 4.' 
    },
    { 
      id: 2, 
      machine: 'Haul Truck HT-05', 
      reason: 'Missing sensor heartbeat (Forward Fill auto-applied). Abnormal thermal trend.', 
      fix: 'Gemini Order: Inspect hydraulic lines for micro-leaks and flush radiator.' 
    }
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFileName(file.name);
    setIsUploading(true);
    setPipelineStep(1);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim() !== '').slice(1);
      
      let sumVib = 0, sumTemp = 0, count = 0;
      rows.forEach(row => {
        const columns = row.split(',');
        if (columns.length >= 3) {
          sumVib += parseFloat(columns[1]) || 0;
          sumTemp += parseFloat(columns[2]) || 0;
          count++;
        }
      });

      const avgVib = sumVib / count;
      const avgTemp = sumTemp / count;

      // Deterministic Health Score based on real data
      // High vibration and high temp reduce the score
      const baseScore = 100 - ((avgVib - 30) * 0.8 + (avgTemp - 50) * 0.6);
      const finalScore = Math.max(15, Math.min(98, Math.floor(baseScore)));

      // Logic-based alerts from the actual data
      const finalAlerts: any[] = [];
      if (avgVib > 45) {
        finalAlerts.push({
          id: 1,
          machine: 'Asset: SUDBURY-DR-01',
          reason: `High Average Vibration (${avgVib.toFixed(1)}Hz) detected in logs.`,
          fix: 'Gemini Recommendation: Immediate bearing inspection and realignment required.'
        });
      }
      if (avgTemp > 70) {
        finalAlerts.push({
          id: 2,
          machine: 'Asset: SUDBURY-HT-05',
          reason: `Abnormal Thermal Trend (${avgTemp.toFixed(1)}°C) exceeding safety thresholds.`,
          fix: 'Gemini Recommendation: Flush cooling system and check hydraulic pressure levels.'
        });
      }

      // Simulate the Pipeline Life Cycle with the calculated results
      setTimeout(() => setPipelineStep(2), 1500);
      setTimeout(() => setPipelineStep(3), 3000);
      setTimeout(() => {
        setPipelineStep(4);
        setHealthScore(finalScore);
        setAlerts(finalAlerts.length > 0 ? finalAlerts : [{ id: 0, machine: 'System', reason: 'Clear', fix: 'No issues detected.' }]);
        setIsUploading(false);
      }, 4500);
    };
    reader.readAsText(file);
  };

  return (
    <section id="telemetry-monitor" className="py-20 bg-slate-950 text-white font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        
        {/* Glassmorphic Header */}
        <div className="relative group animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/90 p-8 rounded-2xl border border-slate-800 backdrop-blur-xl">
            <div>
              <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                MINING DATA LIFECYCLE
              </h2>
              <p className="text-slate-400 mt-2 font-medium">Predictive Maintenance Pipeline | Sudbury Underground Mine 01</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
              <Badge color="cyan" label="PUB/SUB STREAMING" />
              <Badge color="emerald" label="GEMINI 1.5 PRO" />
              <Badge color="amber" label="BQ SILVER LAYER" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Phase 1: Interactive Ingestion Zone */}
          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              className="bg-slate-900/50 p-10 rounded-[2.5rem] border-2 border-dashed border-slate-800 hover:border-cyan-500/50 transition-all group relative overflow-hidden h-[300px] flex flex-col items-center justify-center"
            >
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={(e) => handleFileUpload(e.target.files)}
                accept=".csv"
              />
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500">
                  <Upload className={`w-8 h-8 ${isUploading ? 'text-cyan-400 animate-bounce' : 'text-slate-500 group-hover:text-cyan-400'}`} />
                </div>
                <div>
                  <p className="font-bold text-xl text-slate-200">Ingest Telemetry</p>
                  <p className="text-sm text-slate-500 max-w-[200px] mx-auto mt-2 tracking-tight">
                    Upload or Drag & Drop Sensor Logs
                  </p>
                  {fileName && (
                    <div className="mt-4 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg animate-in zoom-in">
                      <p className="text-cyan-400 font-mono text-[10px] truncate max-w-[150px]">
                        {fileName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pipeline Visualizer Card */}
            <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-2 mb-8">
                <Cpu className="text-cyan-500 w-5 h-5" />
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Pipeline</h3>
              </div>
              <ul className="space-y-6">
                <StatusItem label="GCP Ingestion (Stream)" active={pipelineStep === 1} done={pipelineStep >= 2} />
                <StatusItem label="BQ Transform (Silver)" active={pipelineStep === 2} done={pipelineStep >= 3} />
                <StatusItem label="Vertex AI Prediction" active={pipelineStep === 3} done={pipelineStep >= 4} />
                <StatusItem label="Agentic Alert Generated" active={pipelineStep === 4} done={pipelineStep === 4} />
              </ul>
            </div>
          </div>

          {/* Phase 2/3: Live Insights Engine */}
          <div className="lg:col-span-2 min-h-[500px] animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            {pipelineStep < 4 ? (
              <div className="h-full bg-slate-900/20 rounded-[3rem] border border-slate-900 flex flex-col items-center justify-center p-12 text-center group transition-all">
                <div className="w-32 h-32 mb-8 relative">
                   <div className={`absolute inset-0 rounded-full border-2 border-cyan-500/10 ${isUploading ? 'animate-ping' : ''}`}></div>
                   <Activity className={`w-32 h-32 transition-colors duration-1000 ${isUploading ? 'text-cyan-500' : 'text-slate-800'}`} />
                </div>
                <h2 className="text-3xl font-light text-slate-600 tracking-tight">
                  {pipelineStep === 0 ? "System Idle: Awaiting Telemetry Feed" : 
                   pipelineStep === 1 ? "Buffering Data to Cloud Pub/Sub..." :
                   pipelineStep === 2 ? "Imputing Missing Sensor Values..." : "Gemini 1.5 Pro Analyzing Failure Patterns..."}
                </h2>
              </div>
            ) : (
              <div className="grid gap-8 animate-in fade-in zoom-in duration-1000">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/80 p-8 rounded-[2rem] border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-12 bg-cyan-500 rounded-full"></div>
                    <div>
                      <h2 className="text-2xl font-black">SYSTEM HEALTH</h2>
                      <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">REAL-TIME ASSET ANALYSIS</p>
                    </div>
                  </div>
                  
                  {/* The Health Gauge */}
                  <div className="flex items-center gap-10">
                     <HealthGauge score={healthScore || 0} />
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</p>
                        <p className={`text-sm font-bold ${healthScore && healthScore < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {healthScore && healthScore < 70 ? 'PREDICTIVE MAINTENANCE REQUIRED' : 'NOMINAL OPERATION'}
                        </p>
                     </div>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {/* Alerts mapping... */}
                  {alerts.map((alert) => (
                    <div key={alert.id} className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative bg-slate-900 p-8 rounded-3xl border border-slate-800 transition-all duration-500 group-hover:translate-x-1">
                        <div className="flex justify-between items-center mb-6">
                          <span className="px-3 py-1 bg-slate-950 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/30 tracking-widest uppercase">
                            Asset: {alert.machine}
                          </span>
                          <CheckCircle className="text-emerald-500 w-6 h-6 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Root Cause Analysis</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{alert.reason}</p>
                          </div>
                          <div className="bg-cyan-500/5 p-5 rounded-2xl border border-cyan-500/10">
                            <p className="text-[10px] text-cyan-500 uppercase font-black tracking-widest mb-2">Prescriptive Fix</p>
                            <p className="text-emerald-400 text-sm font-semibold">{alert.fix}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

const StatusItem = ({ label, active, done }: { label: string, active: boolean, done: boolean }) => (
  <li className="flex items-center gap-4 group/item">
    <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
      done ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110' : 
      active ? 'bg-cyan-500 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 
      'bg-slate-800'
    }`}></div>
    <span className={`text-sm tracking-tight transition-colors duration-500 ${
      done ? 'text-slate-200 font-medium' : 
      active ? 'text-cyan-400 font-bold' : 
      'text-slate-600'
    }`}>{label}</span>
  </li>
);

const Badge = ({ label, color }: { label: string, color: 'cyan' | 'emerald' | 'amber' }) => {
  const colors = {
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/5'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] border ${colors[color]}`}>
      {label}
    </span>
  );
};

const HealthGauge = ({ score }: { score: number }) => {
  const color = score < 60 ? '#f59e0b' : score < 85 ? '#06b6d4' : '#10b981';
  const circumference = 2 * Math.PI * 35;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle cx="48" cy="48" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
        <circle 
          cx="48" cy="48" r="35" stroke={color} strokeWidth="8" fill="transparent" 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white">{score}%</span>
      </div>
    </div>
  );
};

export default MiningPipeline;
