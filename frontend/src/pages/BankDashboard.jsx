import { useState, useEffect } from "react";
import api from "../services/api";

export default function BankDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    try {
      setLoading(true);
      const res = await api.getBalance("ACC1001");
      setBalance(res.balance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.getTransactions("ACC1001");
      setTransactions(res);
      setShowTransactions(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const transferMoney = async () => {
    if (!amount || amount <= 0) return alert("Enter amount");
    setLoading(true);
    try {
      await api.transferMoney({ from: "ACC1001", to: "ACC2001", amount: Number(amount) });
      setAmount("");
      await getBalance();
      await fetchTransactions();
    } catch (err) {
      alert("Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* SIDEBAR - Matching Login Dark Theme */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>Nexus Bank</div>
        <nav style={styles.nav}>
          <div style={styles.navItemActive}>Dashboard</div>
          <div style={styles.navItem} onClick={fetchTransactions}>Transactions</div>
          <div style={styles.navItem}>Card Center</div>
          <div style={styles.navItem}>Security</div>
          <div style={{ marginTop: "auto", ...styles.navItem }}>Settings</div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.welcomeText}>Welcome to Nexus</h1>
            <p style={styles.subText}>Secure Account Access: ACC1001</p>
          </div>
          <div style={styles.headerIcons}>
            <div style={styles.iconCircle}>🔔</div>
            <div style={styles.avatar}>👤</div>
          </div>
        </header>

        <div style={styles.dashboardGrid}>
          {/* Card Section */}
          <div style={styles.cardSection}>
            <h3 style={styles.sectionTitle}>Nexus Platinum Card</h3>
            <div style={styles.debitCard}>
              <div style={{ fontSize: "12px", opacity: 0.8, fontWeight: "600" }}>NEXUS • PREMIER DEBIT</div>
              <div style={styles.cardChip}></div>
              <div style={styles.cardNumber}>4771 6080 1080 7889</div>
              <div style={styles.cardFooter}>
                <span>VALID THRU: 08/25</span>
                <span style={{ fontWeight: "bold", fontSize: "18px" }}>VISA</span>
              </div>
            </div>
          </div>

          {/* Balance Widget - Using Login Purple */}
          <div style={styles.widget}>
            <h3 style={styles.widgetTitle}>Total Available Balance</h3>
            <h2 style={styles.balanceAmount}>
              ₹ {balance !== null ? balance.toLocaleString() : "0.00"}
            </h2>
            <div style={styles.balanceActions}>
              <button style={styles.primaryBtn} onClick={transferMoney}>Transfer</button>
              <button style={styles.secondaryBtn} onClick={getBalance}>Refresh</button>
            </div>
          </div>

          {/* Recent Activity List */}
          <div style={{ ...styles.widget, gridColumn: "span 1" }}>
            <h3 style={styles.widgetTitle}>Recent Activity</h3>
            <div style={styles.txList}>
              {showTransactions ? (
                transactions.slice(0, 4).map((tx, i) => (
                  <div key={i} style={styles.txRow}>
                    <div style={styles.txIcon}>⚡</div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.txName}>{tx.from_account === "ACC1001" ? "Money Sent" : "Deposit Received"}</div>
                      <div style={styles.txDate}>Processed via NexusAPI</div>
                    </div>
                    <div style={{ ...styles.txValue, color: tx.from_account === "ACC1001" ? "#ff4d4d" : "#10b981" }}>
                      {tx.from_account === "ACC1001" ? "-" : "+"} ₹{tx.amount}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>Click 'Transactions' to sync history.</p>
              )}
            </div>
          </div>

          {/* Quick Transfer Form */}
          <div style={styles.widget}>
            <h3 style={styles.widgetTitle}>Initiate Transfer</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={styles.label}>Recipient Account</label>
              <input style={styles.input} type="text" value="ACC2001" disabled />
            </div>
            <div>
              <label style={styles.label}>Amount to Send</label>
              <input 
                style={styles.input} 
                type="number" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button style={styles.primaryBtn} onClick={transferMoney} disabled={loading}>
              {loading ? "Processing..." : "Confirm Transfer"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Brand Styled Components (Nexus Theme) ---
const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0a0e17", // Matches Login BG
    fontFamily: "'Inter', sans-serif",
    color: "#ffffff",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#111827", // Matches Login Panel
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1f2937",
  },
  logo: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#6366f1", // Nexus Royal Purple
    marginBottom: "50px",
    paddingLeft: "15px",
    letterSpacing: "-0.5px",
  },
  nav: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
  navItem: {
    padding: "14px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: "15px",
    fontWeight: "500",
    transition: "0.3s",
  },
  navItemActive: {
    padding: "14px 18px",
    borderRadius: "12px",
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    color: "#6366f1",
    fontWeight: "700",
    borderLeft: "4px solid #6366f1",
  },
  mainContent: { flex: 1, padding: "40px", backgroundColor: "#0a0e17" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  welcomeText: { fontSize: "30px", fontWeight: "800", margin: 0, letterSpacing: "-1px" },
  subText: { color: "#64748b", marginTop: "5px", fontSize: "14px" },
  headerIcons: { display: "flex", gap: "15px", alignItems: "center" },
  iconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    backgroundColor: "#1f2937",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  avatar: { width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "#334155", display: "flex", alignItems: "center", justifyContent: "center" },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "24px",
  },
  cardSection: {
    backgroundColor: "#111827",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid #1f2937",
  },
  debitCard: {
    marginTop: "20px",
    width: "340px",
    height: "200px",
    background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)", // Nexus Purple Gradient
    borderRadius: "20px",
    padding: "24px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  cardChip: { width: "45px", height: "34px", background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", borderRadius: "6px" },
  cardNumber: { fontSize: "22px", letterSpacing: "3px", fontWeight: "600", fontFamily: "monospace" },
  cardFooter: { display: "flex", justifyContent: "space-between", fontSize: "13px", alignItems: "center" },
  widget: {
    backgroundColor: "#111827",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid #1f2937",
  },
  widgetTitle: { fontSize: "14px", color: "#64748b", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" },
  balanceAmount: { fontSize: "42px", fontWeight: "800", color: "#ffffff", marginBottom: "25px" },
  balanceActions: { display: "flex", gap: "12px" },
  primaryBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #6366f1, #4f46e5)", // Matches Login Button
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.2s",
  },
  secondaryBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "transparent",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },
  txList: { display: "flex", flexDirection: "column", gap: "12px" },
  txRow: { display: "flex", alignItems: "center", gap: "15px", padding: "12px", borderRadius: "12px", backgroundColor: "#0f172a" },
  txIcon: { width: "40px", height: "40px", borderRadius: "10px", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" },
  txName: { fontWeight: "700", fontSize: "14px", color: "#f8fafc" },
  txDate: { fontSize: "12px", color: "#64748b" },
  txValue: { fontWeight: "800", fontSize: "16px" },
  label: { display: "block", color: "#94a3b8", fontSize: "12px", marginBottom: "8px" },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0a0e17",
    color: "white",
    fontSize: "16px",
    boxSizing: "border-box",
    marginBottom: "15px"
  },
};