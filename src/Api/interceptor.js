import axios from "axios";

const api = axios.create();
const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Dynamic token storage
let ACCESS_TOKEN = null;

export const setAccessToken = (token) => {
  ACCESS_TOKEN = token;
};

api.interceptors.request.use(
  (config) => {
    config.url = `${backendUrl}${config.url}`;

    if (ACCESS_TOKEN) {
      config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Unauthorized - Token expired?");
    }
    return Promise.reject(error);
  }
);

export default api;
