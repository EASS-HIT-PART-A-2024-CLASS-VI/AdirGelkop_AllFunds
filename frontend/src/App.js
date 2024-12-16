import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [funds, setFunds] = useState([]); // All funds
  const [filteredFunds, setFilteredFunds] = useState([]); // Filtered funds to display
  const [searchTerm, setSearchTerm] = useState(""); // Search input state

  // Fetch all funds when the page loads
  useEffect(() => {
    axios
      .get("http://localhost:8000/funds/")
      .then((res) => {
        setFunds(res.data);
        setFilteredFunds(res.data); // Initially, display all funds
      })
      .catch((err) => console.error("Error fetching funds:", err));
  }, []);

  // Handle the search functionality
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase(); // Convert input to lowercase
    setSearchTerm(term);

    const filtered = funds.filter((fund) =>
      fund.name.toLowerCase().includes(term)
    );
    setFilteredFunds(filtered); // Update filtered funds
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Study Funds</h1>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search for a fund..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "20px", padding: "10px", width: "300px" }}
      />

      {/* Table to Display Funds */}
      <table border="1" style={{ margin: "auto", width: "80%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Month Performance</th>
            <th>Last Year</th>
            <th>Last 3 Years</th>
            <th>Last 5 Years</th>
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
            </tr>
          ))}
          {filteredFunds.length === 0 && (
            <tr>
              <td colSpan="6">No funds match your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
