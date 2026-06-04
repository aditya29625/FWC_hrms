"use client";
import { useState } from "react";
import { ANNOUNCEMENTS as INITIAL_ANNOUNCEMENTS } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "High" | "Medium" | "Low";
  by: string;
  acknowledged?: boolean;
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    (INITIAL_ANNOUNCEMENTS as Announcement[]).map(a => ({ ...a, acknowledged: false }))
  );
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formPriority, setFormPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [formContent, setFormContent] = useState("");
  const [formBy, setFormBy] = useState("HR Team");

  // Check if role is admin, manager, or recruiter
  const canPublish = user?.role === "admin" || user?.role === "manager" || user?.role === "recruiter";

  const handleOpenAdd = () => {
    setFormTitle("");
    setFormPriority("Medium");
    setFormContent("");
    setFormBy(user?.role === "admin" ? "Admin Team" : user?.role === "manager" ? "Management" : "HR Team");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) return;

    const newAnn: Announcement = {
      id: `A0${announcements.length + 1}`,
      title: formTitle,
      content: formContent,
      date: new Date().toISOString().split("T")[0],
      priority: formPriority,
      by: formBy,
      acknowledged: false,
    };

    setAnnouncements([newAnn, ...announcements]);
    setIsModalOpen(false);
  };

  const toggleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnnouncements(announcements.map(a => {
      if (a.id === id) {
        return { ...a, acknowledged: !a.acknowledged };
      }
      return a;
    }));
  };

  const filtered = announcements.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()) ||
      a.by.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "All" || a.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const getPriorityColor = (p: string) => {
    if (p === "High") return { bg: "rgba(239, 68, 68, 0.1)", text: "#f87171", border: "rgba(239, 68, 68, 0.2)", left: "#ef4444" };
    if (p === "Medium") return { bg: "rgba(245, 158, 11, 0.1)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.2)", left: "#f59e0b" };
    return { bg: "rgba(16, 185, 129, 0.1)", text: "#34d399", border: "rgba(16, 185, 129, 0.2)", left: "#10b981" };
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Announcements</h1>
          <p className="section-subtitle">Stay updated with company-wide notices, policies, and event broadcasts</p>
        </div>
        {canPublish && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <span>📢</span> <span>New Broadcast</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          className="form-input"
          placeholder="🔍 Search announcements..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select
          className="form-input"
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          style={{ width: 160 }}
        >
          <option value="All">All Priorities</option>
          <option value="High">🔴 High Priority</option>
          <option value="Medium">🟡 Medium Priority</option>
          <option value="Low">🟢 Low Priority</option>
        </select>
      </div>

      {/* Announcements List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            No announcements found matching the criteria.
          </div>
        ) : (
          filtered.map(ann => {
            const colors = getPriorityColor(ann.priority);
            return (
              <div
                key={ann.id}
                className="glass-card"
                style={{
                  padding: "20px 24px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderLeft: `5px solid ${colors.left}`,
                  background: ann.acknowledged ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.03)",
                  opacity: ann.acknowledged ? 0.75 : 1
                }}
                onClick={() => setSelectedAnn(ann)}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{ann.title}</h3>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`
                    }}>
                      {ann.priority}
                    </span>
                    {ann.acknowledged && (
                      <span style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 3 }}>
                        ✅ Acknowledged
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{ann.date}</span>
                </div>

                <p style={{
                  fontSize: 13.5,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  margin: "12px 0 16px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {ann.content}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                    Published by: <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{ann.by}</span>
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => toggleAcknowledge(ann.id, e)}
                      style={{ padding: "4px 10px", fontSize: 11, background: ann.acknowledged ? "rgba(16,185,129,0.1)" : "transparent" }}
                    >
                      {ann.acknowledged ? "Mark Unread" : "Acknowledge"}
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ padding: "4px 10px", fontSize: 11 }}>
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Announcement Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 550 }}>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Broadcast Announcement</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}>✕</button>
              </div>

              <form onSubmit={handleSave}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Broadcast Title *</label>
                    <input
                      className="form-input"
                      required
                      placeholder="e.g. Server Maintenance Notice"
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className="grid-2" style={{ gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Priority Level</label>
                      <select
                        className="form-input"
                        value={formPriority}
                        onChange={e => setFormPriority(e.target.value as any)}
                        style={{ width: "100%" }}
                      >
                        <option value="High">🔴 High Priority</option>
                        <option value="Medium">🟡 Medium Priority</option>
                        <option value="Low">🟢 Low Priority</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Publisher Entity</label>
                      <select
                        className="form-input"
                        value={formBy}
                        onChange={e => setFormBy(e.target.value)}
                        style={{ width: "100%" }}
                      >
                        <option value="HR Team">HR Team</option>
                        <option value="Admin Team">Admin Team</option>
                        <option value="Management">Management</option>
                        <option value="IT Support">IT Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Announcement Content *</label>
                    <textarea
                      className="form-input"
                      required
                      rows={6}
                      placeholder="Enter the broadcast details here..."
                      value={formContent}
                      onChange={e => setFormContent(e.target.value)}
                      style={{ width: "100%", fontFamily: "inherit", resize: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Publish Broadcast</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {selectedAnn && (
        <div className="modal-overlay" onClick={() => setSelectedAnn(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div style={{ padding: 28 }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", paddingRight: 20 }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: getPriorityColor(selectedAnn.priority).bg,
                    color: getPriorityColor(selectedAnn.priority).text,
                    border: `1px solid ${getPriorityColor(selectedAnn.priority).border}`
                  }}>
                    {selectedAnn.priority} Priority
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>📅 Published: {selectedAnn.date}</span>
                </div>
                <button onClick={() => setSelectedAnn(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 24, cursor: "pointer", marginTop: -6 }}>✕</button>
              </div>

              {/* Title */}
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 16 }}>{selectedAnn.title}</h2>

              {/* Publisher Card */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", background: "rgba(255,255,255,0.02)",
                borderRadius: 8, border: "1px solid var(--border)", marginBottom: 20
              }}>
                <span style={{ fontSize: 18 }}>📢</span>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: "var(--text-muted)" }}>Author: </span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{selectedAnn.by}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{
                fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6,
                maxHeight: 280, overflowY: "auto", paddingRight: 8, whiteSpace: "pre-line", marginBottom: 24
              }}>
                {selectedAnn.content}
              </div>

              {/* Footer Buttons */}
              <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    toggleAcknowledge(selectedAnn.id, e);
                    setSelectedAnn(prev => prev ? { ...prev, acknowledged: !prev.acknowledged } : null);
                  }}
                  style={{
                    background: selectedAnn.acknowledged ? "rgba(16,185,129,0.1)" : "transparent",
                    color: selectedAnn.acknowledged ? "#34d399" : "var(--text-secondary)"
                  }}
                >
                  {selectedAnn.acknowledged ? "✓ Acknowledged" : "Acknowledge Read"}
                </button>
                <button className="btn btn-primary" onClick={() => setSelectedAnn(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
