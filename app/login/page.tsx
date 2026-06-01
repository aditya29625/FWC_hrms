"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const DEMO_ACCOUNTS = [
  { role: "Management Admin", email: "admin@fwcit.com", password: "admin123", color: "#6366f1", icon: "👑" },
  { role: "Senior Manager", email: "manager@fwcit.com", password: "manager123", color: "#06b6d4", icon: "🎯" },
  { role: "HR Recruiter", email: "hr@fwcit.com", password: "hr123", color: "#10b981", icon: "🤝" },
  { role: "Employee", email: "employee@fwcit.com", password: "emp123", color: "#f59e0b", icon: "👤" },
];

const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Finance",
  "Sales",
  "Design",
  "Operations",
  "Customer Support",
  "Administration"
];

const ROLES = [
  { value: "employee", label: "Employee" },
  { value: "recruiter", label: "HR Recruiter" },
  { value: "manager", label: "Senior Manager" },
  { value: "admin", label: "Management Admin" },
];

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign up fields state
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Mumbai");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("Engineering");
  const [position, setPosition] = useState("Software Engineer");

  const { login, register } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password. Please try a demo account below.");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword || !phone || !position) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const success = await register({
      name,
      email,
      phone,
      location,
      role,
      department,
      position,
    }, password);

    if (success) {
      router.push("/dashboard");
    } else {
      setError("This email is already registered. Please sign in or use another email.");
    }
    setLoading(false);
  };

  const quickLogin = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setLoading(true);
    const success = await login(acc.email, acc.password);
    if (success) router.push("/dashboard");
    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setPhone("");
    setRole("employee");
    setDepartment("Engineering");
    setPosition("Software Engineer");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-dark)",
      display: "flex",
      position: "relative",
      overflowY: "auto",
      overflowX: "hidden"
    }}>
      {/* Background Effects */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(6,182,212,0.08) 0%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Left Panel */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px",
        position: "relative",
        zIndex: 1
      }} className="hide-mobile">
        <div className="animate-fade-in">
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 40
          }}>
            <div style={{
              width: 48, height: 48,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22
            }}>⚡</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>FWC IT Services</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Pvt. Ltd.</div>
            </div>
          </div>

          <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
            The Future of <br/>
            <span className="gradient-text">HR Management</span><br/>
            is Here
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.7, maxWidth: 460, marginBottom: 40 }}>
            AI-powered HRMS designed for modern workplaces. Streamline recruitment, payroll, 
            attendance, and performance management with intelligent automation.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["🤖 AI Resume Screening & Scoring", "💬 Intelligent HR Chatbot Assistant", "📊 Predictive Performance Analytics", "🎙️ AI Interview Question Generator"].map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                animation: `fadeIn 0.5s ease ${i * 0.1}s both`
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }} />
                <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{f}</span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 48,
            display: "flex", gap: 32
          }}>
            {[["5000+", "Employees"], ["99.9%", "Uptime"], ["50+", "AI Features"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{num}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – Login/Signup Form */}
      <div style={{
        width: "100%",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 40px",
        background: "rgba(255,255,255,0.03)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        zIndex: 1,
        minHeight: "100vh",
        boxSizing: "border-box"
      }}>
        <div className="animate-scale-in">
          {/* Form Headers */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {isSignUp ? "Sign up to join the HRMS demo environment" : "Sign in to your HRMS account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            
            {isSignUp && (
              <>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Vikram Patel"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="form-label">Email Address *</label>
              <input
                className="form-input"
                type="email"
                placeholder={isSignUp ? "e.g. vikram@fwcit.com" : "your@fwcit.com"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                id="login-email"
              />
            </div>

            {isSignUp && (
              <>
                <div className="grid-2" style={{ gap: 10 }}>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="+91 98765 43213"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Location</label>
                    <select
                      className="form-input"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                    >
                      {["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad", "Remote"].map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 10 }}>
                  <div>
                    <label className="form-label">Target Role</label>
                    <select
                      className="form-input"
                      value={role}
                      onChange={e => {
                        setRole(e.target.value);
                        // Auto populate position based on role
                        if (e.target.value === "admin") setPosition("Management Admin");
                        else if (e.target.value === "manager") setPosition("Senior Manager");
                        else if (e.target.value === "recruiter") setPosition("HR Recruiter");
                        else setPosition("Software Engineer");
                      }}
                    >
                      {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <select
                      className="form-input"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Job Title / Position *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="grid-2" style={{ gap: isSignUp ? 10 : 0, gridTemplateColumns: isSignUp ? "1fr 1fr" : "1fr" }}>
              <div>
                <label className="form-label">Password *</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  id="login-password"
                />
              </div>
              {isSignUp && (
                <div>
                  <label className="form-label">Confirm Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8, padding: "10px 14px",
                color: "#ef4444", fontSize: 13
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="login-submit"
              style={{ justifyContent: "center", padding: "13px 20px", fontSize: 15, marginTop: 4 }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </>
              ) : isSignUp ? "Create Account & Login →" : "Sign In →"}
            </button>
          </form>

          {/* Toggle Switch */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 13.5 }}>
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button
              onClick={toggleMode}
              style={{
                background: "none",
                border: "none",
                color: "#818cf8",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 13.5,
                padding: "2px 6px"
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          {/* Quick Demo Access (only show in Login mode to keep things tidy) */}
          {!isSignUp && (
            <>
              <div style={{ margin: "24px 0", position: "relative", textAlign: "center" }}>
                <div style={{ height: 1, background: "var(--border)", position: "absolute", top: "50%", left: 0, right: 0 }} />
                <span style={{ background: "var(--bg-dark)", padding: "0 12px", color: "var(--text-muted)", fontSize: 13, position: "relative" }}>
                  Quick Demo Access
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.role}
                    onClick={() => quickLogin(acc)}
                    className="btn btn-secondary"
                    id={`demo-${acc.role.toLowerCase().replace(" ", "-")}`}
                    style={{ justifyContent: "flex-start", gap: 12, padding: "10px 14px" }}
                  >
                    <span style={{ fontSize: 18 }}>{acc.icon}</span>
                    <div style={{ textAlign: "left", flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{acc.role}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{acc.email}</div>
                    </div>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 20,
                      background: `${acc.color}20`, color: acc.color,
                      border: `1px solid ${acc.color}40`
                    }}>Login</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12, marginTop: 24 }}>
            © 2026 FWC IT Services Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
