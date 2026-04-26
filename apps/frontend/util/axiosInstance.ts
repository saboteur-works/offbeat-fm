import axios from "axios";

// Relative URL — Next.js rewrites /api/v1 to backend, keeping requests same-origin across subdomains.
const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

export default axiosInstance;
