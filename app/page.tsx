"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-dark)"
    }}>
      <div style={{ textAlign: "center" }}>
        <div className="animate-spin-slow" style={{
          width: 48, height: 48,
          border: "3px solid rgba(99,102,241,0.3)",
          borderTop: "3px solid #6366f1",
          borderRadius: "50%",
          margin: "0 auto 16px"
        }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading FWC HRMS...</p>
      </div>
    </div>
  );
}
