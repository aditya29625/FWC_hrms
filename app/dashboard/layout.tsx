"use client";
import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles: string[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "📊", roles: ["admin", "manager", "recruiter", "employee"] },
  { href: "/dashboard/employees", label: "Employees", icon: "👥", roles: ["admin", "manager"] },
  { href: "/dashboard/attendance", label: "Attendance", icon: "📅", roles: ["admin", "manager", "employee"] },
  { href: "/dashboard/leave", label: "Leave Management", icon: "🏖️", roles: ["admin", "manager", "employee"] },
  { href: "/dashboard/payroll", label: "Payroll", icon: "💰", roles: ["admin", "manager", "employee"] },
  { href: "/dashboard/performance", label: "Performance", icon: "🎯", roles: ["admin", "manager", "employee"] },
  { href: "/dashboard/recruitment", label: "Recruitment", icon: "💼", roles: ["admin", "manager", "recruiter"], badge: "AI" },
  { href: "/dashboard/ai-tools", label: "AI Tools", icon: "🤖", roles: ["admin", "manager", "recruiter"], badge: "NEW" },
  { href: "/dashboard/departments", label: "Departments", icon: "🏢", roles: ["admin", "manager"] },
  { href: "/dashboard/reports", label: "Reports", icon: "📈", roles: ["admin", "manager"] },
  { href: "/dashboard/announcements", label: "Announcements", icon: "📢", roles: ["admin", "manager", "recruiter", "employee"] },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️", roles: ["admin", "manager", "recruiter", "employee"] },
];

const ROLE_COLORS: Record<string, string> = {
  admin: "role-admin",
  manager: "role-manager",
  recruiter: "role-recruiter",
  employee: "role-employee",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Management Admin",
  manager: "Senior Manager",
  recruiter: "HR Recruiter",
  employee: "Employee",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0
            }}>⚡</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "white" }}>FWC HRMS</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>AI-Powered Platform</div>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div style={{ padding: "16px 14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className={`avatar ${ROLE_COLORS[user.role]}`}>
              {user.avatar}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{
                fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 20, display: "inline-block", marginTop: 2,
                background: user.role === "admin" ? "rgba(99,102,241,0.2)" : user.role === "manager" ? "rgba(6,182,212,0.2)" : user.role === "recruiter" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                color: user.role === "admin" ? "#818cf8" : user.role === "manager" ? "#22d3ee" : user.role === "recruiter" ? "#34d399" : "#fbbf24",
              }}>
                {ROLE_LABELS[user.role]}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {allowedItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                  background: item.badge === "AI" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "linear-gradient(135deg, #059669, #10b981)",
                  color: "white"
                }}>{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", marginTop: "auto", position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <button
            onClick={handleLogout}
            className="nav-item btn-danger"
            style={{ width: "100%", border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1 }}>
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-secondary)", fontSize: 20, display: "none"
              }}
              className="mobile-menu-btn"
            >☰</button>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
                {allowedItems.find(i => i.href === pathname)?.label || "Dashboard"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Search */}
            <div style={{ position: "relative" }} className="hide-mobile">
              <input
                className="form-input"
                placeholder="Search..."
                style={{ width: 200, paddingLeft: 36, fontSize: 13, padding: "8px 12px 8px 36px" }}
              />
              <span style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-muted)", fontSize: 14
              }}>🔍</span>
            </div>

            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{
                  background: "var(--glass)", border: "1px solid var(--glass-border)",
                  borderRadius: 10, padding: "8px 10px", cursor: "pointer",
                  color: "var(--text-secondary)", fontSize: 18, position: "relative"
                }}
              >
                🔔
                <span className="notif-dot" />
              </button>
              {notifOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)",
                  width: 300, background: "#1a1a2e",
                  border: "1px solid var(--glass-border)", borderRadius: 12,
                  padding: 12, zIndex: 100,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "white" }}>Notifications</div>
                  {[
                    { icon: "📋", text: "Q2 reviews starting June 15", time: "2h ago" },
                    { icon: "✅", text: "Leave request approved", time: "5h ago" },
                    { icon: "💰", text: "May payslip generated", time: "1d ago" },
                  ].map((n, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 10, padding: "8px 0",
                      borderBottom: i < 2 ? "1px solid var(--border)" : "none"
                    }}>
                      <span>{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "var(--text-primary)" }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className={`avatar ${ROLE_COLORS[user.role]}`} style={{ cursor: "pointer" }}>
              {user.avatar}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 99, backdropFilter: "blur(2px)"
          }}
        />
      )}
    </div>
  );
}
