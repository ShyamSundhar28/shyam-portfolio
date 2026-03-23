import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function AgenticDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 selection:bg-blue-500/30">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8">
        <FiArrowLeft /> Back to Portfolio
      </Link>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4">Agentic AI Dashboard</h1>
        <p className="text-slate-400 mb-8 max-w-2xl">
          This is a dedicated, isolated workspace for the real-world Agentic AI Dashboard. Development and real-time output will be integrated here safely without affecting the main portfolio.
        </p>

        {/* Real-time output container */}
        <div className="w-full h-[600px] border border-slate-800 bg-slate-900/50 rounded-2xl flex items-center justify-center">
          <p className="text-slate-500 font-mono animate-pulse">Initializing Agent Environment...</p>
        </div>
      </div>
    </main>
  );
}
