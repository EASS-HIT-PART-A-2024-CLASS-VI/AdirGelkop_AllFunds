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

  // Fetch funds data based on the selected product
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


  const bgImage = process.env.PUBLIC_URL + "/bg_1.jpg"; // Define background image path
  return (
    <div className="app-container" style={{ 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      backgroundAttachment: "fixed"
    }}>
      <header className="navbar">
        <motion.button className="nav-button" onClick={() => setActiveTab("home")} whileHover={{ scale: 1.15 }}>
          <FaHome /> Home
        </motion.button>
        <motion.button className="nav-button" onClick={() => setActiveTab("funds")} whileHover={{ scale: 1.15 }}>
          <FaCoins /> Funds List
        </motion.button>
        <motion.button className="nav-button" onClick={() => setActiveTab("comparison")} whileHover={{ scale: 1.15 }}>
          <FaChartLine /> Comparison
        </motion.button>
      </header>

      <motion.main className="main-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        {activeTab === "home" && <Home />}
        {activeTab === "funds" && <FundsList funds={funds} fetchFundsByProduct={fetchFundsByProduct} error={error} loading={loading} />}
        {activeTab === "comparison" && <Comparison />}
      </motion.main>

      <Footer />
    </div>
  );

}

// Home Component
const Home = () => (
  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
    <h1>🚀 Welcome to the Investment Funds Portal!</h1>
    <p>Here you can get all the necessary financial product information.</p>
  </motion.div>
);

// FundsList Component with 1y, 3y, 5y Returns
const FundsList = ({ funds, fetchFundsByProduct, error, loading }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
    <h2>📜 Funds List</h2>
    <div className="product-buttons">
      {["קרנות השתלמות", "קופות גמל", "קופות גמל להשקעה"].map((product) => (
        <button key={product} onClick={() => fetchFundsByProduct(product)}>{product}</button>
      ))}
    </div>
    {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
      <table className="funds-table">
        <thead>
          <tr><th>Name</th><th>Return (1Y)</th><th>Return (3Y)</th><th>Return (5Y)</th><th>Management Fees</th></tr>
        </thead>
        <tbody>
          {funds.map((fund, index) => (
            <tr key={index}><td>{fund.name}</td><td>{fund.returns_1y}</td><td>{fund.returns_3y}</td><td>{fund.returns_5y}</td><td>{fund.fees}</td></tr>
          ))}
        </tbody>
      </table>
    )}
  </motion.div>
);

export default App;
