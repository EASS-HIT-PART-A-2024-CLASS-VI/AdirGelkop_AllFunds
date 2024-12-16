import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [funds, setFunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/funds/")
      .then((response) => setFunds(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ textAlign: "center" }}>
      <h1>קרנות השתלמות - Study Funds</h1>
      <input
        type="text"
        placeholder="Search Funds..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px", margin: "10px" }}
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
          {filteredFunds.map(fund => (
            <tr key={fund.id}>
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
