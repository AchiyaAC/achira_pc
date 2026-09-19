import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000/api",

  // Render can take a little time to wake from sleep.
  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser/Axios set the multipart boundary automatically.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.config?.url,
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;
