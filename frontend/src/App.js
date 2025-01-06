// Import necessary modules
import "./App.css";
import React, { useEffect, useState } from "react";
import { getFundsByProduct } from "./services/backend"; // Backend function for fetching funds by product

// Main App component
function App() {
  const [activeTab, setActiveTab] = useState("overview"); // Manage active tab
  const [funds, setFunds] = useState([]);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(""); // Selected financial product
  const [companyFilter, setCompanyFilter] = useState(""); // Filter by company name
  const [productFilter, setProductFilter] = useState(""); // Filter by product type

  // Fetch funds based on selected product
  const fetchFundsByProduct = (product) => {
    setSelectedProduct(product); // Update selected product
    getFundsByProduct(product)
      .then((data) => setFunds(data))
      .catch((err) => setError(err.message));
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "funds":
        return (
          <FundsList
            funds={funds}
            error={error}
            selectedProduct={selectedProduct}
            companyFilter={companyFilter}
            productFilter={productFilter}
            setCompanyFilter={setCompanyFilter}
            setProductFilter={setProductFilter}
            fetchFundsByProduct={fetchFundsByProduct}
          />
        );
      case "comparison":
        return <Comparison />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="app-container">
      <h1>קרנות השתלמות</h1>
      <nav className="tabs">
        <button onClick={() => setActiveTab("overview")}>סקירה כללית</button>
        <button onClick={() => setActiveTab("funds")}>רשימת קרנות</button>
        <button onClick={() => setActiveTab("comparison")}>השוואה</button>
      </nav>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
}

// Overview Component
const Overview = () => (
  <div>
    <h2>מה הם המוצרים הפיננסיים?</h2>
    <p>
      קרן השתלמות היא אחד המוצרים המובילים לחיסכון לטווח בינוני-ארוך. בנוסף,
      קיימות קופות גמל להשקעה, פוליסות חיסכון ועוד מוצרים המותאמים לצרכים שונים
      של משקיעים.
    </p>
    <h3>למה זה חשוב?</h3>
    <p>
      חיסכון נכון יכול לשפר את העתיד הכלכלי שלך, עם תשואות אטרקטיביות ומסלולי
      השקעה מגוונים.
    </p>
  </div>
);

// FundsList Component
const FundsList = ({
  funds,
  error,
  selectedProduct,
  companyFilter,
  productFilter,
  setCompanyFilter,
  setProductFilter,
  fetchFundsByProduct,
}) => (
  <div>
    {/* Product Selection */}
    <h3>באיזה מוצר פיננסי אתה מעוניין?</h3>
    <div className="product-buttons">
      <button onClick={() => fetchFundsByProduct("קרנות השתלמות")}>
        קרנות השתלמות
      </button>
      <button onClick={() => fetchFundsByProduct("קופות גמל")}>קופות גמל</button>
      <button onClick={() => fetchFundsByProduct("קופות גמל להשקעה")}>
        קופות גמל להשקעה
      </button>
      <button onClick={() => fetchFundsByProduct("פוליסות חיסכון")}>
        פוליסות חיסכון
      </button>
      <button onClick={() => fetchFundsByProduct("קרנות פנסיה")}>
        קרנות פנסיה
      </button>
    </div>

    {/* Filter Inputs */}
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="חפש לפי שם חברה"
        value={companyFilter}
        onChange={(e) => setCompanyFilter(e.target.value)}
        style={{ marginRight: "10px", padding: "5px", borderRadius: "5px" }}
      />
      <input
        type="text"
        placeholder="חפש לפי סוג מוצר פיננסי"
        value={productFilter}
        onChange={(e) => setProductFilter(e.target.value)}
        style={{ marginRight: "10px", padding: "5px", borderRadius: "5px" }}
      />
      <button
        onClick={() => fetchFundsByProduct(selectedProduct)}
        style={{
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        חפש
      </button>
    </div>

    {/* Error Display */}
    {error && <p style={{ color: "red" }}>שגיאה: {error}</p>}
    {/* Funds List */}
    <ul>
      {funds.map((fund) => (
        <li key={fund.id}>
          <strong>{fund.name}</strong>: {fund.month_performance}
        </li>
      ))}
    </ul>
  </div>
);

// Comparison Component
const Comparison = () => (
  <div>
    <p>כאן תופיע השוואה בין קרנות ההשתלמות.</p>
  </div>
);

export default App;
