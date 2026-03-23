import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shyam Sundhar Kumaravel - Solutions Architect Portfolio",
  description: "Senior Cloud Solutions Architect specializing in scalable, high-performance cloud architectures. Explore my portfolio of technical projects.",
  keywords: "Shyam Sundhar Kumaravel, Solutions Architect, Cloud Architecture, Portfolio, Next.js, Firebase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-slate-50 relative selection:bg-blue-500/30 selection:text-white`}>
        {/* Animated background gradient or blur */}
        <div className="fixed inset-0 z-[-1]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
