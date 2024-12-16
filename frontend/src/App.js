import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/funds/")  // <-- Use "backend" here
      .then((res) => setFunds(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Study Funds</h1>
      <table border="1" style={{ width: "80%", margin: "auto" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Returns</th>
            <th>Management Fee</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((fund) => (
            <tr key={fund.id}>
              <td>{fund.id}</td>
              <td>{fund.name}</td>
              <td>{fund.type}</td>
              <td>{fund.returns}%</td>
              <td>{fund.management_fee}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
