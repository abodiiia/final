
// Retrieve Google Maps API key from environment variables
function getGoogleMapsApiKey() {
  // Try to get from environment variables
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyDPNvJy8vKpj1wZdbl-EU_yTU56xNwyPac';
  return apiKey;
}

// Export the function
module.exports = { getGoogleMapsApiKey };
