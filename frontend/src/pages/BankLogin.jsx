import { useState } from "react";
import api from "../services/api";

export default function BankLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const login = async () => {
    try {
      const res = await api.login(username, password);
      console.log("LOGIN SUCCESS:", res);
      localStorage.setItem("token", "dummy");
      window.location.href = "/bank/dashboard";
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.loginContainer}>
        
        {/* LEFT SIDE: Visual Brand Panel */}
        <div style={styles.imagePanel}>
          <div style={styles.imageOverlay}>
            <div style={styles.brandBadge}>Nexus Security</div>
            <h2 style={styles.imageText}>Banking reimagined for the digital age.</h2>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div style={styles.formPanel}>
          <header style={{ marginBottom: "40px" }}>
            <h1 style={styles.brandTitle}>Nexus Bank</h1>
            <p style={styles.brandSubtitle}>Secure Digital Banking Platform</p>
          </header>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              placeholder="e.g. johndoe_nx"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button
            onClick={login}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              ...styles.loginButton,
              transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: isHovered ? "0 10px 20px rgba(99, 102, 241, 0.4)" : "none"
            }}
          >
            Sign In to Account
          </button>

          <footer style={styles.footer}>
            <div style={styles.securityIndicator}>
              <span style={styles.shieldIcon}>🛡️</span>
              API activity is protected by 256-bit SSL encryption.
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
}

// --- Industry Level Styling ---
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0e17",
    backgroundImage: "radial-gradient(circle at 2px 2px, #1a202c 1px, transparent 0)",
    backgroundSize: "40px 40px",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
  },
  loginContainer: {
    display: "flex",
    width: "1000px",
    minHeight: "600px",
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(12px)",
    borderRadius: "28px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
  },
  imagePanel: {
    flex: 1.2,
    backgroundImage: "url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
  },
  imageOverlay: {
    padding: "40px",
    background: "linear-gradient(to top, rgba(10, 14, 23, 0.9), transparent)",
    width: "100%",
  },
  imageText: {
    color: "white",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "1.4",
    maxWidth: "280px",
  },
  brandBadge: {
    display: "inline-block",
    padding: "6px 12px",
    background: "rgba(99, 102, 241, 0.2)",
    color: "#818cf8",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "15px",
    border: "1px solid rgba(99, 102, 241, 0.3)",
  },
  formPanel: {
    flex: 1,
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  brandTitle: {
    fontSize: "32px",
    fontWeight: "800",
    background: "linear-gradient(to right, #6366f1, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 8px 0",
  },
  brandSubtitle: {
    color: "#94a3b8",
    fontSize: "15px",
    margin: 0,
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "8px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  loginButton: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #6366f1, #4f46e5)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
  },
  footer: {
    marginTop: "30px",
  },
  securityIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "11px",
    color: "#64748b",
    lineHeight: "1.4",
  },
  shieldIcon: {
    fontSize: "16px",
  }
};