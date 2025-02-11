// Import React and ReactDOM to render components
import React from "react";
import ReactDOM from "react-dom/client";

// Import the main App component
import App from "./App";

// Find the root element in the HTML where the React app will be rendered
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Error: No root element found in index.html");
} else {
  // Create the root for ReactDOM
  const root = ReactDOM.createRoot(rootElement);

  // Render the App component
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
