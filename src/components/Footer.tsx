"use client";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-xl font-bold tracking-tighter mb-4 md:mb-0">
          <span className="text-white">SSK</span>
          <span className="text-blue-500">.</span>
        </div>
        
        <p className="text-sm text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} Shyam Sundhar Kumaravel. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6 mt-6 md:mt-0 text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
