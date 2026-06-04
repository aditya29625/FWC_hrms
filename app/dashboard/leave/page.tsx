"use client";
import { useState } from "react";
import { LEAVE_REQUESTS } from "@/lib/mockData";

const LEAVE_TYPES = ["Casual Leave", "Sick Leave", "Annual Leave", "Work From Home", "Maternity Leave", "Paternity Leave", "Emergency Leave"];

const LEAVE_BALANCE = [
  { type: "Casual Leave", total: 7, used: 3, color: "#6366f1" },
  { type: "Sick Leave", total: 7, used: 2, color: "#ef4444" },
  { type: "Annual Leave", total: 15, used: 5, color: "#10b981" },
  { type: "Work From Home", total: 24, used: 8, color: "#06b6d4" },
  { type: "Mental Health", total: 2, used: 0, color: "#8b5cf6" },
];

export default function LeavePage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: "Casual Leave", from: "", to: "", reason: "" });
  const [requests, setRequests] = useState(LEAVE_REQUESTS);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const from = new Date(formData.from);
    const to = new Date(formData.to);
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const newReq = {
      id: `L00${requests.length + 1}`,
      employeeId: "E004",
      employeeName: "Vikram Patel",
      type: formData.type,
      from: formData.from,
      to: formData.to,
      days,
      status: "Pending",
      reason: formData.reason,
      appliedOn: new Date().toISOString().split("T")[0],
    };
    setRequests([newReq, ...requests]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); setFormData({ type: "Casual Leave", from: "", to: "", reason: "" }); }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">Leave Management</div>
          <div className="section-subtitle">Apply and track your leave requests</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} id="apply-leave-btn">
          + Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {LEAVE_BALANCE.map(lb => (
          <div key={lb.type} className="glass-card" style={{ flex: "1 1 160px", padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: lb.color, marginBottom: 4 }}>{lb.total - lb.used}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{lb.type}</div>
            <div className="progress-bar" style={{ marginBottom: 6 }}>
              <div className="progress-fill" style={{ width: `${(lb.used / lb.total) * 100}%`, background: lb.color }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{lb.used} used / {lb.total} total</div>
          </div>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="glass-card">
        <div style={{ padding: "20px 20px 0" }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Leave History</div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 600, color: "#6366f1", fontSize: 13 }}>{req.id}</td>
                  <td>
                    <span className="badge badge-primary">{req.type}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>{req.from}</td>
                  <td style={{ fontSize: 13 }}>{req.to}</td>
                  <td style={{ fontWeight: 700, color: "#f59e0b" }}>{req.days}d</td>
                  <td style={{ fontSize: 12, color: "var(--text-secondary)", maxWidth: 180 }}>{req.reason}</td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{req.appliedOn}</td>
                  <td>
                    <span className={`badge ${req.status === "Approved" ? "badge-success" : req.status === "Pending" ? "badge-warning" : "badge-danger"}`}>
                      {req.status === "Approved" ? "✅ " : req.status === "Pending" ? "⏳ " : "❌ "}
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === "Pending" && (
                      <button className="btn btn-danger btn-sm" onClick={() => setRequests(requests.filter(r => r.id !== req.id))}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Apply for Leave</h2>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer" }}>✕</button>
              </div>

              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981", marginBottom: 8 }}>Request Submitted!</div>
                  <div style={{ color: "var(--text-secondary)" }}>Your leave request has been sent for approval.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="form-label">Leave Type *</label>
                    <select className="form-input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required id="leave-type">
                      {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="grid-2">
                    <div>
                      <label className="form-label">From Date *</label>
                      <input type="date" className="form-input" value={formData.from} onChange={e => setFormData({ ...formData, from: e.target.value })} required id="leave-from" />
                    </div>
                    <div>
                      <label className="form-label">To Date *</label>
                      <input type="date" className="form-input" value={formData.to} onChange={e => setFormData({ ...formData, to: e.target.value })} required id="leave-to" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Reason *</label>
                    <textarea className="form-input" rows={4} placeholder="Please describe the reason for your leave..." value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} required style={{ resize: "vertical" }} id="leave-reason" />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} id="leave-submit">Submit Request</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
