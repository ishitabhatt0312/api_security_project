import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.getAuditLogs(); // ✅ correct call
      setLogs(res); // ✅ assuming backend returns array directly
    } catch (err) {
      console.log(err);
    }
  };

  const failedCount = logs.filter(l => l.status === "FAILED").length;
  const successCount = logs.filter(l => l.status === "SUCCESS").length;

  const chartData = [
    { name: "Success", value: successCount },
    { name: "Failed", value: failedCount }
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: 220,
        background: "#111827",
        padding: 20,
        color: "white"
      }}>
        <h3>Security Panel</h3>
        <p>Dashboard</p>
        <p>Logs</p>
        <p>Alerts</p>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: 30,
        background: "#0f172a",
        color: "white"
      }}>

        <h2>API Security Dashboard</h2>

        {/* Stats */}
        <div style={{
          display: "flex",
          gap: 20,
          marginTop: 20
        }}>
          <div style={cardStyle}>
            <h3>{successCount}</h3>
            <p>Successful Logins</p>
          </div>

          <div style={cardStyle}>
            <h3>{failedCount}</h3>
            <p>Failed Logins</p>
          </div>
        </div>

        {/* Chart */}
        <div style={{
          marginTop: 40,
          height: 300,
          background: "#1e293b",
          padding: 20,
          borderRadius: 10
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: 20,
  borderRadius: 10,
  width: 200,
  color: "white"
};