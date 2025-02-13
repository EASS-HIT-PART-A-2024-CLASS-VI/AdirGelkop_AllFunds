import React from "react";
import "./App.css";

/**
 * Component for displaying information about a financial product.
 */
const FinancialProduct = ({ title, content }) => {
  return (
    <div className="financial-product">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export default FinancialProduct;
