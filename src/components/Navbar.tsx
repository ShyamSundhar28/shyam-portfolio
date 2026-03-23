"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6"
    >
      <div className="glass-panel px-8 py-4 rounded-full flex items-center gap-8">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:text-blue-400 transition-colors">
          SSK.
        </Link>
        <ul className="flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link 
          href="#contact" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]"
        >
          Let&apos;s Talk
        </Link>
      </div>
    </motion.nav>
  );
}
