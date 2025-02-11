const BASE_URL = "http://localhost:8000";

// Mapping of product names to URLs
const PRODUCT_URLS = {
  "קרנות השתלמות": "https://www.mygemel.net/%D7%A7%D7%A8%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA",
  "קופות גמל": "https://www.mygemel.net/%D7%A7%D7%95%D7%A4%D7%95%D7%AA-%D7%92%D7%9E%D7%9C",
  "קופות גמל להשקעה": "https://www.mygemel.net/%D7%A7%D7%95%D7%A4%D7%95%D7%AA-%D7%92%D7%9E%D7%9C",
  "פוליסות חיסכון": "https://www.mygemel.net/%D7%A4%D7%95%D7%9C%D7%99%D7%A1%D7%95%D7%AA-%D7%97%D7%99%D7%A1%D7%9B%D7%95%D7%9F",
  "קרנות פנסיה": "https://www.mygemel.net/%D7%A4%D7%A0%D7%A1%D7%99%D7%94"
};

/**
 * Fetches funds data for a specific financial product.
 * @param {string} productName - The name of the product.
 * @returns {Promise<Array>} - A promise resolving to a list of funds.
 * @throws {Error} - If the request fails.
 */
export const getFundsByProduct = async (productName) => {
  const productUrl = PRODUCT_URLS[productName];
  if (!productUrl) throw new Error("Invalid product name");

  const encodedUrl = encodeURIComponent(productUrl);
  const response = await fetch(`${BASE_URL}/funds/product?url=${encodedUrl}`);

  if (!response.ok) throw new Error("Failed to fetch funds for the selected product");

  return await response.json();
};
