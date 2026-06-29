import React from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css"; // Ensure this file exists for Tailwind utilities!

// Configure Inter for scannable UI text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Configure Plus Jakarta Sans for premium, modern headings
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Viquoe | Institutional B2B Procurement Hub",
  description: "Streamlined B2B RFQs and supplier management for emerging markets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}