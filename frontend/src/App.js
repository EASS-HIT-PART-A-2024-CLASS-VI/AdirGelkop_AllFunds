import React, { useState } from "react";
import { getFundsByProduct } from "./services/backend";
import "./App.css";
import FinancialProduct from "./FinancialProduct";
import InvestmentPrediction from "./InvestmentPrediction";
import EconomicAdvisor from "./EconomicAdvisor"; // New import for advisor microservice
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { FaHome, FaChartLine, FaCoins, FaUserTie } from "react-icons/fa";

// Fade-in up variant for smooth transitions & scroll reveal
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Original product names for buttons (unchanged)
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
        {/* New button on the far left for Economic Advisor */}
        <motion.button 
          className="nav-button" 
          onClick={() => setActiveTab("advisor")} 
          whileHover={{ scale: 1.15 }}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <FaUserTie /> יועץ קרנות AI
        </motion.button>
        <motion.button 
          className="nav-button" 
          onClick={() => setActiveTab("home")} 
          whileHover={{ scale: 1.15 }}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <FaHome /> בית
        </motion.button>
        <motion.button 
          className="nav-button" 
          onClick={() => setActiveTab("funds")} 
          whileHover={{ scale: 1.15 }}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <FaCoins /> רשימת קרנות
        </motion.button>
        <motion.button 
          className="nav-button" 
          onClick={() => setActiveTab("comparison")} 
          whileHover={{ scale: 1.15 }}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <FaChartLine /> השוואה
        </motion.button>
      </header>
      <main className="main-content">
        {activeTab === "home" && <Home />}
        {activeTab === "funds" && (
          <>
            <div className="product-buttons">
              {Object.keys(PRODUCT_INFO).map((product) => (
                <motion.button
                  key={product}
                  className="info-button"
                  onClick={() => {
                    setSelectedProduct(product);
                    fetchFundsByProduct(product);
                  }}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {product}
                </motion.button>
              ))}
            </div>
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
        {activeTab === "advisor" && <EconomicAdvisor />} {/* Render advisor tab */}
      </main>
      <Footer />
    </div>
  );
}

// Home component remains unchanged
const Home = () => {
  const { scrollY } = useViewportScroll();
  const yImage1 = useTransform(scrollY, [0, 300], [0, -50]);
  const yImage2 = useTransform(scrollY, [0, 300], [0, -30]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1 }}
      style={{ padding: "30px", lineHeight: "2", textAlign: "center" }}
    >
      <motion.h1 
        style={{ marginBottom: "20px" }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        ברוכים הבאים ל-AllFunds!
      </motion.h1>
      <motion.p 
        style={{ marginBottom: "20px", fontSize: "1.1rem" }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        AllFunds הוא הפורטל המקצועי והמוביל בתחום מוצרי הקרנות, המקום שבו תוכלו לקבל את כל המידע העדכני, המעמיק והמקצועי שיעזור לכם לקבל את החלטות ההשקעה הנכונות.
      </motion.p>
      <motion.p 
        style={{ marginBottom: "20px", fontSize: "1.1rem" }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        אנו כאן כדי להוות עבורכם את היועץ האישי והאמין – עם ניסיון של שנים בתחום, אנו מציגים ניתוחים כלכליים מעמיקים, המלצות מקצועיות, כתבות איכותיות וכלים מתקדמים להשוואת מוצרים פיננסיים.
      </motion.p>
      <motion.img
        src="https://psychology.iresearchnet.com/wp-content/uploads/2016/01/Expertise.png"
        alt="AllFunds Expertise"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          width: "80%",
          margin: "30px auto",
          display: "block",
          borderRadius: "10px",
          y: yImage1
        }}
      />
      <motion.p 
        style={{ marginBottom: "20px", fontSize: "1.1rem" }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        באתר זה תמצאו מידע מפורט על קרנות השתלמות, קופות גמל, פוליסות חיסכון וקרנות פנסיה – כל זאת כדי לאפשר לכם להבין את היתרונות של כל מוצר, להשוות בין אפשרויות ולהגיע להחלטות מושכלות.
      </motion.p>
      <motion.img
        src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3"
        alt="Invest with Confidence"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          width: "80%",
          margin: "30px auto",
          display: "block",
          borderRadius: "10px",
          y: yImage2
        }}
      />
      <motion.p 
        style={{ marginBottom: "20px", fontSize: "1.1rem" }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        כל החומרים, הנתונים והכלים שאנו מספקים נועדו לתת לכם את ההיתרון בשוק ההשקעות. אנחנו כאן כדי להיות השותף האישי שלכם להצלחה – כי כשמדובר בהשקעות, כל פרט חשוב.
      </motion.p>
    </motion.div>
  );
};

// FundsList component remains unchanged
const FundsList = ({ funds, error, loading }) => {
  if (loading) return <p style={{ textAlign: "center" }}>טוען...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!funds || (Array.isArray(funds) && funds.length === 0))
    return <p style={{ textAlign: "center" }}>אין נתונים להצגה</p>;

  if (Array.isArray(funds)) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>רשימת קרנות</h2>
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
      </motion.div>
    );
  } else if (typeof funds === "object") {
    return (
      <div>
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>רשימת קרנות</h2>
        {Object.keys(funds).map((category) => (
          <motion.div
            key={category}
            style={{ marginBottom: "40px" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>מסלול: {category}</h3>
            <p style={{ textAlign: "center", marginBottom: "15px" }}>
              במסלול זה מוצגים נתונים לפי ביצועים חודשיים, שנתיים, ל-3 שנים ול-5 שנים. אנא עיינו בנתונים בעיון.
            </p>
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
                {funds[category].map((fund) => (
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
          </motion.div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

// Comparison component remains unchanged
const Comparison = () => {
  return (
    <motion.div
      style={{ padding: "30px", lineHeight: "2", textAlign: "center" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <h2>השוואה</h2>
      <p>
        בעמוד זה תוכלו למצוא לא רק השוואה בין נתוני ביצוע של מוצרים פיננסיים שונים, אלא גם כלי חיזוי מתקדם המאפשר לכם לבדוק מה היה הערך העתידי של ההשקעה – בהתאם לפרמטרים שבחרתם, לפני תקופת זמן שבחרתם.
      </p>
      <p>
        לאחר בחירת סוג הקרן ותכנית מסוימת מתוך הרשימה, תוכלו להזין סכום השקעה ובחירת תקופה (שנה, 3 שנים או 5 שנים). המערכת מחשבת את הערך העתידי באמצעות נוסחת ריבית דריבית ומציגה זאת בצורה גרפית, עם גרף קו המדגים את צמיחת ההשקעה בכל שנה לאורך התקופה.
      </p>
      <p>
        הכל נעשה בצורה אובייקטיבית וברורה, כך שתוכלו לקבל תמונה אמינה של מגמות השוק – כי ככה זה אצל AllFunds, האמת מוצגת שחור על גבי לבן, "תפוחים לתפוחים, תפוזים לתפוזים"!
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          margin: "30px auto",
          flexWrap: "wrap"
        }}
      >
        <motion.img
          src="https://plus.unsplash.com/premium_photo-1683133438751-abb68a5c2270?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Comparison Image 1"
          style={{
            width: "45%",
            borderRadius: "10px",
            objectFit: "cover",
            objectPosition: "90%"
          }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
        <motion.img
          src="https://images.unsplash.com/photo-1464374288807-174911d4adb9?q=80&w=990&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Comparison Image 2"
          style={{ width: "45%", borderRadius: "10px" }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
      </div>
      <InvestmentPrediction />
    </motion.div>
  );
};

// Footer component remains unchanged
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
