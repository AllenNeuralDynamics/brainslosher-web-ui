import axios from "axios";

export const api = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = {
      message:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error",
      status: error.response?.status,
      url: error.config?.url,
    };

    window.dispatchEvent(new CustomEvent("error", { detail: errorData }));

    return Promise.reject(error);
  },
);
