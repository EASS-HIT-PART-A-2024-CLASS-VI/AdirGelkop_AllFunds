import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [funds, setFunds] = useState([]); // All funds
  const [filteredFunds, setFilteredFunds] = useState([]); // Filtered funds
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [currentPlan, setCurrentPlan] = useState(""); // Active plan view

  // Fetch all funds
  useEffect(() => {
    axios
      .get("http://localhost:8000/funds/")
      .then((res) => {
        setFunds(res.data);
        setFilteredFunds(res.data); // Show all funds initially
      })
      .catch((err) => console.error("Error fetching funds:", err));
  }, []);

  // Handle search functionality
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = funds.filter((fund) =>
      fund.name.toLowerCase().includes(term)
    );
    setFilteredFunds(filtered);
    setCurrentPlan(""); // Reset plan view when searching
  };

  // Fetch funds for a specific plan
  const fetchPlanFunds = (planName) => {
    axios
      .get(`http://localhost:8000/funds/plan/${planName}`)
      .then((res) => {
        setFilteredFunds(res.data);
        setCurrentPlan(planName); // Set active plan view
      })
      .catch((err) => console.error("Error fetching plan funds:", err));
  };

  // Reset to all funds view
  const resetView = () => {
    setFilteredFunds(funds);
    setCurrentPlan("");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Study Funds</h1>

      {/* Search Input */}
      {!currentPlan && (
        <input
          type="text"
          placeholder="Search for a fund..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: "20px", padding: "10px", width: "300px" }}
        />
      )}

      {/* Reset Button */}
      {currentPlan && (
        <button onClick={resetView} style={{ marginBottom: "20px" }}>
          Back to All Funds
        </button>
      )}

      {/* Table */}
      <table border="1" style={{ margin: "auto", width: "80%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Month Performance</th>
            <th>Last Year</th>
            <th>Last 3 Years</th>
            <th>Last 5 Years</th>
            {!currentPlan && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredFunds.map((fund) => (
            <tr key={fund.id}>
              <td>{fund.id}</td>
              <td>{fund.name}</td>
              <td>{fund.month_performance}</td>
              <td>{fund.last_year}</td>
              <td>{fund.last_3_years}</td>
              <td>{fund.last_5_years}</td>
              {!currentPlan && (
                <td>
                  <button
                    onClick={() =>
                      fetchPlanFunds(fund.name.split(" ")[0])
                    } /* Pass plan name */
                  >
                    View Plan
                  </button>
                </td>
              )}
            </tr>
          ))}
          {filteredFunds.length === 0 && (
            <tr>
              <td colSpan="7">No funds match your search or selection.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
