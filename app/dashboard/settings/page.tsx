"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user } = useAuth();

  // Profile fields state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("");

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [aiReportAlert, setAiReportAlert] = useState(true);

  // Admin Config fields
  const [aiScreenerEnabled, setAiScreenerEnabled] = useState(true);
  const [autoAttendanceEnabled, setAutoAttendanceEnabled] = useState(true);
  const [annualLeavesLimit, setAnnualLeavesLimit] = useState(18);

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "system">("profile");
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Sync state with user context on mount
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
      setLocation(user.location || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      email,
      phone,
      location,
      avatar: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
    };

    localStorage.setItem("hrms_user", JSON.stringify(updatedUser));
    showFeedback("Profile details saved successfully! Refresh page to update sidebar.");
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showFeedback("Please fill out all fields.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showFeedback("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showFeedback("Password must be at least 6 characters.", "error");
      return;
    }

    // Success simulation
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showFeedback("Password updated successfully!");
  };

  const handleNotificationsSave = (e: React.FormEvent) => {
    e.preventDefault();
    showFeedback("Notification preferences updated.");
  };

  const handleSystemSave = (e: React.FormEvent) => {
    e.preventDefault();
    showFeedback("System organization configurations saved.");
  };

  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Settings</h1>
          <p className="section-subtitle">Manage your personal credentials, communication alerts, and system policies</p>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div style={{
          padding: "12px 18px",
          borderRadius: 8,
          marginBottom: 16,
          background: feedbackMsg.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
          color: feedbackMsg.type === "success" ? "#34d399" : "#f87171",
          border: `1px solid ${feedbackMsg.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
          fontSize: 13,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <span>{feedbackMsg.type === "success" ? "✅" : "⚠️"}</span>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 24, flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Navigation Sidebar */}
        <div className="glass-card" style={{ padding: 12, width: 220, display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          {[
            { id: "profile", label: "👤 Profile Details" },
            { id: "security", label: "🔒 Security & Auth" },
            { id: "notifications", label: "🔔 Notifications" },
            ...(isAdminOrManager ? [{ id: "system", label: "⚙️ System Config" }] : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="nav-item"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: activeTab === tab.id ? "rgba(99,102,241,0.12)" : "transparent",
                color: activeTab === tab.id ? "#818cf8" : "var(--text-secondary)",
                border: activeTab === tab.id ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                borderRadius: 8,
                textAlign: "left",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Configurations Form Panel */}
        <div className="glass-card" style={{ flex: 1, padding: 24, minWidth: 280 }}>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: "white" }}>Personal Profile Details</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
                  <div className="avatar avatar-xl" style={{ fontSize: 22, background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    {avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{user?.position} • {user?.department}</div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>Full Name *</label>
                  <input
                    className="form-input"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>Email Address *</label>
                  <input
                    className="form-input"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>Phone Number</label>
                    <input
                      className="form-input"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>Office Location</label>
                    <input
                      className="form-input"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <form onSubmit={handleSecuritySave}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: "white" }}>Security & Credentials</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>Current Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>New Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>Confirm New Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary">Update Password</button>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <form onSubmit={handleNotificationsSave}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: "white" }}>Notification Channels & Alerts</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    title: "Email Notifications",
                    desc: "Receive transactional emails for leave status, salary updates, and document processing.",
                    state: emailNotif,
                    setState: setEmailNotif
                  },
                  {
                    title: "Push Notifications",
                    desc: "Receive desktop sound notifications for newly published announcements and messages.",
                    state: pushNotif,
                    setState: setPushNotif
                  },
                  {
                    title: "Weekly Performance Digest",
                    desc: "A summary email report showing team performance progress and target goals.",
                    state: weeklyDigest,
                    setState: setWeeklyDigest
                  },
                  {
                    title: "AI Analysis Alert Trigger",
                    desc: "Be notified immediately if the AI Performance Predictor identifies an attrition risk employee.",
                    state: aiReportAlert,
                    setState: setAiReportAlert
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 12,
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    gap: 12
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "white" }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
                    </div>
                    <label className="switch" style={{ position: "relative", display: "inline-block", width: 40, height: 22 }}>
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={e => item.setState(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: item.state ? "#6366f1" : "rgba(255,255,255,0.1)",
                        borderRadius: 34,
                        transition: "0.2s",
                      }}>
                        <span style={{
                          position: "absolute",
                          content: '""',
                          height: 16, width: 16,
                          left: item.state ? 21 : 3,
                          bottom: 3,
                          backgroundColor: "white",
                          borderRadius: "50%",
                          transition: "0.2s",
                        }} />
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary">Save Preferences</button>
              </div>
            </form>
          )}

          {/* System Config Tab */}
          {activeTab === "system" && isAdminOrManager && (
            <form onSubmit={handleSystemSave}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: "white" }}>Organization & System Policies</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    title: "Enable AI Resume Screening",
                    desc: "Allow the Recruitment module to automatically evaluate and score incoming candidate applications.",
                    state: aiScreenerEnabled,
                    setState: setAiScreenerEnabled
                  },
                  {
                    title: "Auto Attendance Processing",
                    desc: "Map checkin timings dynamically to calculate active hours and mark late arrivals.",
                    state: autoAttendanceEnabled,
                    setState: setAutoAttendanceEnabled
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 12,
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    gap: 12
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "white" }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
                    </div>
                    <label className="switch" style={{ position: "relative", display: "inline-block", width: 40, height: 22 }}>
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={e => item.setState(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: item.state ? "#10b981" : "rgba(255,255,255,0.1)",
                        borderRadius: 34,
                        transition: "0.2s",
                      }}>
                        <span style={{
                          position: "absolute",
                          content: '""',
                          height: 16, width: 16,
                          left: item.state ? 21 : 3,
                          bottom: 3,
                          backgroundColor: "white",
                          borderRadius: "50%",
                          transition: "0.2s",
                        }} />
                      </span>
                    </label>
                  </div>
                ))}

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>Default Annual Leaves Allocation</label>
                  <input
                    className="form-input"
                    type="number"
                    value={annualLeavesLimit}
                    onChange={e => setAnnualLeavesLimit(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Standard leave balance allocated to new employee profiles.</div>
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary">Save Policy Changes</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
