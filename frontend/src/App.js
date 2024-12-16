import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [funds, setFunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/funds/")
      .then((response) => setFunds(response.data.funds))
      .catch((error) => console.error("Error:", error));
  }, []);

  const filteredFunds = funds.filter((fund) =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ textAlign: "center" }}>
      <h1>קרנות השתלמות - Study Funds</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table border="1" style={{ margin: "auto", width: "80%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Returns</th>
            <th>Management Fee</th>
          </tr>
        </thead>
        <tbody>
          {filteredFunds.map((fund, index) => (
            <tr key={index}>
              <td>{fund.name}</td>
              <td>{fund.type}</td>
              <td>{fund.returns}</td>
              <td>{fund.management_fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
