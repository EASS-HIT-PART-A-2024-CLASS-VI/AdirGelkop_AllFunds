import React, { useState } from "react";
import { getFundsByProduct } from "./services/backend";
import "./App.css";
import FinancialProduct from "./FinancialProduct";
import { motion } from "framer-motion";
import { FaHome, FaChartLine, FaCoins } from "react-icons/fa";

const PRODUCT_INFO = {
  "קרנות השתלמות": 
    "קרנות השתלמות הן כלי חיסכון לטווח בינוני שמאפשר הפקדות קבועות ומציע הטבות מס ניכרות. הן מתאימות לאנשים המחפשים לשמור על חיסכון נזיל אך בטוח, ובמקביל ליהנות מהטבות מס משמעותיות.\n\n" +
    "בנוסף, קרנות השתלמות מהוות גיבוי כלכלי בעת מצבי חירום ומתאימות לאלו המעוניינים לשלב בין חסכון לטווח בינוני לבין יכולת גמישות כלכלית.",
    
  "קופות גמל": 
    "קופות גמל הן מוצרים לחיסכון ארוך טווח המיועדים להבטיח עתיד כלכלי יציב. הן מציעות ניהול השקעות מקצועי, תנאים מועדפים והטבות מס, מה שהופך אותן לאידיאליות למי שמתכנן את הפרישה או צריך לממן הוצאות עתידיות גדולות.\n\n" +
    "השקעה בקופות גמל מאפשרת גיוון בתיק ההשקעות ושמירה על רמת סיכון מתונה, תוך קבלת ייעוץ פיננסי מקצועי.",
    
  "קופות גמל להשקעה": 
    "קופות גמל להשקעה מציעות גמישות ניהולית גבוהה יותר, ומאפשרות למשתמש לנהל את השקעותיו באופן דינמי תוך ניצול הטבות מס והזדמנויות צמיחה שונות. המוצר מתאים למשקיעים שמבינים את תחום ההשקעות ורוצים לשלב בין נזילות לבין סיכויי רווח מוגברים.\n\n" +
    "כלי זה מעניק שליטה רבה יותר על ניהול ההון ומאפשר התאמה אישית של אסטרטגיות השקעה בהתאם לשינויים בשוק.",
    
  "פוליסות חיסכון": 
    "פוליסות חיסכון הן מוצרים להשקעה בניהול אישי, המיועדים להבטיח חיסכון לטווח ארוך עם יתרונות מס ייחודיים. הן מציעות ניהול מותאם אישית ופתרונות כוללניים המשלבים ביטחון כלכלי עם גמישות בהשקעות.\n\n" +
    "המוצר מתאים לאלו המחפשים פתרון מקיף לחיסכון, המאפשר לשלב בין ביטחון כלכלי לבין הזדמנויות לצמיחה והשקעה.",
    
  "קרנות פנסיה": 
    "קרנות פנסיה הן כלי לחיסכון לפרישה, המציעות קצבה חודשית וביטחון כלכלי לעת הפרישה. הן נועדו להבטיח עתיד כלכלי יציב באמצעות ניהול מקצועי של ההשקעות, תוך שימת דגש על יציבות וביטחון.\n\n" +
    "השקעה בקרנות פנסיה מומלצת למי שמעוניין לתכנן את העתיד הכלכלי בצורה מסודרת, עם יתרונות ביטוחיים והטבות מס משמעותיות."
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
        {/* In RTL: "בית" on the right, "רשימת קרנות" in the center, "השוואה" on the left */}
        <motion.button className="nav-button" onClick={() => setActiveTab("home")} whileHover={{ scale: 1.15 }}>
          <FaHome /> בית
        </motion.button>
        <motion.button className="nav-button" onClick={() => setActiveTab("funds")} whileHover={{ scale: 1.15 }}>
          <FaCoins /> רשימת קרנות
        </motion.button>
        <motion.button className="nav-button" onClick={() => setActiveTab("comparison")} whileHover={{ scale: 1.15 }}>
          <FaChartLine /> השוואה
        </motion.button>
      </header>
      <main className="main-content">
        {activeTab === "home" && <Home />}
        {activeTab === "funds" && (
          <>
            {/* Product type buttons */}
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
    <h1>ברוכים הבאים לפורטל קרנות ההשקעה!</h1>
    <p>
      ברוכים הבאים לאתר המוביל בתחום מוצרי הקרנות – המקום בו תמצאו את כל המידע העדכני, המעמיק והמקצועי בעולם ההשקעות. האתר שלנו נבנה כדי לספק לכם גישה לניתוחים כלכליים מפורטים, כתבות מעמיקות וכלים מתקדמים להשוואת מוצרים פיננסיים.
    </p>
    <p>
      באמצעות המאמרים והניתוחים שלנו, תוכלו להבין את היתרונות של כל מוצר השקעה – בין אם מדובר בקרנות השתלמות, קופות גמל, פוליסות חיסכון או קרנות פנסיה. אנו מתמקדים במתן מידע אמין ומקיף, שמאפשר לכם לקבל החלטות השקעה מושכלות.
    </p>
    <p>
      הצטרפו אלינו למסע כלכלי מרתק, למדו איך לנתח שווקים, והשקיעו בצורה חכמה שתקדם את העתיד הכלכלי שלכם.
    </p>
  </motion.div>
);

const FundsList = ({ funds, error, loading }) => {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>רשימת קרנות</h2>
      {loading && <p style={{ textAlign: "center" }}>טוען...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {funds && funds.length > 0 ? (
        <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>שם</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>חודש</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>שנה</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>3 שנים</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>5 שנים</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <tr key={fund.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fund.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fund.month_performance}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fund.last_year}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fund.last_3_years}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fund.last_5_years}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p style={{ textAlign: "center" }}>אין נתונים להצגה</p>
      )}
    </div>
  );
};

const Comparison = () => {
  return (
    <div>
      <h2>השוואה</h2>
      <p>תוכן השוואה יופיע כאן.</p>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <p style={{ textAlign: "center" }}>
        צור קשר:&nbsp;
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
