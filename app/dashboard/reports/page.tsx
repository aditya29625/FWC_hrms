"use client";
import { useState, useEffect } from "react";
import { MONTHLY_STATS, DEPT_PERFORMANCE, ATTENDANCE_CHART } from "@/lib/mockData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ReportsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"headcount" | "performance" | "attendance">("headcount");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[] | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGenerateAI = () => {
    setGeneratingAI(true);
    setTimeout(() => {
      setGeneratingAI(false);
      setAiInsights([
        "📈 Headcount has increased by 31.0% in the last six months, indicating high organizational growth velocity.",
        "💡 Engineering is the largest department and holds a solid performance rating of 88%. However, Sales (79%) is lagging the organization average by 6.5%. Sales enablement programs are recommended.",
        "⚠️ Attendance patterns reveal a noticeable Friday drop of 10.7% (165 present vs midweek peak of 185). Implementing a hybrid Friday option or engagement activities could mitigate this pattern.",
        "💰 Fiscal revenue growth correlates highly with headcount (r = 0.98), indicating efficient onboarding and immediate productivity realization."
      ]);
    }, 1500);
  };

  const handleExport = (format: "PDF" | "CSV") => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      alert(`Report successfully generated and downloaded in ${format} format!`);
    }, 1200);
  };

  if (!isMounted) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Reports & Analytics</h1>
          <p className="section-subtitle">Real-time charts, departmental analytics, and AI executive summaries</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport("CSV")}
            disabled={exporting !== null}
          >
            {exporting === "CSV" ? "Exporting CSV..." : "📥 Export CSV"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleExport("PDF")}
            disabled={exporting !== null}
          >
            {exporting === "PDF" ? "Exporting PDF..." : "📄 Export PDF"}
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Headcount Growth", val: "+31.0%", sub: "Last 6 Months", color: "#6366f1" },
          { label: "Avg. Org Performance", val: "84.7%", sub: "Target: 85%", color: "#10b981" },
          { label: "Avg. Weekly Attendance", val: "92.8%", sub: "Stable midweek", color: "#06b6d4" },
          { label: "Monthly Revenue Runrate", val: "₹6.8M", sub: "Up 61% YoY", color: "#f59e0b" },
        ].map((m, idx) => (
          <div key={idx} className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: m.color }}>{m.val}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs / Switcher */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
        {[
          { id: "headcount", label: "👥 Headcount & Revenue Trends" },
          { id: "performance", label: "🎯 Departmental Performance" },
          { id: "attendance", label: "📅 Weekly Attendance Trends" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className="nav-item"
            style={{
              padding: "8px 16px",
              background: activeTab === t.id ? "rgba(99,102,241,0.15)" : "transparent",
              color: activeTab === t.id ? "#818cf8" : "var(--text-secondary)",
              border: activeTab === t.id ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Chart Panel */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "white" }}>
          {activeTab === "headcount" && "Staff Headcount vs Revenue Generation Timeline"}
          {activeTab === "performance" && "Average Performance Ratings Across Departments"}
          {activeTab === "attendance" && "Weekly Office Attendance (Present vs Absent Count)"}
        </h3>

        <div style={{ width: "100%", height: 350 }}>
          {activeTab === "headcount" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_STATS}>
                <defs>
                  <linearGradient id="colorHeadcount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis yAxisId="left" stroke="#818cf8" fontSize={12} label={{ value: 'Headcount', angle: -90, position: 'insideLeft', style: { fill: '#818cf8', fontSize: 12 } }} />
                <YAxis yAxisId="right" orientation="right" stroke="#34d399" fontSize={12} label={{ value: 'Revenue (₹ Lakhs)', angle: 90, position: 'insideRight', style: { fill: '#34d399', fontSize: 12 } }} />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    if (name === "Revenue (INR)") return [`₹${(Number(value)/100000).toFixed(0)} L`, name];
                    return [value, name];
                  }}
                  contentStyle={{ background: "#111", border: "1px solid var(--border)", borderRadius: 8 }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="headcount" stroke="#6366f1" fillOpacity={1} fill="url(#colorHeadcount)" name="Total Employees" />
                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (INR)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === "performance" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dept" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[50, 100]} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Performance Score (%)" maxBarSize={45}>
                  {DEPT_PERFORMANCE.map((entry, index) => {
                    const colors = ["#6366f1", "#06b6d4", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
                    return <span key={index} style={{ fill: colors[index % colors.length] }} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === "attendance" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_CHART}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name="Present Count" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={40} />
                <Bar dataKey="absent" fill="#ef4444" name="Absent Count" stackId="a" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="glass-card" style={{ padding: 24, background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)", border: "1px solid rgba(99,102,241,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "white" }}>Executive AI Report Insights</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Instant data synthesis and strategic HR suggestions powered by mock AI analyzer</p>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleGenerateAI}
            disabled={generatingAI}
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            {generatingAI ? "Analyzing Data Model..." : "✨ Generate AI Insights"}
          </button>
        </div>

        {generatingAI && (
          <div style={{ padding: "30px 0", textAlign: "center" }}>
            <div className="spinner" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 13, color: "#818cf8", fontWeight: 600 }}>Synthesizing headcount, performance indexes, and attendance matrices...</div>
          </div>
        )}

        {!generatingAI && aiInsights === null && (
          <div style={{ padding: "24px 0", textAlign: "center", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 10 }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Click the button to scan payroll metrics, weekly checkins, and candidate pipeline models.</p>
          </div>
        )}

        {!generatingAI && aiInsights !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {aiInsights.map((insight, idx) => {
              const bg = insight.startsWith("⚠️") ? "rgba(239,68,68,0.06)" : insight.startsWith("📈") ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.02)";
              const border = insight.startsWith("⚠️") ? "rgba(239,68,68,0.15)" : insight.startsWith("📈") ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)";
              return (
                <div key={idx} style={{
                  padding: 14,
                  borderRadius: 8,
                  fontSize: 13.5,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  background: bg,
                  border: `1px solid ${border}`
                }}>
                  {insight}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
