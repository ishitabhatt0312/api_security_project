import { BrowserRouter, Routes, Route } from "react-router-dom";

import BankLogin from "./pages/BankLogin";
import BankDashboard from "./pages/BankDashboard";
import Transfer from "./pages/Transfer";
import SIEMDashboard from "./pages/SIEMDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Fintech Login */}
        <Route path="/" element={<BankLogin />} />

        {/* ✅ Bank Dashboard */}
        <Route path="/bank/dashboard" element={<BankDashboard />} />

        {/* ✅ Transfer Page */}
        <Route path="/bank/transfer" element={<Transfer />} />

        {/* ✅ SIEM Dashboard */}
        <Route path="/siem" element={<SIEMDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;