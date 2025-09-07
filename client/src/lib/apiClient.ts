import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // enable if backend uses cookies/sessions
});

export default api;
