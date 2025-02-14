import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Fade-in variant for animations
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// This function returns a substring to filter the scraped funds based on fund type
const getFilterSubstring = (fundType) => {
  switch (fundType) {
    case "קרנות השתלמות":
      return "השתלמות";
    case "קופות גמל":
      return "גמל";
    case "קופות גמל להשקעה":
      return "להשקעה";
    case "פוליסות חיסכון":
      return "חיסכון";
    case "קרנות פנסיה":
      return "פנסיה";
    default:
      return "";
  }
};

const InvestmentPrediction = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User selections
  const [selectedFundType, setSelectedFundType] = useState("");
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [amount, setAmount] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Fetch funds data from backend when selectedFundType changes
  useEffect(() => {
    if (selectedFundType) {
      const fetchFunds = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            "http://localhost:8000/funds/?product_type=" + encodeURIComponent(selectedFundType)
          );
          const data = await response.json();
          setFunds(data);
        } catch (err) {
          setError("שגיאה בטעינת הנתונים");
        } finally {
          setLoading(false);
        }
      };
      fetchFunds();
    } else {
      setFunds([]);
    }
  }, [selectedFundType]);

  // Update filtered funds based on fetched data and ensure all rate fields are non-empty.
  // For "פוליסות חיסכון", do not filter by substring.
  useEffect(() => {
    if (selectedFundType) {
      let filtered;
      if (selectedFundType === "פוליסות חיסכון") {
        filtered = funds.filter((f) =>
          f.last_year.trim() !== "" &&
          f.last_3_years.trim() !== "" &&
          f.last_5_years.trim() !== ""
        );
      } else {
        const filterStr = getFilterSubstring(selectedFundType);
        filtered = funds.filter((f) =>
          f.name.includes(filterStr) &&
          f.last_year.trim() !== "" &&
          f.last_3_years.trim() !== "" &&
          f.last_5_years.trim() !== ""
        );
      }
      setFilteredFunds(filtered);
    } else {
      setFilteredFunds([]);
    }
    setSelectedFund(null);
  }, [selectedFundType, funds]);

  const handleCalculate = () => {
    if (!selectedFund || !amount || !selectedPeriod) {
      alert("אנא מלאו את כל השדות");
      return;
    }
    let rateStr = "";
    if (selectedPeriod === "שנה") {
      rateStr = selectedFund.last_year;
    } else if (selectedPeriod === "3 שנים") {
      rateStr = selectedFund.last_3_years;
    } else if (selectedPeriod === "5 שנים") {
      rateStr = selectedFund.last_5_years;
    }
    const rate = parseFloat(rateStr.replace("%", ""));
    const n = selectedPeriod === "שנה" ? 1 : selectedPeriod === "3 שנים" ? 3 : 5;
    // Compound interest formula: future value = amount * (1 + rate/100)^n
    const predicted = parseFloat(amount) * Math.pow(1 + rate / 100, n);
    setResult(predicted.toFixed(2));

    // Prepare chart data for each year
    let data = [];
    for (let i = 0; i <= n; i++) {
      const value = parseFloat(amount) * Math.pow(1 + rate / 100, i);
      data.push({ שנה: i, "ערך (בשקלים חדשים)": parseFloat(value.toFixed(2)) });
    }
    setChartData(data);
  };

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
      variants={fadeInUp}
    >
      <h2>חיזוי השקעות</h2>
      {loading && <p>טוען...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "15px" }}>
        <label>בחרו סוג קרן: </label>
        <select
          value={selectedFundType}
          onChange={(e) => setSelectedFundType(e.target.value)}
          style={{ width: "300px" }}
        >
          <option value="">-- בחרו סוג קרן --</option>
          {[
            "קרנות השתלמות",
            "קופות גמל",
            "קופות גמל להשקעה",
            "פוליסות חיסכון",
            "קרנות פנסיה"
          ].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {selectedFundType && (
        <div style={{ marginBottom: "15px" }}>
          <label>בחרו תכנית (קרן): </label>
          <select
            value={selectedFund ? selectedFund.id : ""}
            onChange={(e) => {
              const fundId = e.target.value;
              const fund = filteredFunds.find((f) => f.id.toString() === fundId);
              setSelectedFund(fund);
            }}
            style={{ width: "300px" }}
          >
            <option value="">-- בחרו תכנית --</option>
            {filteredFunds.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      )}
      <div style={{ marginBottom: "15px" }}>
        <label>הזינו סכום (בשקלים חדשים): </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>בחרו תקופה: </label>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          style={{ width: "300px" }}
        >
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
          הערך הצפוי: {result} בשקלים חדשים
        </div>
      )}
      {chartData.length > 0 && (
        <div style={{ marginTop: "30px", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="שנה" 
                tick={{ fill: "#fff" }} 
                label={{ value: "שנים", position: "insideBottom", offset: -5, fill: "#fff" }} 
              />
              <YAxis 
                tick={{ fill: "#fff" }} 
                label={{ value: "ערך (בשקלים חדשים)", angle: -90, position: "insideLeft", fill: "#fff" }} 
              />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "none", color: "#fff" }} />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Line type="monotone" dataKey="ערך (בשקלים חדשים)" stroke="#ff7300" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default InvestmentPrediction;
