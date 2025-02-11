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
      <main className="main-content">
        {activeTab === "home" && <Home />}
        {activeTab === "funds" && (
          <FundsList funds={funds} fetchFundsByProduct={fetchFundsByProduct} error={error} loading={loading} />
        )}
        {activeTab === "comparison" && <Comparison />}
      </main>
      <Footer />
    </div>
  );
}

const Home = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
    <h1>ברוכים הבאים לפורטל קרנות ההשקעה! 🚀</h1>
    <p>כאן תוכלו לקבל את כל המידע הדרוש על מוצרים פיננסיים.</p>
  </motion.div>
);

const FundsList = ({ funds, fetchFundsByProduct, error, loading }) => (
  <div>
    <h2>📊 רשימת קרנות</h2>
    <div className="product-buttons">
      {["קרנות השתלמות", "קופות גמל", "קופות גמל להשקעה", "פוליסות חיסכון", "קרנות פנסיה"].map((product) => (
        <button key={product} onClick={() => fetchFundsByProduct(product)}>
          {product}
        </button>
      ))}
    </div>
    {loading && <p>🔄 טוען נתונים...</p>}
    {error && <p style={{ color: "red" }}>❌ שגיאה: {error}</p>}
    <table className="funds-table">
      <thead>
        <tr>
          <th>שם הקרן</th>
          <th>תשואה חודשית</th>
          <th>תשואה שנתית</th>
          <th>תשואה 3 שנים</th>
          <th>תשואה 5 שנים</th>
        </tr>
      </thead>
      <tbody>
        {funds.map((fund) => (
          <tr key={fund.id}>
            <td>{fund.name}</td>
            <td>{fund.month_performance || "N/A"}</td>
            <td>{fund.last_year || "N/A"}</td>
            <td>{fund.last_3_years || "N/A"}</td>
            <td>{fund.last_5_years || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Comparison = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
    <h2>📈 השוואת קרנות</h2>
    <p>השוו בין קרנות ובצעו החלטות פיננסיות חכמות.</p>
    <div className="comparison-placeholder">
      <p>🔍 בקרוב: טבלת השוואה אינטראקטיבית לקרנות!</p>
    </div>
  </motion.div>
);

const Footer = () => (
  <footer className="footer">
    <p>📩 צור קשר באימייל: <a href="mailto:adirgelkop@gmail.com">adirgelkop@gmail.com</a></p>
    <p>🔗 <a href="https://www.linkedin.com/in/adir-gelkop/" target="_blank" rel="noopener noreferrer">לינקדאין</a></p>
  </footer>
);

export default App;
