const loginAttempts = {};
const alertedIPs = {};
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// =========================
// 🗄️ DATABASE CONNECTION
// =========================
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "api_security_db",
  password: "majorproject",
  port: 5432,
});

// =========================
// 🔍 REQUEST LOGGER
// =========================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// =========================
// 🛡️ SEND LOG TO SIEM (FASTAPI)
// =========================
async function sendToSIEM(req, status, responseTime) {
  try {
    console.log("🚀 Sending to SIEM:", req.originalUrl);  // ✅ ADD THIS

    const ip = req.ip === "::1" ? "127.0.0.1" : req.ip;

    await axios.post("http://127.0.0.1:8000/security/log", {
      endpoint: req.originalUrl,
      method: req.method,
      status_code: status,
      ip_address: ip,
      response_time: responseTime,
      risk_score: req.originalUrl.includes("transfer") ? 90 : 50,
      alert_level: req.originalUrl.includes("transfer") ? "HIGH" : "MEDIUM"
    });

  } catch (err) {
    console.error("❌ SIEM logging failed", err.message);
  }
}

// =========================
// 🏦 ROOT
// =========================
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// =========================
// 🔐 LOGIN
// =========================
// =========================
// 🔐 LOGIN (FINAL CLEAN VERSION)
// =========================
app.post("/api/login", async (req, res) => {
  const start = Date.now();

  try {
    const { username, password } = req.body;

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    let status = 200;
    let attack_flag = false;
    let threat_type = "NONE";
    let risk_score = 30;
    let alert_level = "LOW";

    console.log("🔥 LOGIN HIT:", ip);

    // ❌ WRONG LOGIN
    if (!(username === "admin" && password === "1234")) {
      status = 401;

      // ✅ INIT ARRAY (FIX BUG)
      if (!loginAttempts[ip]) {
        loginAttempts[ip] = [];
      }

      const now = Date.now();

      // ✅ KEEP LAST 30 SECONDS
      loginAttempts[ip] = loginAttempts[ip].filter(
        (t) => now - t < 30000
      );

      // ✅ ADD CURRENT ATTEMPT
      loginAttempts[ip].push(now);

      console.log("Attempts:", loginAttempts[ip].length);

      // 🚨 DETECT BRUTE FORCE
      if (loginAttempts[ip].length >= 5) {

        attack_flag = true;
        threat_type = "BRUTE_FORCE";
        risk_score = 90;
        alert_level = "HIGH";

        // ✅ PREVENT SPAM
        if (!alertedIPs[ip]) {
          console.log("\n🚨 ===============================");
          console.log("🚨 ALERT: BRUTE FORCE DETECTED");
          console.log("📍 IP:", ip);
          console.log("📊 Attempts:", loginAttempts[ip].length);
          console.log("⏰ Time:", new Date().toLocaleTimeString());
          console.log("🚨 ===============================\n");

          alertedIPs[ip] = true;
        }
      }
    }

    const responseTime = Date.now() - start;

    // ✅ SEND FULL DATA TO SIEM
    await axios.post("http://127.0.0.1:8000/security/log", {
      endpoint: req.originalUrl,
      method: req.method,
      status_code: status,
      ip_address: ip,
      response_time: responseTime,
      risk_score,
      alert_level,
      attack_flag,
      threat_type
    });

    // ✅ RESET AFTER SUCCESS
    if (status === 200) {
      loginAttempts[ip] = [];
      alertedIPs[ip] = false;
      return res.json({ token: "dummy-token" });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }

  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({ error: "Server error" });
  }
});

// =========================
// 💰 TRANSFER
// =========================
app.post("/api/transfer", async (req, res) => {
  const start = Date.now();

  try {
    const { from, to, amount } = req.body;

    console.log("Transfer:", from, to, amount);

    // ✅ Deduct from sender
    await pool.query(
      "UPDATE accounts SET balance = balance - $1 WHERE account_number = $2",
      [amount, from]
    );

    // ✅ Add to receiver
    await pool.query(
      "UPDATE accounts SET balance = balance + $1 WHERE account_number = $2",
      [amount, to]
    );

    // ✅ Insert transaction
    await pool.query(
      `INSERT INTO transactions (from_account, to_account, amount, status)
       VALUES ($1, $2, $3, 'SUCCESS')`,
      [from, to, amount]
    );

    const responseTime = Date.now() - start;

    await sendToSIEM(req, 200, responseTime);

    res.json({ message: "Transfer successful" });

  } catch (err) {
    console.error("Transfer error:", err);

    const responseTime = Date.now() - start;

    await sendToSIEM(req, 500, responseTime);

    res.status(500).json({ error: "Transfer failed" });
  }
});

// =========================
// 💳 BALANCE API (MISSING BEFORE ❗)
// =========================
app.get("/api/balance/:account", async (req, res) => {
  const start = Date.now();

  try {
    const account = req.params.account;

    const result = await pool.query(
      "SELECT balance FROM accounts WHERE account_number = $1",
      [account]
    );

    if (result.rows.length === 0) {
      const responseTime = Date.now() - start;
      await sendToSIEM(req, 404, responseTime);

      return res.status(404).json({ error: "Account not found" });
    }

    const responseTime = Date.now() - start;

    await sendToSIEM(req, 200, responseTime);

    res.json({ balance: result.rows[0].balance });

  } catch (err) {
    console.error("Balance error:", err);

    const responseTime = Date.now() - start;

    await sendToSIEM(req, 500, responseTime);

    res.status(500).json({ error: "Server error" });
  }
});

// =========================
// 📜 TRANSACTIONS
// =========================
app.get("/api/transactions/:accountId", async (req, res) => {
  const start = Date.now();

  try {
    const { accountId } = req.params;

    const result = await pool.query(
      `SELECT * FROM transactions 
       WHERE from_account = $1 OR to_account = $1 
       ORDER BY timestamp DESC LIMIT 5`,
      [accountId]
    );

    const responseTime = Date.now() - start;

    await sendToSIEM(req, 200, responseTime);

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    const responseTime = Date.now() - start;

    await sendToSIEM(req, 500, responseTime);

    res.status(500).json({ error: err.message });
  }
});

// =========================
// 🚀 START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});