import React, { useState } from "react";
import { getFundsByProduct } from "./services/backend";
import "./App.css";
import { motion } from "framer-motion";
import { FaHome, FaChartLine, FaCoins } from "react-icons/fa";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [funds, setFunds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFundsByProduct = async (productName) => {
    setLoading(true);
    setError("");

    try {
      const data = await getFundsByProduct(productName);
      setFunds(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <button className="nav-button" onClick={() => setActiveTab("home")}>
          <FaHome /> Home
        </button>
        <button className="nav-button" onClick={() => setActiveTab("funds")}>
          <FaCoins /> Funds List
        </button>
        <button className="nav-button" onClick={() => setActiveTab("comparison")}>
          <FaChartLine /> Comparison
        </button>
      </header>

      <main className="main-content">
        {activeTab === "home" && <Home />}
        {activeTab === "funds" && (
          <FundsList funds={funds} fetchFundsByProduct={fetchFundsByProduct} error={error} loading={loading} />
        )}
        {activeTab === "comparison" && <Comparison />}
      </main>
    </div>
  );
}

const Home = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
    <h1>Welcome to the Investment Funds Portal!</h1>
    <p>Here, you can get all the information you need about financial products.</p>
  </motion.div>
);

const FundsList = ({ funds, fetchFundsByProduct, error, loading }) => (
  <div>
    <h2>Funds List</h2>
    <div className="product-buttons">
      {["קרנות השתלמות", "קופות גמל", "קופות גמל להשקעה", "פוליסות חיסכון", "קרנות פנסיה"].map((product) => (
        <button key={product} onClick={() => fetchFundsByProduct(product)}>
          {product}
        </button>
      ))}
    </div>

    {loading && <p>Loading data...</p>}
    {error && <p style={{ color: "red" }}>Error: {error}</p>}

    <ul>
      {funds.map((fund) => (
        <li key={fund.id}>
          <strong>{fund.name}</strong>: {fund.month_performance}
        </li>
      ))}
    </ul>
  </div>
);

const Comparison = () => (
  <div>
    <h2>Comparison</h2>
    <p>Compare investment funds and make informed decisions.</p>
  </div>
);

export default App;
