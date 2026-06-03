"use client";
import { useAuth } from "@/lib/auth";
import { EMPLOYEES, DEPARTMENTS, MONTHLY_STATS, ATTENDANCE_CHART, DEPT_PERFORMANCE, LEAVE_REQUESTS, ANNOUNCEMENTS, JOB_POSTINGS } from "@/lib/mockData";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px" }}>
        <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || "#6366f1", fontSize: 13, fontWeight: 600 }}>
            {p.name}: {typeof p.value === "number" && p.value > 10000 ? `₹${(p.value/100000).toFixed(1)}L` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user } = useAuth();

  const activeEmployees = EMPLOYEES.filter(e => e.status === "Active").length;
  const pendingLeaves = LEAVE_REQUESTS.filter(l => l.status === "Pending").length;
  const activeJobs = JOB_POSTINGS.filter(j => j.status === "Active").length;
  const avgPerformance = Math.round(EMPLOYEES.reduce((s, e) => s + e.performance, 0) / EMPLOYEES.length);

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isRecruiter = user?.role === "recruiter";
  const isEmployee = user?.role === "employee";

  const myEmployee = EMPLOYEES.find(e => e.email?.includes(user?.role === "employee" ? "vikram" : ""));

  const deptPieData = DEPARTMENTS.map(d => ({ name: d.name, value: d.employees }));

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15), rgba(6,182,212,0.1))",
        border: "1px solid rgba(99,102,241,0.25)",
        borderRadius: 20, padding: "28px 32px",
        marginBottom: 24, position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)",
          fontSize: 80, opacity: 0.15
        }}>⚡</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          {isAdmin && "Here's your company-wide overview for today."}
          {isManager && "Your team performance summary is ready."}
          {isRecruiter && `You have ${activeJobs} active job postings and candidates waiting for review.`}
          {isEmployee && "Track your attendance, leaves and performance below."}
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <span className="badge badge-success">✅ System Online</span>
          <span className="badge badge-info">🤖 AI Active</span>
          <span className="badge badge-primary">📅 {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </div>

      {/* Stats Cards – Admin/Manager view */}
      {(isAdmin || isManager) && (
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: "Total Employees", value: EMPLOYEES.length, sub: `${activeEmployees} active`, icon: "👥", color: "#6366f1", trend: "+12%" },
            { label: "Departments", value: DEPARTMENTS.length, sub: "Across 6 cities", icon: "🏢", color: "#06b6d4", trend: "+1" },
            { label: "Pending Leaves", value: pendingLeaves, sub: "Awaiting approval", icon: "🏖️", color: "#f59e0b", trend: "Review" },
            { label: "Avg Performance", value: `${avgPerformance}%`, sub: "Company-wide score", icon: "🎯", color: "#10b981", trend: "+3%" },
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>{stat.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{stat.sub}</div>
                </div>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${stat.color}20`, border: `1px solid ${stat.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                }}>{stat.icon}</div>
              </div>
              <div style={{
                marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>vs last month</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: stat.color }}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Self-View Stats */}
      {isEmployee && (
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: "Attendance Rate", value: "94%", sub: "This month", icon: "📅", color: "#6366f1" },
            { label: "Leaves Remaining", value: "14", sub: "Out of 21 days", icon: "🏖️", color: "#10b981" },
            { label: "Performance Score", value: "82%", sub: "Last review", icon: "🎯", color: "#f59e0b" },
            { label: "Current CTC", value: "₹70K", sub: "Monthly gross", icon: "💰", color: "#06b6d4" },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>{stat.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{stat.sub}</div>
                </div>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${stat.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recruiter Stats */}
      {isRecruiter && (
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: "Active Jobs", value: activeJobs, sub: "Open positions", icon: "💼", color: "#6366f1" },
            { label: "Total Candidates", value: 191, sub: "All pipelines", icon: "👤", color: "#10b981" },
            { label: "Interviews Today", value: 3, sub: "Scheduled", icon: "🎙️", color: "#f59e0b" },
            { label: "AI Screened", value: 47, sub: "This week", icon: "🤖", color: "#06b6d4" },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>{stat.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{stat.sub}</div>
                </div>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${stat.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      {(isAdmin || isManager) && (
        <div className="grid-2" style={{ marginBottom: 24 }}>
          {/* Headcount Trend */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-header">
              <div>
                <div className="section-title">Headcount Trend</div>
                <div className="section-subtitle">Monthly hiring vs attrition</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_STATS}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="headcount" stroke="#6366f1" strokeWidth={2} fill="url(#g1)" name="Headcount" />
                <Area type="monotone" dataKey="hired" stroke="#10b981" strokeWidth={2} fill="url(#g2)" name="Hired" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-header">
              <div>
                <div className="section-title">Dept. Distribution</div>
                <div className="section-subtitle">Employees per department</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie data={deptPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                    {deptPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v} employees`, ""]} contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {deptPieData.slice(0, 5).map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>{d.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Attendance + Dept Performance */}
      {(isAdmin || isManager) && (
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-header">
              <div>
                <div className="section-title">Weekly Attendance</div>
                <div className="section-subtitle">Present vs Absent this week</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ATTENDANCE_CHART} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-header">
              <div>
                <div className="section-title">Dept. Performance</div>
                <div className="section-subtitle">Average score by department</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={DEPT_PERFORMANCE}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="dept" tick={{ fill: "#64748b", fontSize: 10 }} />
                <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bottom Row */}
      <div className="grid-2">
        {/* Recent Activities / Announcements */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-title">📢 Announcements</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={a.id} style={{
                padding: "12px 14px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 10,
                border: `1px solid ${a.priority === "High" ? "rgba(239,68,68,0.2)" : "var(--border)"}`,
                display: "flex", gap: 12, alignItems: "flex-start"
              }}>
                <div style={{ fontSize: 20 }}>{a.priority === "High" ? "🔴" : "🟡"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "white", marginBottom: 2 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 4 }}>{a.content.slice(0, 80)}...</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>by {a.by} • {a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-title">⚡ Quick Actions</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "📋", label: "Apply Leave", href: "/dashboard/leave", color: "#6366f1" },
              { icon: "👁️", label: "View Payslip", href: "/dashboard/payroll", color: "#10b981" },
              { icon: "🎯", label: "Performance", href: "/dashboard/performance", color: "#f59e0b" },
              { icon: "📅", label: "Attendance", href: "/dashboard/attendance", color: "#06b6d4" },
              ...(isAdmin || isManager ? [
                { icon: "👥", label: "Add Employee", href: "/dashboard/employees", color: "#8b5cf6" },
                { icon: "📊", label: "Reports", href: "/dashboard/reports", color: "#ef4444" },
              ] : []),
              ...(isRecruiter || isAdmin ? [
                { icon: "🤖", label: "AI Tools", href: "/dashboard/ai-tools", color: "#ec4899" },
                { icon: "💼", label: "Recruitment", href: "/dashboard/recruitment", color: "#0891b2" },
              ] : []),
            ].slice(0, 6).map((action, i) => (
              <a key={i} href={action.href} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 8, padding: "16px 12px", borderRadius: 12, textDecoration: "none",
                background: `${action.color}12`, border: `1px solid ${action.color}25`,
                transition: "all 0.2s ease", cursor: "pointer"
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                <span style={{ fontSize: 24 }}>{action.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: action.color, textAlign: "center" }}>{action.label}</span>
              </a>
            ))}
          </div>

          {/* AI Status */}
          <div style={{
            marginTop: 16, padding: "12px 14px",
            background: "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(99,102,241,0.1))",
            border: "1px solid rgba(6,182,212,0.2)", borderRadius: 10,
            display: "flex", alignItems: "center", gap: 10
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} className="animate-pulse-glow" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>AI Engine Active</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Resume screening • Chatbot • Analytics</div>
            </div>
            <span className="badge badge-success">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
