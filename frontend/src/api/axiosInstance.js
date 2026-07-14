import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const UPLOADS_BASE_URL =
  import.meta.env.VITE_UPLOADS_BASE_URL || "http://localhost:5000/uploads";

export default axiosInstance;
