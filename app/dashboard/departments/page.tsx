"use client";
import { useState } from "react";
import { DEPARTMENTS as INITIAL_DEPARTMENTS, EMPLOYEES } from "@/lib/mockData";

const DEPT_COLORS: Record<string, string> = {
  "Engineering": "#6366f1", "Human Resources": "#06b6d4", "Marketing": "#ec4899",
  "Finance": "#10b981", "Sales": "#f59e0b", "Design": "#8b5cf6",
  "Operations": "#ef4444", "Customer Support": "#0891b2", "Administration": "#14b8a6",
};

interface Department {
  id: string;
  name: string;
  head: string;
  employees: number;
  budget: number;
  location: string;
  description?: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS as Department[]);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formHead, setFormHead] = useState("");
  const [formBudget, setFormBudget] = useState(1000000);
  const [formLocation, setFormLocation] = useState("Mumbai");
  const [formDescription, setFormDescription] = useState("");

  const handleOpenAdd = () => {
    setModalMode("add");
    setFormName("");
    setFormHead("");
    setFormBudget(1000000);
    setFormLocation("Mumbai");
    setFormDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setEditingDeptId(dept.id);
    setFormName(dept.name);
    setFormHead(dept.head);
    setFormBudget(dept.budget);
    setFormLocation(dept.location);
    setFormDescription(dept.description || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formHead) return;

    if (modalMode === "add") {
      const newDept: Department = {
        id: `D0${departments.length + 1}`,
        name: formName,
        head: formHead,
        employees: EMPLOYEES.filter(emp => emp.department === formName).length,
        budget: Number(formBudget),
        location: formLocation,
        description: formDescription,
      };
      setDepartments([...departments, newDept]);
    } else if (modalMode === "edit" && editingDeptId) {
      setDepartments(departments.map(dept => {
        if (dept.id === editingDeptId) {
          return {
            ...dept,
            name: formName,
            head: formHead,
            budget: Number(formBudget),
            location: formLocation,
            description: formDescription,
            employees: EMPLOYEES.filter(emp => emp.department === formName).length,
          };
        }
        return dept;
      }));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter(d => d.id !== id));
      if (selectedDept?.id === id) setSelectedDept(null);
    }
  };

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase())
  );

  // Stats calculation
  const totalBudget = departments.reduce((acc, curr) => acc + curr.budget, 0);
  const totalEmployees = EMPLOYEES.length;
  const avgBudgetPerEmp = totalEmployees > 0 ? totalBudget / totalEmployees : 0;
  const maxBudgetDept = departments.reduce((max, dept) => dept.budget > max.budget ? dept : max, departments[0] || { budget: 0, name: "N/A" });

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  // Find employees belonging to the selected department
  const deptEmployees = selectedDept ? EMPLOYEES.filter(emp => emp.department.toLowerCase() === selectedDept.name.toLowerCase()) : [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Department Directory</h1>
          <p className="section-subtitle">Manage company divisions, budget allocations, and leadership roles</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <span>+</span> <span>Add Department</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Total Departments</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{departments.length}</div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>Active operations</div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Total Budget Allocated</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#10b981" }}>{formatCurrency(totalBudget)}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Fiscal year allocation</div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Avg. Capital per Head</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#6366f1" }}>{formatCurrency(avgBudgetPerEmp)}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Calculated across all staff</div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Highest Funded Division</div>
          <div style={{ fontSize: 22, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{maxBudgetDept.name}</div>
          <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 4, fontWeight: 600 }}>{formatCurrency(maxBudgetDept.budget)}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ position: "relative" }}>
          <input
            className="form-input"
            placeholder="🔍 Search by department name, head, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: 40 }}
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid-3">
        {filteredDepts.map(dept => {
          const themeColor = DEPT_COLORS[dept.name] || "#6366f1";
          const count = EMPLOYEES.filter(emp => emp.department.toLowerCase() === dept.name.toLowerCase()).length;
          return (
            <div
              key={dept.id}
              className="glass-card"
              style={{
                padding: 24,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                borderTop: `4px solid ${themeColor}`
              }}
              onClick={() => setSelectedDept(dept)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{dept.name}</h3>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>ID: {dept.id}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "4px 8px", fontSize: 11 }}
                    onClick={(e) => handleOpenEdit(dept, e)}
                  >✏️</button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "4px 8px", fontSize: 11, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                    onClick={(e) => handleDelete(dept.id, e)}
                  >🗑️</button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Division Head:</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>👤 {dept.head}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Staff Size:</span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 12,
                    background: `${themeColor}15`, color: themeColor
                  }}>{count} Employees</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Fiscal Budget:</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#10b981" }}>{formatCurrency(dept.budget)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Location:</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>📍 {dept.location}</span>
                </div>
              </div>

              <div style={{
                marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)",
                display: "flex", justifyContent: "flex-end", alignItems: "center"
              }}>
                <span style={{ fontSize: 12, color: themeColor, fontWeight: 700 }}>View Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>{modalMode === "add" ? "Create New Department" : "Edit Department"}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}>✕</button>
              </div>

              <form onSubmit={handleSave}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Department Name *</label>
                    <input
                      className="form-input"
                      required
                      placeholder="e.g. Engineering"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Department Head Name *</label>
                    <input
                      className="form-input"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formHead}
                      onChange={e => setFormHead(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className="grid-2" style={{ gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Annual Budget (₹) *</label>
                      <input
                        className="form-input"
                        type="number"
                        required
                        min="1"
                        value={formBudget}
                        onChange={e => setFormBudget(Number(e.target.value))}
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Location *</label>
                      <select
                        className="form-input"
                        required
                        value={formLocation}
                        onChange={e => setFormLocation(e.target.value)}
                        style={{ width: "100%" }}
                      >
                        {["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad", "Remote"].map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Description / Scope</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Enter department scope and responsibilities..."
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      style={{ width: "100%", fontFamily: "inherit", resize: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{modalMode === "add" ? "Create" : "Save Changes"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Details Side Drawer/Modal */}
      {selectedDept && (
        <div className="modal-overlay" onClick={() => setSelectedDept(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div style={{ padding: 28 }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{selectedDept.name} Division</h2>
                  <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>ID: {selectedDept.id} • Location: 📍 {selectedDept.location}</div>
                </div>
                <button onClick={() => setSelectedDept(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 24, cursor: "pointer" }}>✕</button>
              </div>

              {/* Description */}
              {selectedDept.description && (
                <div className="glass-card" style={{ padding: 16, marginBottom: 20, background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Description & Scope</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{selectedDept.description}</div>
                </div>
              )}

              {/* Stats Overview */}
              <div className="grid-3" style={{ gap: 12, marginBottom: 24 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Division Head</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>👤 {selectedDept.head}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Annual Funding</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4, color: "#10b981" }}>{formatCurrency(selectedDept.budget)}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Department Staff</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4, color: "#6366f1" }}>{deptEmployees.length} Members</div>
                </div>
              </div>

              {/* Employee List */}
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: "white" }}>Current Employees ({deptEmployees.length})</h3>
              {deptEmployees.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13, background: "rgba(255,255,255,0.01)", borderRadius: 10 }}>
                  No employees currently assigned to this department.
                </div>
              ) : (
                <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 6 }}>
                  {deptEmployees.map(emp => (
                    <div key={emp.id} style={{
                      display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center",
                      padding: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 8
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar" style={{ fontSize: 12, width: 32, height: 32, background: `linear-gradient(135deg, ${DEPT_COLORS[selectedDept.name] || "#6366f1"}cc, ${DEPT_COLORS[selectedDept.name] || "#6366f1"}88)` }}>{emp.avatar}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{emp.position}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className={`badge ${emp.status === "Active" ? "badge-success" : "badge-warning"}`} style={{ fontSize: 10 }}>{emp.status}</span>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>Perf: {emp.performance}%</div>
                          <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Att: {emp.attendance}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
                <button className="btn btn-secondary" onClick={() => setSelectedDept(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
