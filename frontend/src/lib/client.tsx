import axios from "axios";

export const API_BASE_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  response => response,
  error => {
    
    const errorData = {
      message:
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message ||                  
        "Unknown error",
      status: error.response?.status,
      url: error.config?.url,
    };

    window.dispatchEvent(new CustomEvent("api-error", { detail: errorData }));

    return Promise.reject(error);
  }
);