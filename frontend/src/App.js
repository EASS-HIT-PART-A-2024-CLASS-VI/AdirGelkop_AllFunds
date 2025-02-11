import React, { useState } from "react";
import { getFundsByProduct } from "./services/backend";
import "./App.css";
import FinancialProduct from "./FinancialProduct";
import { motion } from "framer-motion";
import { FaHome, FaChartLine, FaCoins } from "react-icons/fa";

const PRODUCT_INFO = {
  "קרנות השתלמות": "קרן השתלמות היא חיסכון לטווח בינוני שנועד להעניק הטבות מס וחיסכון נזיל לאחר שש שנים.",
  "קופות גמל": "קופת גמל היא מוצר חיסכון ארוך טווח עם תנאים מועדפים להפקדות ושימוש לפנסיה או מטרה אחרת.",
  "קופות גמל להשקעה": "קופת גמל להשקעה היא מוצר חיסכון גמיש שמאפשר הפקדות והטבות מס בדומה לקופת גמל רגילה.",
  "פוליסות חיסכון": "פוליסות חיסכון הן מוצרי השקעה בניהול אישי המאפשרים חיסכון לטווח ארוך עם יתרונות מס.",
  "קרנות פנסיה": "קרן פנסיה היא תוכנית חיסכון לפנסיה שמבטיחה קצבה חודשית עם מרכיב ביטוחי לפרישה.",
};

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
      <main className="main-content">
        {activeTab === "home" && <Home setActiveTab={setActiveTab} />}
        {activeTab === "funds" && (
          <FundsList funds={funds} fetchFundsByProduct={fetchFundsByProduct} error={error} loading={loading} />
        )}
        {activeTab === "comparison" && <Comparison />}
        {PRODUCT_INFO[activeTab] && <FinancialProduct title={activeTab} content={PRODUCT_INFO[activeTab]} />}
      </main>
      <Footer />
    </div>
  );

}

const Home = ({ setActiveTab }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
    <h1>ברוכים הבאים לפורטל קרנות ההשקעה! 🚀</h1>
    <p>כאן תוכלו ללמוד על מוצרים פיננסיים שונים ולהבין כיצד לבחור את הקרן המתאימה לכם.</p>

    <div className="home-buttons">
      {Object.keys(PRODUCT_INFO).map((product) => (
        <button key={product} className="info-button" onClick={() => setActiveTab(product)}>
          {product}
        </button>
      ))}
    </div>
  </motion.div>
);

export default App;
