export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL;
