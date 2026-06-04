"use client";
import { useState } from "react";
import { ATTENDANCE, ATTENDANCE_CHART } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ATTENDANCE_DATA = [
  { date: "2026-06-01", day: "Sun", checkIn: "-", checkOut: "-", status: "Weekend", hours: 0 },
  { date: "2026-06-02", day: "Mon", checkIn: "09:02", checkOut: "18:05", status: "Present", hours: 9 },
  { date: "2026-06-03", day: "Tue", checkIn: "08:55", checkOut: "17:58", status: "Present", hours: 9 },
  { date: "2026-06-04", day: "Wed", checkIn: "09:15", checkOut: "18:30", status: "Late", hours: 9.2 },
  { date: "2026-06-05", day: "Thu", checkIn: "-", checkOut: "-", status: "Absent", hours: 0 },
  { date: "2026-06-06", day: "Fri", checkIn: "09:00", checkOut: "18:00", status: "Present", hours: 9 },
  { date: "2026-06-07", day: "Sat", checkIn: "-", checkOut: "-", status: "Weekend", hours: 0 },
  { date: "2026-06-08", day: "Sun", checkIn: "-", checkOut: "-", status: "Weekend", hours: 0 },
  { date: "2026-06-09", day: "Mon", checkIn: "09:05", checkOut: "18:10", status: "Present", hours: 9 },
  { date: "2026-06-10", day: "Tue", checkIn: "09:00", checkOut: "18:00", status: "Present", hours: 9 },
];

const STATUS_COLORS: Record<string, string> = {
  Present: "#10b981",
  Absent: "#ef4444",
  Late: "#f59e0b",
  Weekend: "#64748b",
  "On Leave": "#6366f1",
};

export default function AttendancePage() {
  const [month, setMonth] = useState("June 2026");
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setCheckedIn(true);
    setCheckInTime(time);
  };

  const presentDays = ATTENDANCE_DATA.filter(d => d.status === "Present").length;
  const absentDays = ATTENDANCE_DATA.filter(d => d.status === "Absent").length;
  const lateDays = ATTENDANCE_DATA.filter(d => d.status === "Late").length;
  const totalHours = ATTENDANCE_DATA.reduce((s, d) => s + d.hours, 0);

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">Attendance Management</div>
          <div className="section-subtitle">Track daily attendance and working hours</div>
        </div>
        <select className="form-input" style={{ width: 160 }} value={month} onChange={e => setMonth(e.target.value)}>
          {["June 2026", "May 2026", "April 2026", "March 2026"].map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Check-in Widget */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.15))",
        border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20,
        padding: 28, marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
      }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>
            {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          {checkInTime && (
            <div style={{ marginTop: 8, color: "#10b981", fontSize: 13, fontWeight: 600 }}>
              ✅ Checked in at {checkInTime}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleCheckIn}
            disabled={checkedIn}
            className="btn btn-primary"
            id="check-in-btn"
            style={{ padding: "14px 28px", fontSize: 15, opacity: checkedIn ? 0.6 : 1 }}
          >
            {checkedIn ? "✅ Checked In" : "🕘 Check In"}
          </button>
          {checkedIn && (
            <button
              onClick={() => { setCheckedIn(false); setCheckInTime(null); }}
              className="btn btn-secondary"
              id="check-out-btn"
              style={{ padding: "14px 28px", fontSize: 15 }}
            >
              🏠 Check Out
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Present Days", value: presentDays, color: "#10b981", icon: "✅" },
          { label: "Absent Days", value: absentDays, color: "#ef4444", icon: "❌" },
          { label: "Late Arrivals", value: lateDays, color: "#f59e0b", icon: "⏰" },
          { label: "Total Hours", value: `${totalHours.toFixed(0)}h`, color: "#6366f1", icon: "⏱️" },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-sidebar">
        {/* Attendance Log */}
        <div className="glass-card">
          <div style={{ padding: "20px 20px 0" }}>
            <div className="section-title" style={{ marginBottom: 16 }}>Daily Attendance Log</div>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ATTENDANCE_DATA.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{row.date}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{row.day}</td>
                    <td style={{ fontFamily: "monospace", color: "#06b6d4" }}>{row.checkIn}</td>
                    <td style={{ fontFamily: "monospace", color: "#8b5cf6" }}>{row.checkOut}</td>
                    <td style={{ fontWeight: 600 }}>{row.hours > 0 ? `${row.hours}h` : "-"}</td>
                    <td>
                      <span className="badge" style={{
                        background: `${STATUS_COLORS[row.status]}20`,
                        color: STATUS_COLORS[row.status],
                        border: `1px solid ${STATUS_COLORS[row.status]}40`
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Weekly Chart */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div className="section-title" style={{ marginBottom: 16, fontSize: 16 }}>This Week</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={ATTENDANCE_CHART}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} name="Present" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div className="section-title" style={{ marginBottom: 16, fontSize: 16 }}>Monthly Summary</div>
            {[
              { label: "Working Days", value: "22", color: "var(--text-primary)" },
              { label: "Days Present", value: String(presentDays), color: "#10b981" },
              { label: "Days Absent", value: String(absentDays), color: "#ef4444" },
              { label: "Late Arrivals", value: String(lateDays), color: "#f59e0b" },
              { label: "Attendance %", value: `${Math.round((presentDays / 22) * 100)}%`, color: "#6366f1" },
            ].map(s => (
              <div key={s.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: "1px solid var(--border)"
              }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Regularization Request */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div className="section-title" style={{ marginBottom: 12, fontSize: 16 }}>Regularize Attendance</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label className="form-label">Date</label>
                <input type="date" className="form-input" />
              </div>
              <div>
                <label className="form-label">Reason</label>
                <textarea className="form-input" rows={2} placeholder="Reason for regularization..." style={{ resize: "none" }} />
              </div>
              <button className="btn btn-primary" style={{ justifyContent: "center" }}>Submit Request</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
