
import axios from 'axios';

// Replace with your production Vercel URL or local IP for testing
const BASE_URL = 'https://neurogenius.vercel.app'; // Correct production Vercel URL

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
export { BASE_URL };
