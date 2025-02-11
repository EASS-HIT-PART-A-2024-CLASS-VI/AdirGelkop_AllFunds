import React, { useState } from "react";
import "./App.css";
import { getFundsByProduct } from "./services/backend";

function App() {
  // טאב דיפולט: "home"
  const [activeTab, setActiveTab] = useState("home");
  const [funds, setFunds] = useState([]);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");

  // שליפת נתונים מה-Backend
  const fetchFundsByProduct = (product) => {
    setSelectedProduct(product);
    getFundsByProduct(product)
      .then((data) => setFunds(data))
      .catch((err) => setError(err.message));
  };

  // בחירת התוכן שיוצג לפי הטאב
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
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
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      {/* סרגל עליון (NavBar) */}
      <header className="navbar">
        <div className="navbar-left">
          <button
            className={`nav-button ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            🏠 בית
          </button>
          <button
            className={`nav-button ${activeTab === "funds" ? "active" : ""}`}
            onClick={() => setActiveTab("funds")}
          >
            💰 רשימת קרנות
          </button>
          <button
            className={`nav-button ${
              activeTab === "comparison" ? "active" : ""
            }`}
            onClick={() => setActiveTab("comparison")}
          >
            📊 השוואה
          </button>
        </div>
        <div className="navbar-right">
          <h1 className="app-title animate-pop">ניהול קרנות השתלמות</h1>
        </div>
      </header>

      {/* תוכן הדף */}
      <main className="main-content fade-in">{renderContent()}</main>

      {/* פוטר אופציונלי */}
      <footer className="app-footer">
        <p>© 2025 MyFunds Inc. | בנוי עם ❤️ ב-FastAPI & React</p>
      </footer>
    </div>
  );
}

// עמוד הבית
const Home = () => {
  return (
    <section className="home-section">
      <h2 className="section-title">ברוכים הבאים לאתר קרנות ההשתלמות!</h2>
      <p className="home-text">
        כאן תוכלו למצוא מידע מקיף על מגוון מוצרים פיננסיים:
        <br />
        <strong>קרנות השתלמות, קופות גמל, פוליסות חיסכון, ועוד.</strong>
      </p>
      <p className="home-text highlight">
        אנו שואפים לאפשר לכם לקבל את כל המידע החיוני בצורה נוחה, נעימה, ומתקדמת.
      </p>
    </section>
  );
};

// רשימת קרנות
const FundsList = ({
  funds,
  error,
  selectedProduct,
  companyFilter,
  productFilter,
  setCompanyFilter,
  setProductFilter,
  fetchFundsByProduct,
}) => {
  return (
    <section>
      <h2 className="section-title">רשימת קרנות</h2>
      <p>בחרו מוצר פיננסי או חפשו לפי שם חברה/סוג מוצר:</p>

      {/* בחירת מוצר פיננסי */}
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

      {/* סינון */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="חפש לפי שם חברה"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="חפש לפי סוג מוצר פיננסי"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        />
        <button onClick={() => fetchFundsByProduct(selectedProduct)}>חפש</button>
      </div>

      {/* הודעת שגיאה */}
      {error && <p style={{ color: "red" }}>שגיאה: {error}</p>}

      {/* רשימת הקרנות */}
      <ul className="fund-list">
        {funds.map((fund) => (
          <li key={fund.id} className="fund-item pop-on-hover">
            <strong>{fund.name}</strong>: {fund.month_performance}
          </li>
        ))}
      </ul>
    </section>
  );
};

// עמוד השוואה
const Comparison = () => {
  return (
    <section>
      <h2 className="section-title">השוואה בין קרנות</h2>
      <p>
        כאן תוכלו להשוות ביצועים של קרנות השתלמות שונות, לצפות בנתוני תשואה לאורך
        זמן, ולעשות בחירות מושכלות יותר לעתיד הפיננסי שלכם.
      </p>
      <div className="comparison-placeholder">
        <span className="emoji-compare">🤔</span>
        <span>בקרוב: גרפים וטבלאות השוואה מדהימות!</span>
      </div>
    </section>
  );
};

export default App;
