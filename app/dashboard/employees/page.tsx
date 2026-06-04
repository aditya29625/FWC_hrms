"use client";
import { useState } from "react";
import { EMPLOYEES, DEPARTMENTS } from "@/lib/mockData";

const DEPT_COLORS: Record<string, string> = {
  "Engineering": "#6366f1", "Human Resources": "#06b6d4", "Marketing": "#ec4899",
  "Finance": "#10b981", "Sales": "#f59e0b", "Design": "#8b5cf6",
  "Operations": "#ef4444", "Customer Support": "#0891b2", "Administration": "#14b8a6",
};

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof EMPLOYEES[0] | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filtered = EMPLOYEES.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || e.department === deptFilter;
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const depts = ["All", ...Array.from(new Set(EMPLOYEES.map(e => e.department)))];

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">Employee Directory</div>
          <div className="section-subtitle">{EMPLOYEES.length} total employees • {EMPLOYEES.filter(e=>e.status==="Active").length} active</div>
        </div>
        <button className="btn btn-primary">
          <span>+</span> <span>Add Employee</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="form-input"
          placeholder="🔍 Search employees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
          id="employee-search"
        />
        <select
          className="form-input"
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          style={{ width: 180 }}
          id="dept-filter"
        >
          {depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          className="form-input"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ width: 140 }}
          id="status-filter"
        >
          {["All", "Active", "On Leave", "Inactive"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => setViewMode("table")} className={`btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-secondary"}`}>☰</button>
          <button onClick={() => setViewMode("grid")} className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-secondary"}`}>⊞</button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="glass-card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Performance</th>
                  <th>Attendance</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar" style={{
                          background: `linear-gradient(135deg, ${DEPT_COLORS[emp.department] || "#6366f1"}cc, ${DEPT_COLORS[emp.department] || "#6366f1"}88)`
                        }}>{emp.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{emp.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{emp.id} • {emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                        background: `${DEPT_COLORS[emp.department] || "#6366f1"}20`,
                        color: DEPT_COLORS[emp.department] || "#6366f1"
                      }}>{emp.department}</span>
                    </td>
                    <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{emp.position}</td>
                    <td>
                      <span className={`badge ${emp.status === "Active" ? "badge-success" : emp.status === "On Leave" ? "badge-warning" : "badge-danger"}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${emp.performance}%`, background: emp.performance >= 85 ? "linear-gradient(90deg,#10b981,#059669)" : emp.performance >= 70 ? "linear-gradient(90deg,#f59e0b,#d97706)" : "linear-gradient(90deg,#ef4444,#dc2626)" }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: emp.performance >= 85 ? "#10b981" : emp.performance >= 70 ? "#f59e0b" : "#ef4444" }}>{emp.performance}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: emp.attendance >= 95 ? "#10b981" : emp.attendance >= 90 ? "#f59e0b" : "#ef4444", fontWeight: 600 }}>{emp.attendance}%</td>
                    <td style={{ fontWeight: 600, color: "#10b981" }}>₹{(emp.salary/1000).toFixed(0)}K</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedEmployee(emp)}
                      >View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(emp => (
            <div key={emp.id} className="glass-card" style={{ padding: 20, cursor: "pointer", transition: "all 0.2s" }}
              onClick={() => setSelectedEmployee(emp)}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className="avatar avatar-lg" style={{
                  background: `linear-gradient(135deg, ${DEPT_COLORS[emp.department] || "#6366f1"}, ${DEPT_COLORS[emp.department] || "#6366f1"}88)`
                }}>{emp.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{emp.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{emp.position}</div>
                  <span className={`badge ${emp.status === "Active" ? "badge-success" : "badge-warning"}`} style={{ marginTop: 4 }}>{emp.status}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["🏢", emp.department],
                  ["📧", emp.email || "N/A"],
                  ["📅", `Joined: ${emp.joinDate}`],
                ].map(([icon, val], i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <div style={{ flex: 1, textAlign: "center", padding: 8, background: "rgba(99,102,241,0.1)", borderRadius: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#6366f1" }}>{emp.performance}%</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Performance</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center", padding: 8, background: "rgba(16,185,129,0.1)", borderRadius: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#10b981" }}>{emp.attendance}%</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Attendance</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="modal-overlay" onClick={() => setSelectedEmployee(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="avatar avatar-xl" style={{
                    background: `linear-gradient(135deg, ${DEPT_COLORS[selectedEmployee.department] || "#6366f1"}, ${DEPT_COLORS[selectedEmployee.department] || "#6366f1"}88)`
                  }}>{selectedEmployee.avatar}</div>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{selectedEmployee.name}</h2>
                    <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>{selectedEmployee.position}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <span className="badge badge-primary">{selectedEmployee.id}</span>
                      <span className={`badge ${selectedEmployee.status === "Active" ? "badge-success" : "badge-warning"}`}>{selectedEmployee.status}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedEmployee(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer" }}>✕</button>
              </div>

              <div className="grid-2" style={{ gap: 16, marginBottom: 20 }}>
                {[
                  ["Department", selectedEmployee.department, "🏢"],
                  ["Manager", selectedEmployee.manager, "👤"],
                  ["Email", selectedEmployee.email || "N/A", "📧"],
                  ["Phone", selectedEmployee.phone, "📱"],
                  ["Join Date", selectedEmployee.joinDate, "📅"],
                  ["Salary", `₹${(selectedEmployee.salary/1000).toFixed(0)}K/month`, "💰"],
                ].map(([label, val, icon]) => (
                  <div key={label as string} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{icon} {label}</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Performance", value: selectedEmployee.performance, color: "#6366f1" },
                  { label: "Attendance", value: selectedEmployee.attendance, color: "#10b981" },
                ].map(m => (
                  <div key={m.label} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{m.label}</span>
                      <span style={{ fontWeight: 800, color: m.color }}>{m.value}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${m.value}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1 }}>Edit Profile</button>
                <button className="btn btn-secondary" style={{ flex: 1 }}>View Payroll</button>
                <button className="btn btn-secondary" style={{ flex: 1 }}>Performance</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
