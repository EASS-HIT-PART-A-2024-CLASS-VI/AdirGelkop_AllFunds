const BASE_URL = "http://localhost:8000";

// Corrected mapping of product names to valid URLs
const PRODUCT_URLS = {
  "קרנות השתלמות": "https://www.mygemel.net/קרנות-השתלמות",
  "קופות גמל": "https://www.mygemel.net/קופות-גמל",
  "קופות גמל להשקעה": "https://www.mygemel.net/קופת-גמל-להשקעה",  // ✅ תוקן
  "פוליסות חיסכון": "https://www.mygemel.net/פוליסות-חיסכון",
  "קרנות פנסיה": "https://www.mygemel.net/פנסיה"  
};


/**
 * Fetches funds data for a specific financial product.
 * @param {string} productName - The name of the product.
 * @returns {Promise<Array>} - A promise resolving to a list of funds.
 * @throws {Error} - If the request fails.
 */
export const getFundsByProduct = async (productName) => {
  try {
    const productUrl = PRODUCT_URLS[productName];
    if (!productUrl) {
      console.error(`Invalid product name: ${productName}`);
      throw new Error("Invalid product name");
    }

    const encodedUrl = encodeURIComponent(productUrl);
    console.log(`Fetching data for: ${productName} (${productUrl})`);
    
    const response = await fetch(`${BASE_URL}/funds/product?url=${encodedUrl}`);

    if (!response.ok) {
      console.error(`Failed to fetch data: ${response.statusText}`);
      throw new Error("Failed to fetch funds for the selected product");
    }

    const data = await response.json();
    console.log("Fetched data successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching funds:", error);
    throw error;
  }
};
