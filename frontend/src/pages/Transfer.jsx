import { useState } from "react";
import api from "../services/api";

export default function Transfer() {
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMoney = async () => {
    if (!toAccount || !amount) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // ✅ FIX: Use the function name you defined in api.js
      const payload = {
        from: "ACC1001", // Or from_account, match your backend's expectation
        to: toAccount,
        amount: Number(amount)
      };

      console.log("Sending payload:", payload);
      
      const res = await api.transferMoney(payload); 
      
      alert("✅ Transfer successful!");
      // Optional: Clear fields after success
      setToAccount("");
      setAmount("");
    } catch (err) {
      console.error("Transfer Error:", err);
      alert("❌ Transfer failed. Check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "20px" }}>Transfer Money</h2>

        <div style={inputGroup}>
          <label>Recipient Account</label>
          <input
            style={inputStyle}
            placeholder="e.g. ACC2001"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
          />
        </div>

        <div style={inputGroup}>
          <label>Amount (₹)</label>
          <input
            style={inputStyle}
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button 
          onClick={sendMoney} 
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? "Processing..." : "Send Money"}
        </button>
      </div>
    </div>
  );
}

// Basic Styles for better look
const containerStyle = { display: "flex", justifyContent: "center", padding: "40px" };
const cardStyle = { background: "#1e293b", padding: "30px", borderRadius: "12px", color: "white", width: "350px" };
const inputGroup = { marginBottom: "15px", display: "flex", flexDirection: "column" };
const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #334155", marginTop: "5px", background: "#0f172a", color: "white" };
const buttonStyle = { width: "100%", padding: "12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };