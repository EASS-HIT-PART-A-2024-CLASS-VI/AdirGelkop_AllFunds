import React, { useState } from "react";
import { motion } from "framer-motion";

// Dummy data structure for Investment Prediction
// Order: Fund Type -> Plan -> Company
const dummyData = {
  "קרנות השתלמות": {
    plans: {
      "תכנית 1": {
        companies: ["חברה A", "חברה B"],
        rates: { "שנה": 5, "3 שנים": 15, "5 שנים": 25 }
      },
      "תכנית 2": {
        companies: ["חברה C"],
        rates: { "שנה": 4, "3 שנים": 12, "5 שנים": 20 }
      }
    }
  },
  "קופות גמל": {
    plans: {
      "תכנית 3": {
        companies: ["חברה D", "חברה E"],
        rates: { "שנה": 6, "3 שנים": 18, "5 שנים": 30 }
      },
      "תכנית 4": {
        companies: ["חברה F"],
        rates: { "שנה": 7, "3 שנים": 21, "5 שנים": 35 }
      }
    }
  }
  // ניתן להוסיף עוד סוגי קרנות במידת הצורך
};

const InvestmentPrediction = () => {
  const [selectedFundType, setSelectedFundType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!selectedFundType || !selectedPlan || !selectedCompany || !amount || !selectedPeriod) {
      alert("אנא מלאו את כל השדות");
      return;
    }
    const rate = dummyData[selectedFundType].plans[selectedPlan].rates[selectedPeriod];
    const n = selectedPeriod === "שנה" ? 1 : selectedPeriod === "3 שנים" ? 3 : 5;
    // Compound interest formula: future value = amount * (1 + rate/100)^n
    const predicted = parseFloat(amount) * Math.pow(1 + rate / 100, n);
    setResult(predicted.toFixed(2));
  };

  // Get plans and companies based on selection
  const plans = selectedFundType ? Object.keys(dummyData[selectedFundType].plans) : [];
  const companies = selectedPlan ? dummyData[selectedFundType].plans[selectedPlan].companies : [];

  return (
    <motion.div
      style={{
        padding: "30px",
        lineHeight: "1.8",
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: "10px",
        margin: "20px auto",
        width: "80%"
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
      viewport={{ once: true }}
    >
      <h2>חיזוי השקעות</h2>
      <div style={{ marginBottom: "15px" }}>
        <label>בחרו סוג קרן: </label>
        <select
          value={selectedFundType}
          onChange={(e) => {
            setSelectedFundType(e.target.value);
            setSelectedPlan("");
            setSelectedCompany("");
          }}
        >
          <option value="">-- בחרו סוג קרן --</option>
          {Object.keys(dummyData).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {selectedFundType && (
        <div style={{ marginBottom: "15px" }}>
          <label>בחרו תכנית: </label>
          <select
            value={selectedPlan}
            onChange={(e) => {
              setSelectedPlan(e.target.value);
              setSelectedCompany("");
            }}
          >
            <option value="">-- בחרו תכנית --</option>
            {plans.map((plan) => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
        </div>
      )}
      {selectedPlan && (
        <div style={{ marginBottom: "15px" }}>
          <label>בחרו חברה: </label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">-- בחרו חברה --</option>
            {companies.map((comp) => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
      )}
      <div style={{ marginBottom: "15px" }}>
        <label>הזינו סכום (בש"ח): </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>בחרו תקופה: </label>
        <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
          <option value="">-- בחרו תקופה --</option>
          <option value="שנה">שנה</option>
          <option value="3 שנים">3 שנים</option>
          <option value="5 שנים">5 שנים</option>
        </select>
      </div>
      <button
        style={{
          background: "linear-gradient(135deg, #28a745, #218838)",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem"
        }}
        onClick={handleCalculate}
      >
        חשב חיזוי
      </button>
      {result && (
        <div style={{ marginTop: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>
          הערך הצפוי: {result} ש"ח
        </div>
      )}
    </motion.div>
  );
};

export default InvestmentPrediction;
