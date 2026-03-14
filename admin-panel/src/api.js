
import axios from 'axios';

// Automatically use the current host for API calls in production, 
// or fallback to localhost during development
const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL
});

export default api;
