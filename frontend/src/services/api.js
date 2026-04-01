import axios from "axios";

// 🔹 Bank Backend (Node.js → 5000)
const BANK_API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 SIEM Backend (FastAPI → 8000)
const SIEM_API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

const api = {

  // =========================
  // 🏦 BANK FUNCTIONS (Node)
  // =========================

  // ✅ LOGIN
  login: async (username, password) => {
    try {
      const res = await BANK_API.post("/login", {
        username,
        password,
      });
      return res.data;
    } catch (err) {
      console.error("Login API Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // ✅ BALANCE
  getBalance: async (accountId) => {
    try {
      const res = await BANK_API.get(`/balance/${accountId}`);
      return res.data;
    } catch (err) {
      console.error("Balance API Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // ✅ TRANSACTIONS (🔥 FIXED)
  getTransactions: async (accountId) => {
    try {
      const res = await BANK_API.get(`/transactions/${accountId}`);
      return res.data;
    } catch (err) {
      console.error("Transactions API Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // ✅ TRANSFER
  transferMoney: async (payload) => {
    try {
      const res = await BANK_API.post("/transfer", payload);
      return res.data;
    } catch (err) {
      console.error("Transfer API Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // =========================
  // 🛡️ SIEM FUNCTIONS (FastAPI)
  // =========================

  getSecurityAlerts: async () => {
    try {
      const res = await SIEM_API.get("/security/alerts");
      return res.data;
    } catch (err) {
      console.error("Alerts API Error:", err.response?.data || err.message);
      throw err;
    }
  },

  getSecurityStats: async () => {
    try {
      const res = await SIEM_API.get("/security/stats");
      return res.data;
    } catch (err) {
      console.error("Stats API Error:", err.response?.data || err.message);
      throw err;
    }
  },

};

export default api;