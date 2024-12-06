import axios from 'axios';

// Setup base configuration for Axios
const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1', // Your API base URL
  withCredentials: true, // This allows cookies (tokens) to be sent with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
