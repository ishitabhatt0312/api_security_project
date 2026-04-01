import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { FaChartLine, FaServer, FaShieldAlt, FaLock, FaSearch } from "react-icons/fa";

const COLORS = ["#d8b4fe", "#818cf8", "#2DD4BF", "#fb7185", "#38BDF8"];

export default function LavenderCyberDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [throughput, setThroughput] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, statsRes] = await Promise.all([
          api.getSecurityAlerts(),
          api.getSecurityStats()
        ]);
        setAlerts(alertsRes || []);
        
        const sorted = (statsRes.throughput || [])
          .sort((a, b) => new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`))
          .slice(-15); 
        setThroughput(sorted);
      } catch (err) { console.error("Fetch Error:", err); }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const cityData = [
    { name: "Mumbai", value: 40 },
    { name: "Delhi", value: 30 },
    { name: "Bangalore", value: 20 },
    { name: "Other", value: 10 }
  ];

  return (
    <div style={styles.appWrapper}>
      {/* NAVBAR */}
      <nav style={styles.navBar}>
        <div style={{ display: 'flex', gap: '25px', height: '100%' }}>
          <Tab label="API Ops" active icon={<FaChartLine />} />
          <Tab label="User Intel" icon={<FaServer />} />
          <Tab label="Threat Map" icon={<FaShieldAlt />} />
          <Tab label="Security" icon={<FaLock />} />
        </div>
        <div style={styles.searchContainer}>
          <FaSearch style={{ color: '#a78bfa', fontSize: '12px' }} />
          <input type="text" placeholder="Search Encrypted Stream..." style={styles.searchInput} />
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={styles.mainGrid}>
        
        {/* ROW 1: Distribution Metrics */}
        <div style={styles.row}>
          <Card title="Request Distribution"><DonutData data={[{name: 'GET', value: 40}, {name: 'POST', value: 60}]} /></Card>
          <Card title="API Endpoint Load"><DonutData data={[{name: '/login', value: 70}, {name: '/api', value: 30}]} /></Card>
          <Card title="Node Performance"><DonutData data={[{name: 'Node A', value: 50}, {name: 'Node B', value: 50}]} /></Card>
          <Card title="City Distribution"><DonutData data={cityData} /></Card>
        </div>

        {/* ROW 2: Velocity & Environment */}
        <div style={{ ...styles.row, flex: 1.3 }}> 
          <div style={{ flex: 2.5, minWidth: 0 }}>
            <Card title="Live Throughput Velocity">
              <div style={{ height: '100%', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={throughput} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="velocityGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1b4b" />
                    <XAxis dataKey="time" fontSize={8} tickLine={false} axisLine={false} stroke="#6b7280" />
                    <YAxis fontSize={8} tickLine={false} axisLine={false} stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#0c0c14', border: '1px solid #4c1d95', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="count" stroke="#d8b4fe" fill="url(#velocityGlow)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Card title="Traffic Environment"><DonutData data={[{name: 'Cloud', value: 80}, {name: 'On-Prem', value: 20}]} /></Card>
          </div>
        </div>

        {/* ROW 3: Scrollable Event Stream with Risk Logic */}
        <div style={styles.row}>
          <div style={{ flex: 2, minWidth: 0 }}>
            <Card title="Real-time Event Stream (Scroll for History)">
              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead style={styles.stickyHeader}>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Endpoint</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>IP</th>
                      <th style={styles.th}>Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.slice(0, 50).map((a, i) => {
                      // LOGIC: Status 401 forces Risk 90
                      const finalRisk = a.status_code === 401 ? 90 : (a.risk_score || 10);
                      const isAlert = a.status_code === 401 || finalRisk >= 80;

                      return (
                        <tr key={i} style={{
                          ...styles.tableRow,
                          backgroundColor: a.status_code === 401 ? 'rgba(251, 113, 131, 0.05)' : 'transparent'
                        }}>
                          <td style={{color: '#d8b4fe', padding: '8px'}}>{a.endpoint}</td>
                          <td style={{
                            color: a.status_code === 401 ? '#fb7185' : a.status_code >= 400 ? '#facc15' : '#2DD4BF', 
                            fontWeight: 'bold', padding: '8px'
                          }}>{a.status_code}</td>
                          <td style={{padding: '8px', color: '#94a3b8'}}>{a.ip_address}</td>
                          <td style={{
                            color: isAlert ? '#fb7185' : '#2DD4BF', 
                            fontWeight: isAlert ? 'bold' : 'normal', padding: '8px'
                          }}>{finalRisk}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <Card title="System Health">
              <div style={styles.healthGrid}>
                <MetricBox label="LATENCY" value="12ms" color="#38BDF8" />
                <MetricBox label="SUCCESS" value="99.9%" color="#2DD4BF" />
                <MetricBox label="LOAD" value="Low" color="#a78bfa" />
                <MetricBox label="THREATS" value="Active" color="#fb7185" />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// STYLES
const styles = {
  appWrapper: { height: '100vh', width: '100vw', backgroundColor: '#050509', color: '#e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Inter, sans-serif' },
  navBar: { height: '50px', backgroundColor: '#0c0c14', borderBottom: '1px solid #2e1065', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 },
  searchContainer: { display: 'flex', alignItems: 'center', backgroundColor: '#161625', padding: '5px 10px', borderRadius: '4px', border: '1px solid #7c3aed' },
  searchInput: { background: 'transparent', border: 'none', outline: 'none', color: '#ddd', fontSize: '11px', width: '180px', marginLeft: '8px' },
  mainGrid: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px', boxSizing: 'border-box', overflow: 'hidden' },
  row: { flex: 1, display: 'flex', gap: '10px', minHeight: 0 },
  
  tableScroll: { overflowY: 'auto', flex: 1, fontSize: '10px', scrollbarWidth: 'thin', scrollbarColor: '#4c1d95 #0c0c14' },
  table: { width: '100%', borderCollapse: 'collapse' },
  stickyHeader: { position: 'sticky', top: 0, backgroundColor: '#0c0c14', zIndex: 10 },
  th: { padding: '8px', textAlign: 'left', borderBottom: '1px solid #2e1065', color: '#6b7280', fontSize: '9px' },
  tableRow: { borderBottom: '1px solid #1a1a2e' },
  
  healthGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', height: '100%' }
};

// COMPONENTS
const Card = ({ title, children }) => (
  <div style={{ backgroundColor: '#0c0c14', border: '1px solid #4c1d95', padding: '10px', display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minWidth: 0 }}>
    <h3 style={{ fontSize: '10px', marginBottom: '8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
  </div>
);

const DonutData = ({ data }) => (
  <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
    <div style={{ width: '50%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius="60%" outerRadius="85%" dataKey="value" stroke="none" paddingAngle={5}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div style={{ width: '50%', paddingLeft: '10px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }} />
          <span style={{ fontSize: '8px', color: '#9ca3af' }}>{d.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const MetricBox = ({ label, value, color }) => (
  <div style={{ backgroundColor: '#050509', padding: '5px', borderRadius: '4px', border: '1px solid #2e1065', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <span style={{ fontSize: '7px', color: '#6b7280' }}>{label}</span>
    <span style={{ fontSize: '11px', color: color, fontWeight: 'bold' }}>{value}</span>
  </div>
);

const Tab = ({ label, active, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '100%', borderBottom: active ? '2px solid #a78bfa' : '2px solid transparent', color: active ? '#fff' : '#6b7280', cursor: 'pointer', fontSize: '11px' }}>
    {icon} {label}
  </div>
);