import axios from "axios";

export const apiBaseUrl =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL: `${apiBaseUrl}/api/v1`,
});
