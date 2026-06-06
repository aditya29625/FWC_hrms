"use client";
import { useState } from "react";
import { PERFORMANCE_REVIEWS, EMPLOYEES } from "@/lib/mockData";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { predictPerformance, PerformancePrediction } from "@/lib/aiFeatures";

const QUARTERLY_TREND = [
  { quarter: "Q3 2025", rating: 3.5, kpi: 75 },
  { quarter: "Q4 2025", rating: 3.8, kpi: 80 },
  { quarter: "Q1 2026", rating: 4.2, kpi: 85 },
  { quarter: "Q2 2026 (Pred)", rating: 4.5, kpi: 89, predicted: true },
];

const KPI_DATA = [
  { subject: "Code Quality", A: 85 },
  { subject: "Delivery", A: 90 },
  { subject: "Teamwork", A: 88 },
  { subject: "Innovation", A: 78 },
  { subject: "Leadership", A: 72 },
  { subject: "Communication", A: 82 },
];

export default function PerformancePage() {
  const [aiPrediction, setAiPrediction] = useState<PerformancePrediction | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [activeReview, setActiveReview] = useState<typeof PERFORMANCE_REVIEWS[0] | null>(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const runAiPrediction = async () => {
    setPredicting(true);
    const result = await predictPerformance({
      name: "Vikram Patel",
      currentScore: 82,
      attendance: 94,
      leaves: 7,
      recentRatings: [75, 80, 82],
    });
    setAiPrediction(result);
    setPredicting(false);
  };

  const RISK_COLORS = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };
  const TREND_COLORS = { Improving: "#10b981", Stable: "#6366f1", Declining: "#ef4444" };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">Performance Management</div>
          <div className="section-subtitle">Track KPIs, reviews and AI-powered insights</div>
        </div>
        <button className="btn btn-primary" onClick={runAiPrediction} disabled={predicting} id="ai-predict-btn">
          {predicting ? <><div className="spinner" /> Analyzing...</> : "🤖 AI Predict Performance"}
        </button>
      </div>

      {/* Current Score Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
        border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: 28, marginBottom: 24,
        display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 900, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>82</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Overall Score</div>
        </div>
        <div style={{ height: 80, width: 1, background: "var(--border)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "Current Rating", value: "4.2 / 5", color: "#f59e0b" },
              { label: "Goals Achieved", value: "7 / 8", color: "#10b981" },
              { label: "Q1 Rank", value: "#3 / 12", color: "#6366f1" },
              { label: "Last Review", value: "April 2026", color: "var(--text-secondary)" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <span className="badge badge-success">⬆️ Improving</span>
            <span className="badge badge-primary">Top Performer</span>
          </div>
        </div>
      </div>

      {/* AI Prediction Panel */}
      {aiPrediction && (
        <div style={{
          background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(99,102,241,0.1))",
          border: "1px solid rgba(6,182,212,0.3)", borderRadius: 20, padding: 24, marginBottom: 24,
          animation: "fadeIn 0.5s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#06b6d4" }}>AI Performance Prediction – Q2 2026</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Powered by FWC AI Engine</div>
            </div>
            <span className="badge badge-info" style={{ marginLeft: "auto" }}>AI Generated</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#06b6d4" }}>{aiPrediction.nextQuarterScore}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Predicted Score</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: TREND_COLORS[aiPrediction.trend] }}>
                {aiPrediction.trend === "Improving" ? "📈" : aiPrediction.trend === "Stable" ? "📊" : "📉"} {aiPrediction.trend}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Performance Trend</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: RISK_COLORS[aiPrediction.riskLevel] }}>
                {aiPrediction.riskLevel} Risk
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Attrition Risk</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#f59e0b" }}>{aiPrediction.predictedRating.toFixed(1)}/5</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Predicted Rating</div>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, color: "#10b981", fontSize: 13, marginBottom: 8 }}>✅ Key Strengths</div>
              {aiPrediction.keyFactors.map((f, i) => (
                <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", padding: "4px 0" }}>• {f}</div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: 13, marginBottom: 8 }}>💡 Recommendations</div>
              {aiPrediction.recommendations.map((r, i) => (
                <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", padding: "4px 0" }}>• {r}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* KPI Radar */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>KPI Breakdown</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={KPI_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Trend */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Rating Trend</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={QUARTERLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="quarter" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[3, 5]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="rating" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 5 }} name="Rating" />
              <Line type="monotone" dataKey="kpi" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#10b981", r: 4 }} name="KPI Score" yAxisId={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Review History */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div style={{ padding: "20px 20px 0" }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Review History</div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Rating</th>
                <th>Goals</th>
                <th>Achieved</th>
                <th>Reviewed By</th>
                <th>Feedback</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {PERFORMANCE_REVIEWS.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.reviewPeriod}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 800, color: "#f59e0b", fontSize: 16 }}>{r.rating}</span>
                      <span style={{ color: "#f59e0b" }}>{"★".repeat(Math.round(r.rating))}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.goals}</td>
                  <td style={{ fontWeight: 700, color: "#10b981" }}>{r.achieved}</td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{r.reviewedBy}</td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 200 }}>{r.feedback.slice(0, 60)}...</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveReview(r)}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goals Section */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>🎯 Current Quarter Goals (Q2 2026)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { goal: "Complete API Gateway Migration", progress: 85, due: "June 30", status: "On Track" },
            { goal: "Improve code test coverage to 80%", progress: 60, due: "June 15", status: "In Progress" },
            { goal: "Mentor 2 junior developers", progress: 100, due: "June 10", status: "Completed" },
            { goal: "Complete AWS Developer certification", progress: 40, due: "July 15", status: "In Progress" },
            { goal: "Document 10 internal APIs", progress: 20, due: "June 25", status: "At Risk" },
          ].map((g, i) => (
            <div key={i} style={{ padding: 14, background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{g.goal}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Due: {g.due}</span>
                  <span className={`badge ${g.status === "Completed" ? "badge-success" : g.status === "On Track" ? "badge-info" : g.status === "At Risk" ? "badge-danger" : "badge-warning"}`}>{g.status}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{
                    width: `${g.progress}%`,
                    background: g.progress === 100 ? "linear-gradient(90deg,#10b981,#059669)" : g.progress >= 60 ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "linear-gradient(90deg,#f59e0b,#d97706)"
                  }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 13, width: 36 }}>{g.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 360 Feedback */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="section-title" style={{ marginBottom: 4 }}>💬 Submit 360° Feedback</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Provide anonymous feedback for your colleagues</div>
        {feedbackSubmitted ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 44 }}>🙏</div>
            <div style={{ fontWeight: 700, color: "#10b981", marginTop: 8 }}>Feedback submitted anonymously!</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <select className="form-input" style={{ maxWidth: 300 }} id="feedback-target">
              <option>Select Colleague</option>
              <option>Priya Sharma</option>
              <option>Anita Desai</option>
              <option>Meera Singh</option>
            </select>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Share constructive feedback about this colleague's work, collaboration, and leadership..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              style={{ resize: "vertical" }}
              id="feedback-text"
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={() => { if (feedback.trim()) { setFeedbackSubmitted(true); setFeedback(""); } }}
                id="submit-feedback-btn"
              >
                Submit Anonymous Feedback
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {activeReview && (
        <div className="modal-overlay" onClick={() => setActiveReview(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Review – {activeReview.reviewPeriod}</h2>
                <button onClick={() => setActiveReview(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                {[
                  ["Rating", `${activeReview.rating} / 5`],
                  ["Goals Set", String(activeReview.goals)],
                  ["Goals Achieved", String(activeReview.achieved)],
                  ["Reviewed By", activeReview.reviewedBy],
                  ["Review Date", activeReview.reviewDate],
                ].map(([l, v]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.04)", padding: "10px 16px", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{l}</div>
                    <div style={{ fontWeight: 700, color: "#6366f1" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>KPI Scores</div>
                <div className="grid-2">
                  {Object.entries(activeReview.kpis).map(([k, v]) => (
                    <div key={k}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                        <span style={{ textTransform: "capitalize", color: "var(--text-secondary)" }}>{k}</span>
                        <span style={{ fontWeight: 700 }}>{v}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Manager Feedback</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{activeReview.feedback}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
