// centralizes all API calls to the backend.
// It abstracts the logic for fetching data,
// making it reusable and keeping the main React components clean.

const BASE_URL = "http://localhost:8000";

/**
 * Fetches the list of funds from the backend
 * @returns {Promise<Array>} - A promise that resolves to the list of funds
 * @throws {Error} - Throws an error if the fetch fails
 */
export const getFunds = async () => {
  // Make an HTTP GET request to the backend's /funds/ endpoint
  const response = await fetch(`${BASE_URL}/funds/`);

  // Check if the request was successful (status code 200–299)
  if (!response.ok) {
    // If not, throw an error with a descriptive message
    throw new Error("Failed to fetch funds");
  }

  // Parse the response body as JSON and return it
  return await response.json();
};
