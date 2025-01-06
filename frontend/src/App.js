// The main React component that renders the frontend.
// It fetches data from the backend and displays it.

// Import the CSS file
import "./App.css";

// Import React and its hooks
import React, { useEffect, useState } from "react";

// Import the getFunds function from the backend services
import { getFunds } from "./services/backend";

/**
 * The main React component that displays the list of investment funds
 */
function App() {
  // Define a state variable to store the list of funds
  const [funds, setFunds] = useState([]);

  // Define a state variable to store error messages
  const [error, setError] = useState("");

  /**
   * Fetch the funds from the backend when the component is mounted
   */
  useEffect(() => {
    // Call the getFunds function and handle the response or errors
    getFunds()
      .then(data => {
        // If successful, update the funds state with the fetched data
        setFunds(data);
      })
      .catch(err => {
        // If an error occurs, update the error state with the error message
        setError(err.message);
      });
  }, []); // The empty array means this effect runs only once, on component mount

  // Render the UI
  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      {/* Page title */}
      <h1>קרנות השתלמות</h1>

      {/* Display an error message if one exists */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Render the list of funds */}
      <ul>
        {funds.map(fund => (
          <li key={fund.id}>
            <strong>{fund.name}</strong>: {fund.month_performance}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export the component so it can be used in other files
export default App;
