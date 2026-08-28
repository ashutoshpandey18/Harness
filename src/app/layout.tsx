import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAGS.ai — Frontline AI Platform",
  description: "MAGS.ai is an agentic WhatsApp AI for India's 500M frontline factory workers. Upload SOPs, ask in Hindi, and trigger autonomous actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`}>
      <body className="light-theme">{children}</body>
    </html>
  );
}
