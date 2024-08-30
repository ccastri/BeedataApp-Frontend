// utils/get-shopify-credentials.js
import Cookies from 'js-cookie';
import api from '../lib/axios'; // Adjust the path as needed
// const jwt = 'your-jwt-token'; // Retrieve this dynamically as needed

const jwt = Cookies.get('jwt');
export const fetchShopifyCredentialsFromBackend = async (companyId) => {
  try {
    const url = `/api/v1/connect/${companyId}`; // Ensure the URL is correct
    console.log('Fetching from URL:', url); // Verifies the URL formation

    const response = await api.get(url, {
      headers: {
        'Authorization': `Bearer ${jwt}`, // Include the token in the header
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data); // Log the response to inspect its structure

    // Ensure that the data exists and is an array
    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      const shopifyData = response.data.data[0]; // Access the first item in the data array
      console.log(shopifyData.companyId); // Adjust if `apiKey` is returned differently
      return {
        accessToken: shopifyData.pair1 || '',
        subdomain: shopifyData.subdomain || '',
        pair2: shopifyData.pair2 || '', // Assuming host is pair2, adjust if needed
        pair1: shopifyData.pair1 || '', // Adjust if `apiKey` is returned differently
        companyId: companyId
      };
    }

    // Fallback in case the data structure is different or empty
    return { accessToken: '', subdomain: '', pair2: '', pair1: '', companyId: '' };
  } catch (error) {
    console.error('Error fetching credentials:', error.response ? error.response.data : error.message);
    return { accessToken: '', subdomain: '', pair2: '', pair1: '', companyId: '' };
  }
};
