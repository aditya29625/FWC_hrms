import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FWC HRMS – AI-Powered HR Management System",
  description: "Next-generation Human Resource Management System with AI-powered recruitment, performance tracking, and employee management for FWC IT Services Pvt. Ltd.",
  keywords: "HRMS, HR Management, AI Recruitment, Employee Management, Payroll, Performance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
