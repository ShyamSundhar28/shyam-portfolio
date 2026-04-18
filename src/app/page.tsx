import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TelemetryMonitor from "@/components/TelemetryMonitor";
import SystemDesign from "@/components/SystemDesign";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <About />
      <TelemetryMonitor />
      <SystemDesign />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  );
}
