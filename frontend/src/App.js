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
  const [selectedProduct, setSelectedProduct] = useState("");
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
        {/* In RTL, "Home" appears on the right, "Funds List" in the center, "Comparison" on the left */}
        <motion.button
          className="nav-button"
          onClick={() => setActiveTab("home")}
          whileHover={{ scale: 1.15 }}
        >
          <FaHome /> בית
        </motion.button>
        <motion.button
          className="nav-button"
          onClick={() => setActiveTab("funds")}
          whileHover={{ scale: 1.15 }}
        >
          <FaCoins /> רשימת קרנות
        </motion.button>
        <motion.button
          className="nav-button"
          onClick={() => setActiveTab("comparison")}
          whileHover={{ scale: 1.15 }}
        >
          <FaChartLine /> השוואה
        </motion.button>
      </header>
      <main className="main-content">
        {activeTab === "home" && <Home />}
        {activeTab === "funds" && (
          <>
            {/* Product category buttons */}
            <div className="product-buttons">
              {Object.keys(PRODUCT_INFO).map((product) => (
                <button
                  key={product}
                  className="info-button"
                  onClick={() => {
                    setSelectedProduct(product);
                    fetchFundsByProduct(product);
                  }}
                >
                  {product}
                </button>
              ))}
            </div>
            {/* Display selected product information */}
            {selectedProduct && (
              <FinancialProduct
                title={selectedProduct}
                content={PRODUCT_INFO[selectedProduct]}
              />
            )}
            <FundsList funds={funds} error={error} loading={loading} />
          </>
        )}
        {activeTab === "comparison" && <Comparison />}
      </main>
      <Footer />
    </div>
  );
}

const Home = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
    <h1>Welcome to the Investment Funds Portal!</h1>
    <p>
      Welcome to the leading and professional site in the field of investment funds.
      Here you will find in-depth economic analyses, detailed explanations, and advanced tools for comparing financial products such as Training Funds, Pension Funds, Savings Policies, and more.
    </p>
    <p>
      Our site is updated in real-time, providing you with all the necessary data to make smart investment decisions.
      We specialize in market analysis and present data in a visually accessible format backed by reliable insights.
    </p>
    <p>
      Learn, compare, and stay updated with the latest in the financial sector.
      We pride ourselves on offering the most advanced solutions to ensure your investments yield the best results.
    </p>
  </motion.div>
);

const FundsList = ({ funds, error, loading }) => {
  return (
    <div>
      <h2>Funds List</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {funds && funds.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Month</th>
              <th>Year</th>
              <th>3 Years</th>
              <th>5 Years</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <tr key={fund.id}>
                <td>{fund.name}</td>
                <td>{fund.month_performance}</td>
                <td>{fund.last_year}</td>
                <td>{fund.last_3_years}</td>
                <td>{fund.last_5_years}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No data available</p>
      )}
    </div>
  );
};

const Comparison = () => {
  return (
    <div>
      <h2>Comparison</h2>
      <p>Comparison content will appear here.</p>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        Contact:&nbsp;
        <a href="https://www.linkedin.com/in/adir-gelkop/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        &nbsp;|&nbsp;
        <a href="mailto:adirgelkop@gmail.com">adirgelkop@gmail.com</a>
      </p>
    </footer>
  );
};

export default App;
