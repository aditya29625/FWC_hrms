"use client";
import { useState } from "react";
import { PAYROLL } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";

const SALARY_STRUCTURE = {
  basicSalary: 70000,
  hra: 21000,
  ta: 5000,
  da: 7000,
  specialAllowance: 8000,
  grossSalary: 111000,
  pf: 8400,
  professionalTax: 200,
  incomeTax: 4000,
  totalDeductions: 12600,
  netSalary: 98400,
};

export default function PayrollPage() {
  const { user } = useAuth();
  // Role based access check (case-insensitive)
  const userRole = user?.role?.toLowerCase() || "";
  const canManage = userRole === "hr" || userRole === "admin" || userRole === "manager";

  const [payslips, setPayslips] = useState(PAYROLL);
  const [selectedPayslip, setSelectedPayslip] = useState<typeof PAYROLL[0] | null>(null);
  const [activeTab, setActiveTab] = useState<"payslips" | "structure" | "tax">("payslips");

  // Payslip form state for HR/Admin
  const [showPayslipForm, setShowPayslipForm] = useState(false);
  const [editingPayslipId, setEditingPayslipId] = useState<string | null>(null);
  const [payslipForm, setPayslipForm] = useState({
    employeeName: "",
    month: "June 2026",
    basicSalary: 70000,
    hra: 21000,
    ta: 5000,
    da: 7000,
    pf: 8400,
    tax: 4200,
  });

  // Filter based on role
  const displayedPayslips = canManage 
    ? payslips 
    : payslips.filter(p => p.employeeName === user?.name || p.employeeId === user?.id);

  const openAddForm = () => {
    setEditingPayslipId(null);
    setPayslipForm({
      employeeName: "",
      month: "June 2026",
      basicSalary: 70000,
      hra: 21000,
      ta: 5000,
      da: 7000,
      pf: 8400,
      tax: 4200,
    });
    setShowPayslipForm(true);
  };

  const openEditForm = (p: typeof PAYROLL[0]) => {
    setEditingPayslipId(p.id);
    setPayslipForm({
      employeeName: p.employeeName,
      month: p.month,
      basicSalary: p.basicSalary,
      hra: p.hra,
      ta: p.ta,
      da: p.da,
      pf: p.pf,
      tax: p.tax,
    });
    setShowPayslipForm(true);
  };

  const handleSavePayslip = (e: React.FormEvent) => {
    e.preventDefault();
    const netSalary = Number(payslipForm.basicSalary) + Number(payslipForm.hra) + Number(payslipForm.ta) + Number(payslipForm.da) - (Number(payslipForm.pf) + Number(payslipForm.tax));
    
    if (editingPayslipId) {
      setPayslips(payslips.map(p => p.id === editingPayslipId ? { ...p, ...payslipForm, netSalary } : p));
    } else {
      const newPayslip = {
        id: `P${Date.now()}`,
        employeeId: "E" + Math.floor(Math.random() * 1000),
        status: "Paid",
        paidOn: new Date().toISOString().split("T")[0],
        ...payslipForm,
        netSalary,
      };
      setPayslips([newPayslip, ...payslips]);
    }
    setShowPayslipForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">Payroll & Compensation</div>
          <div className="section-subtitle">View payslips, salary structure & tax details</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {canManage && (
            <button className="btn btn-primary" onClick={openAddForm} style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
              ➕ Generate Payslip
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => window.print()}>⬇️ Download Report</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Monthly CTC", value: "₹1,11,000", sub: "Gross salary", icon: "💰", color: "#10b981" },
          { label: "Net Take-home", value: "₹98,400", sub: "After deductions", icon: "🏦", color: "#6366f1" },
          { label: "Total Deductions", value: "₹12,600", sub: "PF + Tax", icon: "📉", color: "#ef4444" },
          { label: "Annual CTC", value: "₹13,32,000", sub: "Yearly package", icon: "📈", color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{s.sub}</div>
              </div>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, width: "fit-content" }}>
        {(["payslips", "structure", "tax"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "8px 20px", fontSize: 13 }}
            id={`tab-${tab}`}
          >
            {tab === "payslips" ? "📄 Payslips" : tab === "structure" ? "🏗️ Salary Structure" : "📊 Tax Deductions"}
          </button>
        ))}
      </div>

      {activeTab === "payslips" && (
        <div className="glass-card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Month</th>
                  <th>Basic Salary</th>
                  <th>HRA</th>
                  <th>Gross Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedPayslips.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.employeeName}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.employeeId}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{p.month}</td>
                    <td>₹{Number(p.basicSalary).toLocaleString()}</td>
                    <td>₹{Number(p.hra).toLocaleString()}</td>
                    <td style={{ color: "#ef4444" }}>-₹{(Number(p.pf) + Number(p.tax)).toLocaleString()}</td>
                    <td style={{ fontWeight: 800, color: "#10b981", fontSize: 15 }}>₹{Number(p.netSalary).toLocaleString()}</td>
                    <td>
                      <span className="badge badge-success">✅ {p.status}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPayslip(p)}>View PDF</button>
                        {canManage && (
                          <button className="btn btn-secondary btn-sm" onClick={() => openEditForm(p)}>Edit</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {displayedPayslips.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                      No payslips found for your account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "structure" && (
        <div className="grid-2">
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-title" style={{ marginBottom: 20 }}>💼 Earnings</div>
            {[
              ["Basic Salary", SALARY_STRUCTURE.basicSalary],
              ["House Rent Allowance (HRA)", SALARY_STRUCTURE.hra],
              ["Travel Allowance (TA)", SALARY_STRUCTURE.ta],
              ["Dearness Allowance (DA)", SALARY_STRUCTURE.da],
              ["Special Allowance", SALARY_STRUCTURE.specialAllowance],
            ].map(([label, val]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{label}</span>
                <span style={{ fontWeight: 700, color: "#10b981" }}>₹{(val as number).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "2px solid rgba(99,102,241,0.3)", marginTop: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Gross Salary</span>
              <span style={{ fontWeight: 900, color: "#6366f1", fontSize: 18 }}>₹{SALARY_STRUCTURE.grossSalary.toLocaleString()}</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-title" style={{ marginBottom: 20 }}>📉 Deductions</div>
            {[
              ["Provident Fund (12%)", SALARY_STRUCTURE.pf],
              ["Professional Tax", SALARY_STRUCTURE.professionalTax],
              ["Income Tax (TDS)", SALARY_STRUCTURE.incomeTax],
            ].map(([label, val]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{label}</span>
                <span style={{ fontWeight: 700, color: "#ef4444" }}>-₹{(val as number).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "2px solid rgba(239,68,68,0.3)", marginTop: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Total Deductions</span>
              <span style={{ fontWeight: 900, color: "#ef4444", fontSize: 18 }}>₹{SALARY_STRUCTURE.totalDeductions.toLocaleString()}</span>
            </div>
            <div style={{
              marginTop: 20, padding: 16, background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))",
              borderRadius: 12, border: "1px solid rgba(16,185,129,0.3)"
            }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Net Take-home Salary</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#10b981" }}>₹{SALARY_STRUCTURE.netSalary.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tax" && (
        <div className="glass-card" style={{ padding: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>Tax Computation (FY 2025-26)</div>
          <div className="grid-2" style={{ gap: 24 }}>
            <div>
              <div style={{ fontWeight: 700, color: "#f59e0b", marginBottom: 12 }}>Income Breakdown</div>
              {[
                ["Annual Basic Salary", "₹8,40,000"],
                ["HRA Received", "₹2,52,000"],
                ["HRA Exemption", "-₹1,80,000"],
                ["Other Allowances", "₹1,56,000"],
                ["Gross Taxable Income", "₹10,68,000"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{l}</span>
                  <span style={{ fontWeight: 600, color: v.startsWith("-") ? "#ef4444" : "white" }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#10b981", marginBottom: 12 }}>Deductions & Savings</div>
              {[
                ["80C (PF + ELSS)", "₹1,50,000"],
                ["80D (Health Insurance)", "₹25,000"],
                ["Standard Deduction", "₹50,000"],
                ["Total Deductions", "₹2,25,000"],
                ["Net Taxable Income", "₹8,43,000"],
                ["Tax Payable (New Regime)", "₹48,000"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{l}</span>
                  <span style={{ fontWeight: 600, color: "#10b981" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View Payslip Modal */}
      {selectedPayslip && (
        <div className="modal-overlay" onClick={() => setSelectedPayslip(null)}>
          <div className="modal-content" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 28 }}>
              {/* Header */}
              <div style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "center"
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "white" }}>⚡ FWC IT Services Pvt. Ltd.</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>SALARY PAYSLIP – {selectedPayslip.month}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedPayslip.employeeName}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Software Engineer | Engineering</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 12 }}>EMP ID: {selectedPayslip.employeeId}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Paid On</div>
                  <div style={{ fontWeight: 700 }}>{selectedPayslip.paidOn}</div>
                </div>
              </div>

              <div className="grid-2" style={{ gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#10b981", marginBottom: 10, fontSize: 13 }}>EARNINGS</div>
                  {[["Basic", selectedPayslip.basicSalary], ["HRA", selectedPayslip.hra], ["TA", selectedPayslip.ta], ["DA", selectedPayslip.da]].map(([l, v]) => (
                    <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                      <span style={{ color: "var(--text-secondary)" }}>{l}</span>
                      <span style={{ fontWeight: 600 }}>₹{Number(v).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#ef4444", marginBottom: 10, fontSize: 13 }}>DEDUCTIONS</div>
                  {[["PF (12%)", selectedPayslip.pf], ["Income Tax", selectedPayslip.tax]].map(([l, v]) => (
                    <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                      <span style={{ color: "var(--text-secondary)" }}>{l}</span>
                      <span style={{ fontWeight: 600, color: "#ef4444" }}>-₹{Number(v).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))",
                border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12,
                padding: "16px 20px", marginTop: 20, marginBottom: 20,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>NET SALARY PAID</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#10b981" }}>₹{Number(selectedPayslip.netSalary).toLocaleString()}</div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => window.print()}>⬇️ Download PDF</button>
                <button className="btn btn-secondary" onClick={() => setSelectedPayslip(null)} style={{ flex: 1, justifyContent: "center" }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate / Edit Payslip Modal for HR/Admin */}
      {showPayslipForm && (
        <div className="modal-overlay" onClick={() => setShowPayslipForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 20 }}>{editingPayslipId ? "Edit Payslip" : "Generate Payslip"}</h2>
            <form onSubmit={handleSavePayslip} className="grid-2">
              <div className="form-group">
                <label>Employee Name</label>
                <input required className="input" value={payslipForm.employeeName} onChange={e => setPayslipForm({ ...payslipForm, employeeName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Payslip Month</label>
                <input required className="input" placeholder="e.g. June 2026" value={payslipForm.month} onChange={e => setPayslipForm({ ...payslipForm, month: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Basic Salary (₹)</label>
                <input required type="number" className="input" value={payslipForm.basicSalary} onChange={e => setPayslipForm({ ...payslipForm, basicSalary: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>HRA (₹)</label>
                <input required type="number" className="input" value={payslipForm.hra} onChange={e => setPayslipForm({ ...payslipForm, hra: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Travel Allowance (TA) (₹)</label>
                <input required type="number" className="input" value={payslipForm.ta} onChange={e => setPayslipForm({ ...payslipForm, ta: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Dearness Allowance (DA) (₹)</label>
                <input required type="number" className="input" value={payslipForm.da} onChange={e => setPayslipForm({ ...payslipForm, da: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>PF Deduction (₹)</label>
                <input required type="number" className="input" value={payslipForm.pf} onChange={e => setPayslipForm({ ...payslipForm, pf: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Income Tax (TDS) (₹)</label>
                <input required type="number" className="input" value={payslipForm.tax} onChange={e => setPayslipForm({ ...payslipForm, tax: Number(e.target.value) })} />
              </div>
              
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, marginTop: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                  {editingPayslipId ? "Save Changes" : "Generate Payslip"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPayslipForm(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
