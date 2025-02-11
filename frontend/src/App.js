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
          <FaHome /> בית
        </button>
        <button className="nav-button" onClick={() => setActiveTab("funds")}>
          <FaCoins /> רשימת קרנות
        </button>
        <button className="nav-button" onClick={() => setActiveTab("comparison")}>
          <FaChartLine /> השוואה
        </button>
      </header>

      <motion.main className="main-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        {activeTab === "home" && <Home />}
        {activeTab === "funds" && (
          <FundsList funds={funds} fetchFundsByProduct={fetchFundsByProduct} error={error} loading={loading} />
        )}
        {activeTab === "comparison" && <Comparison />}
      </motion.main>

      <Footer />
    </div>
  );
}

const Home = () => (
  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
    <h1>🚀 ברוכים הבאים לפורטל קרנות ההשקעה!</h1>
    <p>כאן תוכלו לקבל את כל המידע הדרוש על מוצרים פיננסיים.</p>
  </motion.div>
);

const Comparison = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
    <h2>📈 השוואת קרנות</h2>
    <p>השוו בין קרנות ובצעו החלטות פיננסיות חכמות.</p>
  </motion.div>
);

const Footer = () => (
  <footer className="footer">
    <p>📩 צור קשר באימייל: <a href="mailto:adirgelkop@gmail.com">adirgelkop@gmail.com</a></p>
    <p>🔗 <a href="https://www.linkedin.com/in/adir-gelkop/" target="_blank" rel="noopener noreferrer">לינקדאין</a></p>
  </footer>
);

export default App;
