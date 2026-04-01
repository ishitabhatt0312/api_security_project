import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", username.trim());
  formData.append("password", password);

  try {
    const res = await API.post("/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("LOGIN SUCCESS:", res.status, res.data);

    localStorage.setItem("token", res.data.access_token);

    navigate("/dashboard");

  } catch (err) {
    console.error("REAL ERROR:", err);
    alert("Check console — this is not a credential issue");
  }
};

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: 40,
          borderRadius: 12,
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          textAlign: "center",
          width: 300,
        }}
      >
        <h2 style={{ color: "white" }}>Security Dashboard Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
        <br />
        <br />

        <button
          onClick={handleLogin}
          style={{
            padding: 10,
            width: "100%",
            cursor: "pointer",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}